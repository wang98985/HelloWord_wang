const timeElement = document.getElementById("server-time");
const dateElement = document.getElementById("server-date");
const syncStatus = document.getElementById("sync-status");
const syncLabel = document.getElementById("sync-label");
const yearElement = document.getElementById("current-year");

const timeZone = "Asia/Shanghai";
const timeFormatter = new Intl.DateTimeFormat("zh-CN", {
  timeZone,
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hourCycle: "h23"
});
const dateFormatter = new Intl.DateTimeFormat("zh-CN", {
  timeZone,
  year: "numeric",
  month: "long",
  day: "numeric",
  weekday: "long"
});

let clockOffset = null;
let syncing = false;

function renderServerTime() {
  if (clockOffset === null) return;

  const now = new Date(Date.now() + clockOffset);
  timeElement.textContent = timeFormatter.format(now);
  dateElement.textContent = `${dateFormatter.format(now)} · 服务器实时时间`;
}

function setSyncState(isOnline) {
  syncStatus.classList.toggle("is-reconnecting", !isOnline);
  syncLabel.textContent = isOnline ? "已同步" : "重连中";
}

async function syncTime() {
  if (syncing) return;
  syncing = true;

  try {
    const response = await fetch("/api/time", { cache: "no-store" });
    if (!response.ok) throw new Error("服务器时间请求失败");

    const data = await response.json();
    if (!Number.isFinite(data.epochMs)) throw new Error("服务器时间格式无效");

    clockOffset = data.epochMs - Date.now();
    setSyncState(true);
    renderServerTime();
  } catch (error) {
    console.error(error);
    setSyncState(false);
    if (clockOffset === null) {
      dateElement.textContent = "暂时无法连接服务器，请稍后刷新";
    }
  } finally {
    syncing = false;
  }
}

yearElement.textContent = new Date().getFullYear();

timeElement.textContent = "--:--:--";
syncTime();

setInterval(renderServerTime, 250);
setInterval(syncTime, 30_000);

document.addEventListener("visibilitychange", () => {
  if (!document.hidden) syncTime();
});
