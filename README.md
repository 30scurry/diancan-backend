# diancan-backend
点餐app后端

# 点餐小程序后端服务

这是点餐小程序的后端服务，提供 RESTful API 接口。

## 功能特性

- 用户管理（积分系统）
- 菜品管理（增删改查）
- 订单管理（创建、查询）
- SQLite 数据存储

## 安装

```bash
# 安装依赖
npm install

# 开发模式运行（自动重启）
npm run dev

# 生产模式运行
npm start
```

## API 接口

### 菜品相关
- GET /api/dishes - 获取所有菜品
- POST /api/dishes - 添加新菜品
- PUT /api/dishes/:dishId - 更新菜品
- DELETE /api/dishes/:dishId - 删除菜品
- DELETE /api/dishes/name/:name - 通过名字删除菜品

### 用户相关
- GET /api/users/:userId/points - 获取用户积分
- PUT /api/users/:userId/points - 更新用户积分
- GET /api/users/:userId/isAdmin - 检查用户是否是管理员

### 订单相关
- POST /api/orders - 创建新订单
- GET /api/orders/user/:userId - 获取用户订单
- GET /api/orders/:orderId - 获取订单详情

## 数据库结构

### users 表
- id: INTEGER PRIMARY KEY
- userId: TEXT UNIQUE
- username: TEXT
- points: INTEGER
- isAdmin: INTEGER

### dishes 表
- id: INTEGER PRIMARY KEY
- dishId: TEXT UNIQUE
- name: TEXT
- points: INTEGER
- description: TEXT
- imageUrl: TEXT
- soldCount: INTEGER

### orders 表
- id: INTEGER PRIMARY KEY
- orderId: TEXT UNIQUE
- userId: TEXT
- totalPoints: INTEGER
- status: TEXT
- createdAt: DATETIME

### order_items 表
- id: INTEGER PRIMARY KEY
- orderId: TEXT
- dishId: TEXT
- quantity: INTEGER
- points: INTEGER
