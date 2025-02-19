# 点餐小程序后端服务

这是点餐小程序的后端服务，提供 RESTful API 接口。

## 功能特性

- 用户管理（积分系统）
- 菜品管理（增删改查）
- 订单管理（创建、查询）
- SQLite 数据存储

## 本地开发

```bash
# 安装依赖
npm install

# 开发模式运行（自动重启）
npm run dev

# 生产模式运行
npm start
```

## Render 部署指南

1. **准备工作**
   - 注册 [Render](https://render.com) 账号
   - 将代码推送到 GitHub 仓库

2. **部署步骤**
   - 登录 Render 控制台
   - 点击 "New +" 按钮
   - 选择 "Web Service"
   - 选择你的 GitHub 仓库
   - 填写以下信息：
     - Name: diancan-backend（或你喜欢的名称）
     - Environment: Node
     - Build Command: `npm install`
     - Start Command: `node app.js`
   - 点击 "Create Web Service"

3. **环境配置**
   - 部署完成后，服务会自动启动
   - 数据库文件会自动存储在 `/opt/render/project/src/data` 目录
   - 可以在 Environment 选项卡中添加环境变量

4. **访问服务**
   - 部署成功后，可以通过 `https://你的服务名.onrender.com` 访问
   - 首次访问可能需要等待约 30 秒服务启动

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
