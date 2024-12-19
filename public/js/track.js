(function () {
    "use strict";

    const API_URL = "http://localhost:8080/track/"; // 替换为你的后端 API 地址
    const AUTO_TRACK = true; // 是否自动追踪页面访问
    const EXCLUDE_SEARCH = true; // 是否排除 URL 中的查询参数
    const HEARTBEAT_INTERVAL = 30000; // 设置心跳包发送间隔，单位：毫秒（30秒）

    const { screen, navigator, location, document } = window;
    const { width, height } = screen;
    const { language, userAgent } = navigator;
    const { href, origin } = location;
    const visitorId = getOrCreateVisitorId(); // 获取唯一访客 ID

    let referrer = document.referrer; // 上一个页面的 URL
    const currentScript = document.currentScript;
    const websiteId = currentScript.getAttribute("data-website-id");

    console.log(websiteId);
    // getUserIP()
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

    // async function getUserIP() {
    //     try {
    //         const response = await fetch("https://ip.sb/", {
    //             method: "GET", // 使用 GET 方法来获取数据
    //             mode: "no-cors", // 允许跨域请求
    //             cache: "no-cache", // 不使用缓存
    //             credentials: "omit" // 不发送凭据
    //         });

    //         if (!response.ok) {
    //             throw new Error('Network response was not ok ' + response.statusText);
    //         }

    //         const data = await response.json(); // 解析 JSON 数据
    //         console.log(data); // 处理数据
    //         return data; // 返回解析后的数据，以便可以在调用的地方使用
    //     } catch (error) {
    //         console.error('There has been a problem with your fetch operation:', error);
    //         // 在这里你可以选择抛出错误或返回一个默认值
    //         throw error;
    //     }
    // }
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
            visitorId: visitorId,
            url: cleanUrl(href),
            referrer: referrer.startsWith(origin) ? origin : referrer,
            language: language,
            screen: `${width}x${height}`,
            userAgent: userAgent,
            timestamp: Date.now(),
            website_id: websiteId // 外键是ProgramModel的websiteId
        };
        sendToServer(payload);
    }

    // 发送心跳包
    function sendHeartbeat() {
        const payload = {
            type: "heartbeat",
            visitorId: visitorId,
            url: cleanUrl(href),
            timestamp: Date.now(),
            website_id: websiteId
        };
        sendToServer(payload);
    }

    // 计算页面停留时长并发送
    function sendPageStayTime() {
        const pageLoadTime = localStorage.getItem("pageLoadTime"); // 获取页面加载时的时间戳
        const stayDuration = Date.now() - pageLoadTime; // 计算页面停留时长（单位：毫秒）

        const payload = {
            type: "pageStayTime", // 自定义类型，可以根据需求调整
            visitorId: visitorId,
            url: cleanUrl(href),
            stayDuration: stayDuration, // 页面停留时长
            timestamp: Date.now(),
            website_id: websiteId
        };

        sendToServer(payload);
    }

    // 初始化自动追踪
    if (AUTO_TRACK) {
        if (document.readyState === "complete") {
            trackPageView(); // 页面加载完成后只发送一次 pageview
        } else {
            window.addEventListener("load", trackPageView); // 页面加载时触发 pageview
        }

        // 启动心跳包定时器
        setInterval(sendHeartbeat, HEARTBEAT_INTERVAL); // 每30秒发送一次心跳包
    }

    // 在页面加载时记录加载时间
    localStorage.setItem("pageLoadTime", Date.now());

    // 监听页面关闭事件，计算停留时间并发送
    window.addEventListener("beforeunload", function () {
        sendPageStayTime(); // 在页面关闭前发送停留时间
    });

    // 暴露 API
    window.Tracker = {
        trackPageView,
    };

    console.log("Tracker initialized");
})();
