// 引入必要的包
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
require('dotenv').config();

// 创建Express应用
const app = express();

// 中间件配置
app.use(cors()); // 允许跨域访问
app.use(express.json()); // 解析JSON数据

// 数据库连接配置
let db;

const connectDB = async () => {
  try {
    db = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'todoapp'
    });

    console.log('✅ MySQL数据库连接成功');
    
    // 创建todos表（如果不存在）
    await createTodosTable();
  } catch (error) {
    console.error('❌ 数据库连接失败:', error.message);
    process.exit(1);
  }
};

// 创建todos表
const createTodosTable = async () => {
  try {
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS todos (
        id INT AUTO_INCREMENT PRIMARY KEY,
        text VARCHAR(255) NOT NULL,
        completed BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `;
    
    await db.execute(createTableQuery);
    console.log('✅ todos表检查/创建完成');
  } catch (error) {
    console.error('❌ 创建表失败:', error.message);
  }
};

// API路由

// 获取所有待办事项
app.get('/api/todos', async (req, res) => {
  try {
    const [rows] = await db.execute(
      'SELECT * FROM todos ORDER BY created_at DESC'
    );
    
    res.json({
      success: true,
      data: rows
    });
  } catch (error) {
    console.error('获取待办事项失败:', error);
    res.status(500).json({
      success: false,
      message: '获取待办事项失败',
      error: error.message
    });
  }
});

// 添加新的待办事项
app.post('/api/todos', async (req, res) => {
  try {
    const { text } = req.body;
    
    if (!text || text.trim() === '') {
      return res.status(400).json({
        success: false,
        message: '待办事项内容不能为空'
      });
    }

    const [result] = await db.execute(
      'INSERT INTO todos (text, completed) VALUES (?, ?)',
      [text.trim(), false]
    );
    
    // 获取刚插入的记录
    const [newTodo] = await db.execute(
      'SELECT * FROM todos WHERE id = ?',
      [result.insertId]
    );
    
    res.status(201).json({
      success: true,
      data: newTodo[0],
      message: '待办事项添加成功'
    });
  } catch (error) {
    console.error('添加待办事项失败:', error);
    res.status(500).json({
      success: false,
      message: '添加待办事项失败',
      error: error.message
    });
  }
});

// 更新待办事项状态
app.put('/api/todos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { completed } = req.body;
    
    // 检查待办事项是否存在
    const [existingTodo] = await db.execute(
      'SELECT * FROM todos WHERE id = ?',
      [id]
    );
    
    if (existingTodo.length === 0) {
      return res.status(404).json({
        success: false,
        message: '待办事项未找到'
      });
    }
    
    // 更新待办事项
    await db.execute(
      'UPDATE todos SET completed = ? WHERE id = ?',
      [completed, id]
    );
    
    // 获取更新后的记录
    const [updatedTodo] = await db.execute(
      'SELECT * FROM todos WHERE id = ?',
      [id]
    );
    
    res.json({
      success: true,
      data: updatedTodo[0],
      message: '状态更新成功'
    });
  } catch (error) {
    console.error('更新失败:', error);
    res.status(500).json({
      success: false,
      message: '更新失败',
      error: error.message
    });
  }
});

// 删除待办事项
app.delete('/api/todos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // 检查待办事项是否存在
    const [existingTodo] = await db.execute(
      'SELECT * FROM todos WHERE id = ?',
      [id]
    );
    
    if (existingTodo.length === 0) {
      return res.status(404).json({
        success: false,
        message: '待办事项未找到'
      });
    }
    
    // 删除待办事项
    await db.execute('DELETE FROM todos WHERE id = ?', [id]);
    
    res.json({
      success: true,
      message: '删除成功'
    });
  } catch (error) {
    console.error('删除失败:', error);
    res.status(500).json({
      success: false,
      message: '删除失败',
      error: error.message
    });
  }
});

// 健康检查接口
app.get('/api/health', async (req, res) => {
  try {
    // 测试数据库连接
    await db.execute('SELECT 1');
    
    res.json({
      success: true,
      message: '服务器运行正常',
      database: 'MySQL连接正常',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '服务器异常',
      database: '数据库连接失败',
      error: error.message
    });
  }
});

// 启动服务器
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`🚀 服务器运行在端口 ${PORT}`);
    console.log(`📝 API文档: http://localhost:${PORT}/api/health`);
    console.log(`💾 数据库: MySQL`);
  });
};

// 优雅关闭
process.on('SIGINT', async () => {
  console.log('\n正在关闭服务器...');
  if (db) {
    await db.end();
    console.log('✅ 数据库连接已关闭');
  }
  process.exit(0);
});

startServer();