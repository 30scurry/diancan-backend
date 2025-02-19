const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const { createTables } = require('./schema');

// 根据环境选择数据库路径
const dbPath = process.env.NODE_ENV === 'production'
  ? path.join('/opt/render/project/src/data', 'restaurant.db')
  : path.resolve(__dirname, '../../restaurant.db');

let db;

function getDatabase() {
  if (!db) {
    // 确保数据库目录存在
    const dbDir = path.dirname(dbPath);
    if (!require('fs').existsSync(dbDir)) {
      require('fs').mkdirSync(dbDir, { recursive: true });
    }

    db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        console.error('连接数据库失败:', err);
      } else {
        console.log('成功连接到数据库');
        console.log('数据库路径:', dbPath);
      }
    });
  }
  return db;
}

async function initDatabase() {
  const db = getDatabase();
  
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // 启用外键约束
      db.run('PRAGMA foreign_keys = ON');
      
      // 创建表
      createTables(db)
        .then(() => {
          console.log('数据库表创建成功');
          resolve();
        })
        .catch(err => {
          console.error('创建表失败:', err);
          reject(err);
        });
    });
  });
}

module.exports = {
  getDatabase,
  initDatabase
};
