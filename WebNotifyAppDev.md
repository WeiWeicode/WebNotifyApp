Web Push 通知解決方案技術架構規格書

1. 專案目標

在不開發原生應用程式（iOS/Android Native App）的前提下，透過網頁技術實現跨平台推播通知。系統需結合使用者登入狀態，確保通知能精準發送給特定帳號。

2. 前端技術需求 (Front-end)

前端負責請求權限、註冊背景服務，並獲取裝置的唯一訂閱資訊。

技術組件

關鍵職責

必要性

Service Worker

核心組件。這是一個獨立於網頁主執行緒運作的腳本，即使瀏覽器關閉（Android）或螢幕鎖定，也能在背景接收推播事件並喚醒程式。

⭐⭐⭐⭐⭐ (必須)

Push API

瀏覽器提供的標準介面，用於向推播服務（如 FCM）請求訂閱，獲取 PushSubscription 物件。

⭐⭐⭐⭐⭐ (必須)

Notification API

用於配置通知的外觀（標題、內文、圖示、震動模式）並將其顯示給使用者。

⭐⭐⭐⭐⭐ (必須)

Web App Manifest (manifest.json)

JSON 設定檔，定義網站安裝後的名稱、圖示與啟動模式。這是 iOS Safari 啟用推播功能的先決條件 (必須將網站加入主畫面)。

⭐⭐⭐⭐⭐ (必須)

LocalStorage / IndexedDB

用於暫存使用者的登入 Token 與使用者的 UI 偏好設定。

⭐⭐⭐ (建議)

前端關鍵產出：Subscription Object

前端必須獲取如下格式的 JSON 物件並傳送給後端：

{
  "endpoint": "[https://fcm.googleapis.com/fcm/send/](https://fcm.googleapis.com/fcm/send/)...",
  "expirationTime": null,
  "keys": {
    "p256dh": "BKa...",
    "auth": "R2..."
  }
}


3. 後端技術需求 (Back-end)

後端負責管理使用者身份與訂閱資訊的綁定，並執行推播發送邏輯。

技術組件

關鍵職責

建議方案

資料庫 (Database)

建立「使用者 (User ID)」與「多個訂閱裝置 (Subscription Objects)」的一對多關聯表。

MySQL, PostgreSQL, MongoDB

VAPID Key Pair

一組公鑰與私鑰。公鑰放在前端用於訂閱，私鑰放在後端用於簽署推播請求，確保安全性。

透過 CLI 工具生成

Web Push Library

處理 VAPID 簽章加密與 HTTP 請求的函式庫，避免手動處理複雜的加密協定。

Node.js: web-push



Python: pywebpush



PHP: minishlink/web-push

API Endpoint

提供 API 讓前端在登入成功後，上傳 Subscription Object。

/api/subscribe

資料庫設計建議 (Schema)

TABLE user_subscriptions (
    id INT PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL, -- 關聯到您的 Users 表
    endpoint TEXT NOT NULL,        -- 訂閱網址 (唯一識別)
    p256dh KEY TEXT NOT NULL,      -- 加密金鑰 1
    auth KEY TEXT NOT NULL,        -- 加密金鑰 2
    user_agent VARCHAR(255),       -- 記錄裝置類型 (如 Android Chrome, iOS Safari)
    created_at TIMESTAMP
);


4. 雲端服務與協定 (Infrastructure)

作為後端與使用者裝置之間的中介傳輸層。

FCM (Firebase Cloud Messaging):

角色: 統一推播閘道。

原因: 雖然標準 Web Push 可以直接對應各瀏覽器廠商的伺服器，但使用 FCM 可以將 Chrome (Android/PC) 和其他瀏覽器的流量統一管理，穩定性較高。

APNs (Apple Push Notification service):

角色: iOS 系統層級的推播服務。

運作: 當後端發送訊息給 iOS PWA 用戶時，FCM/Web Push 協定會自動轉發給 APNs，再由 APNs 喚醒 iPhone。

5. 跨平台相容性與限制對照

平台

瀏覽器要求

使用者必要操作

接收狀態

Android 手機

Chrome, Edge, Firefox

點擊「允許通知」

✅ 瀏覽器關閉可接收

iOS (iPhone/iPad)

僅限 Safari (iOS 16.4+)

1. 點擊分享按鈕



2. 「加入主畫面」(Add to Home Screen)



3. 從主畫面開啟 App



4. 點擊「允許通知」

✅ 需安裝為 PWA 才能接收

Windows / Mac

Chrome, Edge, Safari

點擊「允許通知」

✅ 瀏覽器開啟中 (或背景執行) 可接收

6. 實作流程圖 (Workflow)

[前端] 使用者登入網站。

[前端] 檢查 navigator.serviceWorker 與 PushManager 支援度。

[前端] 請求通知權限 Notification.requestPermission()。

[前端] 權限 granted 後，向瀏覽器請求訂閱 (Subscribe)，取得 Subscription Object。

[前端] 呼叫後端 API，將 User ID + Subscription Object 傳送至伺服器。

[後端] 將資料存入資料庫。

[後端] 觸發事件（如：新訂單通知）。

[後端] 查詢該用戶的所有訂閱資料，使用 VAPID 私鑰簽署，發送 Request 給 FCM。

[裝置] 手機收到訊號，Service Worker 被喚醒，顯示通知。