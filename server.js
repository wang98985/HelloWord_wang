const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;

// 你的名字 —— 把这里改成你自己的名字
const YOUR_NAME = "豆包";

const server = http.createServer((req, res) => {
  // 处理首页请求
  if (req.url === '/' || req.url === '/index.html') {
    fs.readFile(path.join(__dirname, 'public', 'index.html'), 'utf8', (err, data) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('服务器内部错误');
        return;
      }
      // 把模板中的 {{NAME}} 和 {{SERVER_TIME}} 替换为实际值
      const now = new Date();
      const formattedTime = now.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      });
      const html = data
        .replace(/{{NAME}}/g, YOUR_NAME)
        .replace(/{{SERVER_TIME}}/g, formattedTime);

      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(html);
    });
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('404 - 页面不存在');
  }
});

server.listen(PORT, () => {
  console.log(`服务器已启动！请在浏览器访问: http://localhost:${PORT}`);
});
