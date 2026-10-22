const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");
const timeHandler = require("./api/time");

const PORT = Number(process.env.PORT) || 3000;
const ROOT = __dirname;

const STATIC_FILES = {
  "/": { file: "index.html", type: "text/html; charset=utf-8" },
  "/index.html": { file: "index.html", type: "text/html; charset=utf-8" },
  "/styles.css": { file: "styles.css", type: "text/css; charset=utf-8" },
  "/script.js": { file: "script.js", type: "text/javascript; charset=utf-8" }
};

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host || "localhost"}`);

  if (url.pathname === "/api/time") {
    timeHandler(req, res);
    return;
  }

  const asset = STATIC_FILES[url.pathname];

  if (!asset) {
    res.statusCode = 404;
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.end("404 - 页面不存在");
    return;
  }

  fs.readFile(path.join(ROOT, asset.file), (error, content) => {
    if (error) {
      res.statusCode = 500;
      res.setHeader("Content-Type", "text/plain; charset=utf-8");
      res.end("500 - 无法读取页面文件");
      return;
    }

    res.statusCode = 200;
    res.setHeader("Content-Type", asset.type);
    res.setHeader("Cache-Control", "no-cache");
    res.end(content);
  });
});

server.listen(PORT, () => {
  console.log(`Hello World 网站已启动：http://localhost:${PORT}`);
});
