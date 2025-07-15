# Todo应用项目

这是一个简单的全栈Todo应用，包含前端、后端和MySQL数据库。

## 项目结构

```
my-todo-app/
├── frontend/           # 前端代码
│   ├── index.html     # 主页面
│   └── package.json   # 前端依赖
└── backend/           # 后端代码
    ├── server.js      # 服务器入口
    ├── package.json   # 后端依赖
    ├── .env           # 环境变量
    └── .env.example   # 环境变量示例
```

## 功能特性

- ✅ 添加新的待办事项
- ✅ 查看所有待办事项
- ✅ 标记事项为完成/未完成
- ✅ 删除待办事项
- ✅ 实时数据同步
- ✅ 响应式设计
- ✅ 错误处理和用户提示

## 技术栈

**前端:**
- HTML5 + CSS3 + JavaScript (ES6+)
- 响应式设计
- Fetch API

**后端:**
- Node.js + Express.js
- MySQL + mysql2
- CORS支持

## 本地运行

### 1. 安装MySQL数据库

**Windows:**
- 下载MySQL Installer: https://dev.mysql.com/downloads/installer/
- 安装时记住root用户的密码

**Mac:**
```bash
# 使用Homebrew安装
brew install mysql

# 启动MySQL服务
brew services start mysql

# 设置root密码
mysql_secure_installation
```

**Linux (Ubuntu):**
```bash
sudo apt update
sudo apt install mysql-server
sudo mysql_secure_installation
```

### 2. 创建数据库

```sql
# 登录MySQL
mysql -u root -p

# 创建数据库
CREATE DATABASE todoapp;

# 退出
exit;
```

### 3. 配置环境变量

复制 `.env.example` 为 `.env` 并配置：
```bash
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=你的MySQL密码
DB_NAME=todoapp
```

### 4. 安装后端依赖并启动

```bash
cd backend
npm install
npm start
```

### 5. 运行前端

直接在浏览器中打开 `frontend/index.html` 文件。

## 数据库表结构

系统会自动创建 `todos` 表：

```sql
CREATE TABLE todos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  text VARCHAR(255) NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## API接口

### 获取所有待办事项
- **GET** `/api/todos`
- 返回: `{ success: true, data: [todos] }`

### 添加待办事项
- **POST** `/api/todos`
- 参数: `{ text: "待办事项内容" }`
- 返回: `{ success: true, data: todo }`

### 更新待办事项状态
- **PUT** `/api/todos/:id`
- 参数: `{ completed: true/false }`
- 返回: `{ success: true, data: todo }`

### 删除待办事项
- **DELETE** `/api/todos/:id`
- 返回: `{ success: true, message: "删除成功" }`

### 健康检查
- **GET** `/api/health`
- 返回: `{ success: true, message: "服务器运行正常", database: "MySQL连接正常" }`

## VS Code运行指南

### 1. 安装VS Code和Node.js
- VS Code: https://code.visualstudio.com/
- Node.js: https://nodejs.org/

### 2. 打开项目
- 启动VS Code
- File → Open Folder → 选择 `my-todo-app` 文件夹

### 3. 打开集成终端
- 快捷键: `Ctrl + `` (反引号)
- 或菜单: Terminal → New Terminal

### 4. 运行后端
```bash
cd backend
npm install
npm start
```

### 5. 测试应用
- 后端: 访问 http://localhost:5000/api/health
- 前端: 双击打开 `frontend/index.html`

## 部署说明

### 生产环境部署
- **前端**: 可部署到Netlify、Vercel等静态托管平台
- **后端**: 可部署到Railway、Render等Node.js托管平台  
- **数据库**: 推荐使用PlanetScale、Railway MySQL等云数据库

### 环境变量配置
在生产环境中需要设置：
- `DB_HOST`: 数据库主机地址
- `DB_USER`: 数据库用户名
- `DB_PASSWORD`: 数据库密码
- `DB_NAME`: 数据库名称
- `NODE_ENV`: 环境标识（production）
- `PORT`: 服务器端口（由平台自动设置）

## 常见问题

### MySQL连接失败
1. 确认MySQL服务已启动
2. 检查用户名和密码是否正确
3. 确认数据库 `todoapp` 已创建

### 端口被占用
修改 `.env` 文件中的 `PORT` 值

### 权限问题
确保MySQL用户有足够权限访问数据库