const express = require('express');
const router = express.Router();
const { getDatabase } = require('../db/init');

// 创建新订单
router.post('/', async (req, res) => {
  const { userId, orderItems, totalPoints } = req.body;
  const orderId = Date.now().toString();
  const db = getDatabase();

  db.serialize(() => {
    db.run('BEGIN TRANSACTION');

    // 创建订单
    db.run(
      'INSERT INTO orders (orderId, userId, totalPoints) VALUES (?, ?, ?)',
      [orderId, userId, totalPoints],
      function(err) {
        if (err) {
          db.run('ROLLBACK');
          res.status(500).json({ error: err.message });
          return;
        }

        // 添加订单项目
        const stmt = db.prepare(
          'INSERT INTO order_items (orderId, dishId, quantity, points) VALUES (?, ?, ?, ?)'
        );

        let hasError = false;
        orderItems.forEach(item => {
          stmt.run([orderId, item.dishId, item.quantity, item.points], err => {
            if (err) {
              hasError = true;
              db.run('ROLLBACK');
              res.status(500).json({ error: err.message });
              return;
            }
          });
        });

        stmt.finalize();

        if (!hasError) {
          // 更新用户积分
          db.run(
            'UPDATE users SET points = points - ? WHERE userId = ?',
            [totalPoints, userId],
            function(err) {
              if (err) {
                db.run('ROLLBACK');
                res.status(500).json({ error: err.message });
                return;
              }

              // 更新菜品销量
              const updateSoldCount = db.prepare(
                'UPDATE dishes SET soldCount = soldCount + ? WHERE dishId = ?'
              );

              orderItems.forEach(item => {
                updateSoldCount.run([item.quantity, item.dishId]);
              });

              updateSoldCount.finalize();

              db.run('COMMIT');
              res.json({ orderId });
            }
          );
        }
      }
    );
  });
});

// 获取用户订单
router.get('/user/:userId', async (req, res) => {
  const { userId } = req.params;
  const db = getDatabase();

  db.all(
    `SELECT o.*, json_group_array(
      json_object(
        'dishId', oi.dishId,
        'quantity', oi.quantity,
        'points', oi.points
      )
    ) as items
    FROM orders o
    LEFT JOIN order_items oi ON o.orderId = oi.orderId
    WHERE o.userId = ?
    GROUP BY o.orderId
    ORDER BY o.createdAt DESC`,
    [userId],
    (err, rows) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      
      // 解析 items 字符串为 JSON 数组
      rows.forEach(row => {
        row.items = JSON.parse(row.items);
      });
      
      res.json(rows);
    }
  );
});

// 获取订单详情
router.get('/:orderId', async (req, res) => {
  const { orderId } = req.params;
  const db = getDatabase();

  db.get(
    `SELECT o.*, json_group_array(
      json_object(
        'dishId', oi.dishId,
        'quantity', oi.quantity,
        'points', oi.points
      )
    ) as items
    FROM orders o
    LEFT JOIN order_items oi ON o.orderId = oi.orderId
    WHERE o.orderId = ?
    GROUP BY o.orderId`,
    [orderId],
    (err, row) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      if (!row) {
        res.status(404).json({ error: '订单不存在' });
        return;
      }
      
      // 解析 items 字符串为 JSON 数组
      row.items = JSON.parse(row.items);
      
      res.json(row);
    }
  );
});

module.exports = router;
