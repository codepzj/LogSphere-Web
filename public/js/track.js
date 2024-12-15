(function () {
    "use strict";

    const API_URL = "http://localhost:8080/api/track"; // 替换为你的后端 API 地址
    const AUTO_TRACK = true; // 是否自动追踪页面访问
    const EXCLUDE_SEARCH = true; // 是否排除 URL 中的查询参数

    const { screen, navigator, location, document } = window;
    const { width, height } = screen;
    const { language, userAgent } = navigator;
    const { hostname, href, pathname, search, hash, origin } = location;
    const visitorId = getOrCreateVisitorId(); // 获取唯一访客 ID

    let referrer = document.referrer; // 上一个页面的 URL
    const currentScript = document.currentScript;
    const websiteId = currentScript.getAttribute("data-website-id");
    console.log(websiteId)
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

    // 处理 URL，去掉查询参数和 hash
    function cleanUrl(url) {
        const urlObj = new URL(url, origin);
        return EXCLUDE_SEARCH ? urlObj.pathname : urlObj.pathname + urlObj.search;
    }

    // 发送数据到后端
    async function sendToServer(payload) {
        try {
            await fetch(API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });
        } catch (err) {
            console.error("Failed to send tracking data", err);
        }
    }

    // 追踪页面访问
    function trackPageView() {
        const payload = {
            type: "pageview",
            data: {
                url: cleanUrl(href),
                referrer: referrer.startsWith(origin) ? "" : referrer,
                language: language,
                screen: `${width}x${height}`,
                visitorId: visitorId,
                userAgent: userAgent,
                timestamp: Date.now(),
            },
        };
        sendToServer(payload);
    }

    // 追踪自定义事件
    function trackEvent(name, data = {}) {
        const payload = {
            type: "event",
            data: {
                event: name,
                ...data,
                url: cleanUrl(href),
                visitorId: visitorId,
                timestamp: Date.now(),
            },
        };
        sendToServer(payload);
    }

    // 初始化自动追踪
    if (AUTO_TRACK) {
        if (document.readyState === "complete") {
            trackPageView();
        } else {
            window.addEventListener("load", trackPageView);
        }
    }

    // 暴露 API
    window.Tracker = {
        trackEvent,
        trackPageView,
    };

    console.log("Tracker initialized");
})();
