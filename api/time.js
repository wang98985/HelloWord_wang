const TIME_ZONE = "Asia/Shanghai";

function getServerTime() {
  const now = new Date();

  const time = new Intl.DateTimeFormat("zh-CN", {
    timeZone: TIME_ZONE,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23"
  }).format(now);

  const date = new Intl.DateTimeFormat("zh-CN", {
    timeZone: TIME_ZONE,
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long"
  }).format(now);

  return {
    epochMs: now.getTime(),
    iso: now.toISOString(),
    timeZone: TIME_ZONE,
    time,
    date
  };
}

module.exports = function handler(req, res) {
  if (req.method !== "GET" && req.method !== "HEAD") {
    res.statusCode = 405;
    res.setHeader("Allow", "GET, HEAD");
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.end(JSON.stringify({ error: "Method Not Allowed" }));
    return;
  }

  const payload = getServerTime();

  res.statusCode = 200;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate");
  res.end(JSON.stringify(payload));
};
