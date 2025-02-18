const express = require('express');
const cors = require('cors');
const dishesRouter = require('./src/routes/dishes');
const usersRouter = require('./src/routes/users');
const ordersRouter = require('./src/routes/orders');
const { initDatabase } = require('./src/db/init');

const app = express();
const port = process.env.PORT || 3000;

// 中间件
app.use(cors());
app.use(express.json());

// 路由
app.use('/api/dishes', dishesRouter);
app.use('/api/users', usersRouter);
app.use('/api/orders', ordersRouter);

// 初始化数据库
initDatabase().then(() => {
  console.log('数据库初始化成功');
}).catch(err => {
  console.error('数据库初始化失败:', err);
});

// 启动服务器
app.listen(port, () => {
  console.log(`服务器运行在 http://localhost:${port}`);
});
