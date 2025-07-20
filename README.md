# Endless Note

一个简洁的无限笔记应用，支持按日期自动分组和实时保存。

## 功能特点

- 📝 **无限记录**：打开就能写，无需创建文件
- 📅 **自动分组**：按日期自动创建时间戳分割线
- 💾 **双重保存**：本地实时保存 + 服务器延迟保存
- 🗑️ **智能清理**：空内容自动删除
- ⌨️ **快捷操作**：Ctrl+S 强制保存
- 🎨 **简洁界面**：深色主题，专注写作

## 安装使用

```bash
# 克隆项目
git clone https://github.com/chy4pro/endless-note.git
cd endless-note

# 安装依赖
npm install

# 启动应用
npm start
```

访问 http://localhost:3000 开始使用

## 技术栈

- **前端**：TypeScript + HTML + CSS
- **后端**：Node.js + Express
- **存储**：JSON 文件按日期分离存储

## 项目结构

```
endless-note/
├── src/main.ts          # 前端逻辑
├── index.html           # 主页面
├── server/server.js     # 后端服务
├── server/notes/        # 笔记存储目录
└── dist/               # 编译输出
```

## 特性说明

### 时间戳分割线
- 每天首次写入时自动创建日期分割线
- 时间戳不可编辑，确保日期准确性

### 自动保存机制
- 输入时立即保存到本地存储
- 2秒延迟保存到服务器
- 页面关闭时强制保存

### 智能内容管理
- 空白历史日期会在失去焦点时自动删除
- 今天的空白区域始终保留
- 支持复制粘贴和各种输入方式

## 开发

```bash
# 编译 TypeScript
npm run build

# 启动开发服务器
npm start
```

## License

MIT