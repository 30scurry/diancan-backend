const express = require('express');
const router = express.Router();
const { getDatabase } = require('../db/init');

// 获取用户积分
router.get('/:userId/points', async (req, res) => {
  const { userId } = req.params;
  const db = getDatabase();
  
  db.get('SELECT points FROM users WHERE userId = ?', [userId], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!row) {
      res.status(404).json({ error: '用户不存在' });
      return;
    }
    res.json({ points: row.points });
  });
});

// 更新用户积分
router.put('/:userId/points', async (req, res) => {
  const { userId } = req.params;
  const { points } = req.body;
  const db = getDatabase();
  
  db.run(
    'UPDATE users SET points = ? WHERE userId = ?',
    [points, userId],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      if (this.changes === 0) {
        res.status(404).json({ error: '用户不存在' });
        return;
      }
      res.json({ success: true });
    }
  );
});

// 检查用户是否是管理员
router.get('/:userId/isAdmin', async (req, res) => {
  const { userId } = req.params;
  const db = getDatabase();
  
  db.get('SELECT isAdmin FROM users WHERE userId = ?', [userId], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!row) {
      res.status(404).json({ error: '用户不存在' });
      return;
    }
    res.json({ isAdmin: row.isAdmin === 1 });
  });
});

// 获取所有用户
router.get('/', async (req, res) => {
  const db = getDatabase();
  
  db.all('SELECT * FROM users', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

module.exports = router;
