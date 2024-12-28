(function () {
  "use strict";

  const API_URL = "http://localhost:8081/track/";
  const AUTO_TRACK = true;
  const EXCLUDE_SEARCH = true;
  const HEARTBEAT_INTERVAL = 30000;

  const visitorId = getOrCreateVisitorId();
  const websiteId = document.currentScript.getAttribute("data-website-id");

  let lastPageUrl = "";

  function getOrCreateVisitorId() {
    const key = "tracker_visitor_id";
    let id = localStorage.getItem(key);
    if (!id) {
      id = generateUniqueId();
      localStorage.setItem(key, id);
    }
    return id;
  }

  function generateUniqueId() {
    return Math.random().toString(36).substring(2, 15) + Date.now();
  }

  function updatePageInfo() {
    const { width, height } = screen;
    const { language, userAgent } = navigator;
    const { href, origin } = location;
    const referrer = document.referrer;
    return { width, height, language, userAgent, href, origin, referrer };
  }

  function cleanUrl(url) {
    const urlObj = new URL(url, location.origin);
    return EXCLUDE_SEARCH ? urlObj.pathname : urlObj.pathname + urlObj.search;
  }

  async function sendToServer(payload) {
    try {
      await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } catch (err) {
      console.error("Failed to send tracking data", err);
    }
  }

  function trackPageView() {
    lastPageUrl = location.href;
    localStorage.setItem("pageLoadTime", Date.now());
    const { width, height, language, userAgent, href, referrer } =
      updatePageInfo();
    const payload = {
      type: "pageview",
      visitorId: visitorId,
      url: cleanUrl(href),
      referrer: referrer.startsWith(origin) ? origin : referrer,
      language: language,
      screen: `${width}x${height}`,
      userAgent: userAgent,
      timestamp: Date.now(),
      website_id: websiteId,
    };
    sendToServer(payload);
  }

  function sendHeartbeat() {
    const payload = {
      type: "heartbeat",
      visitorId: visitorId,
      url: cleanUrl(window.location.href),
      timestamp: Date.now(),
      website_id: websiteId,
    };
    sendToServer(payload);
  }

  function sendPageDuration() {
    const pageLoadTime = localStorage.getItem("pageLoadTime");
    if (pageLoadTime === null) {
      localStorage.setItem("pageLoadTime", Date.now());
      return;
    }
    const stayDuration = Date.now() - pageLoadTime;
    if (stayDuration > 600000) return;
    const payload = {
      type: "pageduration",
      visitorId: visitorId,
      url: cleanUrl(lastPageUrl),
      stayDuration: stayDuration,
      timestamp: Date.now(),
      website_id: websiteId,
    };
    sendToServer(payload);
  }

  function sendPageBounce() {
    const payload = {
      type: "pagebounce",
      visitorId: visitorId,
      url: cleanUrl(window.location.href),
      timestamp: Date.now(),
      website_id: websiteId,
    };
    sendToServer(payload);
  }

  if (AUTO_TRACK) {
    if (document.readyState === "complete") {
      trackPageView();
    } else {
      window.addEventListener("load", trackPageView);
    }
    setInterval(sendHeartbeat, HEARTBEAT_INTERVAL);
  }

  if (window.history.pushState) {
    const originalPushState = history.pushState;
    history.pushState = async function (state, title, url) {
      originalPushState.apply(history, arguments);
      sendPageDuration();
      trackPageView();
    };
    window.addEventListener("popstate", function () {
      trackPageView();
    });
  }

  document.addEventListener("visibilitychange", function () {
    if (document.hidden) {
      sendPageDuration();
      sendPageBounce();
      localStorage.removeItem("pageLoadTime");
    } else {
      trackPageView();
    }
  });

  window.Tracker = { trackPageView };
})();
