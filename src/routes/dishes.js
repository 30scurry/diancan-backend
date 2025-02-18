const express = require('express');
const router = express.Router();
const { getDatabase } = require('../db/init');

// 获取所有菜品
router.get('/', async (req, res) => {
  const db = getDatabase();
  db.all('SELECT * FROM dishes ORDER BY name', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// 添加新菜品
router.post('/', async (req, res) => {
  const { name, points, description } = req.body;
  const dishId = Date.now().toString();
  
  const db = getDatabase();
  db.run(
    'INSERT INTO dishes (dishId, name, points, description) VALUES (?, ?, ?, ?)',
    [dishId, name, points, description],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      
      db.get('SELECT * FROM dishes WHERE id = ?', [this.lastID], (err, row) => {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
        res.json(row);
      });
    }
  );
});

// 更新菜品
router.put('/:dishId', async (req, res) => {
  const { name, points, description } = req.body;
  const { dishId } = req.params;
  
  const db = getDatabase();
  db.run(
    'UPDATE dishes SET name = ?, points = ?, description = ? WHERE dishId = ?',
    [name, points, description, dishId],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      
      if (this.changes === 0) {
        res.status(404).json({ error: '菜品不存在' });
        return;
      }
      
      db.get('SELECT * FROM dishes WHERE dishId = ?', [dishId], (err, row) => {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
        res.json(row);
      });
    }
  );
});

// 删除菜品
router.delete('/:dishId', async (req, res) => {
  const { dishId } = req.params;
  
  const db = getDatabase();
  db.run('DELETE FROM dishes WHERE dishId = ?', [dishId], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    
    if (this.changes === 0) {
      res.status(404).json({ error: '菜品不存在' });
      return;
    }
    
    res.json({ success: true });
  });
});

// 通过名字删除菜品
router.delete('/name/:name', async (req, res) => {
  const { name } = req.params;
  
  const db = getDatabase();
  db.run('DELETE FROM dishes WHERE name = ?', [name], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    
    if (this.changes === 0) {
      res.status(404).json({ error: '菜品不存在' });
      return;
    }
    
    res.json({ success: true });
  });
});

module.exports = router;
