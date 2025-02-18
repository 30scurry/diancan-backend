async function createTables(db) {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // 创建用户表
      db.run(`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          userId TEXT UNIQUE NOT NULL,
          username TEXT NOT NULL,
          points INTEGER DEFAULT 0,
          isAdmin INTEGER DEFAULT 0
        )
      `);

      // 创建菜品表
      db.run(`
        CREATE TABLE IF NOT EXISTS dishes (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          dishId TEXT UNIQUE NOT NULL,
          name TEXT NOT NULL,
          points INTEGER NOT NULL,
          description TEXT,
          imageUrl TEXT,
          soldCount INTEGER DEFAULT 0
        )
      `);

      // 创建订单表
      db.run(`
        CREATE TABLE IF NOT EXISTS orders (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          orderId TEXT UNIQUE NOT NULL,
          userId TEXT NOT NULL,
          totalPoints INTEGER NOT NULL,
          status TEXT DEFAULT 'pending',
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (userId) REFERENCES users(userId)
        )
      `);

      // 创建订单项目表
      db.run(`
        CREATE TABLE IF NOT EXISTS order_items (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          orderId TEXT NOT NULL,
          dishId TEXT NOT NULL,
          quantity INTEGER NOT NULL,
          points INTEGER NOT NULL,
          FOREIGN KEY (orderId) REFERENCES orders(orderId),
          FOREIGN KEY (dishId) REFERENCES dishes(dishId)
        )
      `, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  });
}

module.exports = {
  createTables
};
