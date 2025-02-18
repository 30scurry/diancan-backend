const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const { createTables } = require('./schema');

const dbPath = path.resolve(__dirname, '../../restaurant.db');
let db;

function getDatabase() {
  if (!db) {
    db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        console.error('连接数据库失败:', err);
      } else {
        console.log('成功连接到数据库');
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
