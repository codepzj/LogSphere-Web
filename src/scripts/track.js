(function () {
  "use strict";

  const API_URL = "__WEBSOCKET_API__";
  const AUTO_TRACK = true; // 是否自动追踪页面访问
  const EXCLUDE_SEARCH = true; // 是否排除 URL 中的查询参数
  const HEARTBEAT_INTERVAL = 30000; // 设置心跳包发送间隔，单位：毫秒（30秒）
  const RECONNECT_INTERVAL = 5000; // 重连间隔，单位：毫秒（5秒）)
  const MAX_RECONNECT_ATTEMPTS = 5; // 最大重连尝试次数

  let socket;
  let heartbeatIntervalId;
  let reconnectAttempts = 0;
  let visitorId = getOrCreateVisitorId(); // 获取唯一访客 ID
  let websiteId = ""; // 站点 ID (从 script 标签中获取)

  // 获取或创建访客唯一 ID
  function getOrCreateVisitorId() {
    const key = "tracker_visitor_id";
    let id = localStorage.getItem(key);
    if (!id) {
      id = generateUniqueId();
      localStorage.setItem(key, id);
    }
    return id;
  }

  // 生成唯一 ID
  function generateUniqueId() {
    return Math.random().toString(36).substring(2, 15) + Date.now();
  }

  // 获取必要的页面信息（每次路由变化时更新）
  function updatePageInfo() {
    const { screen, navigator, location, document } = window;
    const { width, height } = screen;
    const { language, userAgent } = navigator;
    const { href, origin } = location;
    const referrer = document.referrer;

    return {
      width,
      height,
      language,
      userAgent,
      href,
      origin,
      referrer,
    };
  }

  // 处理 URL，去掉查询参数和 hash
  function cleanUrl(url) {
    const urlObj = new URL(url, window.location.origin);
    return EXCLUDE_SEARCH ? urlObj.pathname : urlObj.pathname + urlObj.search;
  }

  // 发送数据到 WebSocket 服务器
  function sendToServer(payload) {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(payload));
    } else {
      console.error("WebSocket is not open. Dropping message.", payload);
    }
  }

  // 获取 IP 地址和位置（只在 pageview 时请求一次）
  async function fetchIpAndLocation() {
    try {
      const response = await fetch("https://ipapi.co/json/");
      const data = await response.json();
      return { ip: data.ip, location: data.country };
    } catch (error) {
      console.error("Failed to fetch IP and location:", error);
    }
  }

  // 追踪页面访问
  async function trackPageView() {
    console.log("Tracking page view");

    // 更新页面信息
    const { width, height, language, userAgent, href, origin, referrer } =
      updatePageInfo();

    // 等待 IP 和位置信息获取完成
    // const { ip, location } = await fetchIpAndLocation(); // 等待 IP 和位置数据

    const payload = {
      type: "pageview", // 类型为 pageview
      visitorId: visitorId, // 唯一访客 ID
      url: cleanUrl(href), // 页面 URL
      referrer: referrer.startsWith(origin) ? origin : referrer, // 上一个页面 URL
      language: language, // 浏览器语言
      screen: `${width}x${height}`, // 屏幕分辨率
      userAgent: userAgent, // 用户代理信息
      timestamp: Date.now(), // 当前时间戳
      website_id: websiteId, // 站点 ID
      // ip_addr: ip, // IP 地址
      // location: location, // 地理位置
    };

    sendToServer(payload);
  }

  // 发送心跳包
  function sendHeartbeat() {
    const payload = {
      type: "heartbeat", // 类型为 heartbeat
      visitorId: visitorId,
      url: cleanUrl(window.location.href),
      timestamp: Date.now(),
      website_id: websiteId,
    };
    sendToServer(payload);
  }

  // 计算页面停留时长并发送
  function sendPageStayTime() {
    const pageLoadTime = localStorage.getItem("pageLoadTime"); // 获取页面加载时的时间戳
    const stayDuration = Date.now() - pageLoadTime; // 计算页面停留时长（单位：毫秒）

    const payload = {
      type: "pageStayTime", // 自定义类型
      visitorId: visitorId,
      url: cleanUrl(window.location.href),
      stayDuration: stayDuration, // 页面停留时长
      timestamp: Date.now(),
      website_id: websiteId,
    };

    sendToServer(payload);
  }

  // 初始化 WebSocket 连接
  function initWebSocket() {
    socket = new WebSocket(API_URL);

    socket.onopen = function () {
      console.log("WebSocket connection established.");
      reconnectAttempts = 0; // 重置重连尝试次数
      if (AUTO_TRACK) {
        trackPageView(); // 页面加载完成后发送一次 pageview
      }

      // 启动心跳包定时器
      if (!heartbeatIntervalId) {
        heartbeatIntervalId = setInterval(sendHeartbeat, HEARTBEAT_INTERVAL); // 每30秒发送一次心跳包
      }
    };

    socket.onclose = function () {
      console.error("WebSocket connection closed.");
      if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
        reconnectAttempts++;
        console.log(
          `Attempting to reconnect in ${RECONNECT_INTERVAL / 1000} seconds...`
        );
        setTimeout(initWebSocket, RECONNECT_INTERVAL); // 5秒后重新连接
      } else {
        console.error("Max reconnect attempts reached. Giving up.");
      }
    };

    socket.onerror = function (error) {
      console.error("WebSocket error:", error);
      // 可以根据需要实现错误处理逻辑
    };
  }

  // 在页面加载时记录加载时间
  localStorage.setItem("pageLoadTime", Date.now());

  // 监听页面关闭事件，计算停留时间并发送
  window.addEventListener("beforeunload", function () {
    sendPageStayTime(); // 在页面关闭前发送停留时间
  });

  // 监听页面路由变化，触发 `trackPageView`
  if (window.history.pushState) {
    const originalPushState = history.pushState;
    history.pushState = function (state, title, url) {
      originalPushState.apply(history, arguments);
      trackPageView(); // 页面切换时触发 pageview
    };

    window.addEventListener("popstate", function () {
      trackPageView(); // 浏览器前进或后退时触发 pageview
    });
  }

  // 启动 WebSocket
  initWebSocket();

  // 获取站点 ID
  const currentScript = document.currentScript;
  websiteId = currentScript.getAttribute("data-website-id");

  // 暴露 API
  window.Tracker = {
    trackPageView,
  };

  console.log("Tracker initialized with WebSocket");
})();
