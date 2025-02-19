const express = require('express');
const cors = require('cors');
const dishesRouter = require('./src/routes/dishes');
const usersRouter = require('./src/routes/users');
const ordersRouter = require('./src/routes/orders');
const { initDatabase } = require('./src/db/init');

const app = express();
const port = process.env.PORT || 3000;

// 允许所有来源的跨域请求
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// 健康检查接口
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: '服务器运行正常' });
});

// API 路由
app.use('/api/dishes', dishesRouter);
app.use('/api/users', usersRouter);
app.use('/api/orders', ordersRouter);

// 初始化数据库
initDatabase().then(() => {
  console.log('数据库初始化成功');
}).catch(err => {
  console.error('数据库初始化失败:', err);
});

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: '服务器内部错误' });
});

// 启动服务器
app.listen(port, () => {
  console.log(`服务器运行在 http://localhost:${port}`);
});
