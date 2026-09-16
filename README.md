# GO HEALTH 健康小學堂 Prototype

Phase 1 前端互動 Prototype，用於確認「健康小學堂」介面、答題流程、提示方式與結果頁體驗。

## Prototype 範圍

- 20 題示意題庫，集中於 `data/questions.js`
- 每次隨機 5 題、每題固定 4 選 1
- 同一輪題目不重複
- 再挑戰時優先避開上一輪 5 題
- 第一次答錯立即顯示提示並鎖定該錯誤選項
- 必須答對才能前進
- 每題答對後顯示解題小卡與一句重點
- 結果頁回顧本輪 5 題、正確答案、Takeaway，可展開完整解題
- 結果頁 CTA：`再挑戰 5 題`、`返回首頁`
- 手機、HAPPY GO WebView 與桌機 RWD
- 本地 `localStorage` 模擬 Session，方便 Phase 2 替換為 API / DB

> 注意：目前 20 題為 Prototype 示意內容，用來驗證 UI/UX，不代表正式上線題庫。正式版健康內容仍需依 GO HEALTH 內容治理、來源授權與專業審核流程確認。

## 專案結構

```text
.
├── index.html              # 開始頁 + 作答頁
├── result.html             # 獨立結果頁
├── css/
│   └── styles.css          # GO HEALTH Prototype 視覺與 RWD
├── data/
│   └── questions.js        # 20 題集中式題庫
├── js/
│   ├── quiz-service.js     # Session / 抽題 / 作答 / 結果資料層
│   ├── app.js              # 作答 UI 邏輯
│   └── result.js           # 結果頁 UI 邏輯
└── .github/workflows/
    └── pages.yml           # GitHub Pages 部署
```

## Phase 2 預留邊界

Prototype 刻意將 UI 與資料來源拆開。正式交付版預計由後端取代 `quiz-service.js` 目前使用的 localStorage / 本地題庫資料來源，可逐步串接：

1. Health UID / HG Token
2. Content Pack / Excel 或 DB 題庫
3. 後端 Session
4. Answer attempts log
5. 每日第一次完成給點判斷
6. 24 小時續答與跨裝置狀態
7. API / DB / 後台

前端頁面應盡量維持不變，降低與 TPM / Backend handoff 的重工。

## 本機預覽

這是純靜態 HTML / CSS / JavaScript，可直接以本機 Web Server 開啟。例如 VS Code Live Server。

## GitHub Pages

Push 至 `main` 後，GitHub Actions 會執行 Pages 部署工作流程。若 Repository 尚未啟用 Pages，請到：

`Settings → Pages → Build and deployment → Source → GitHub Actions`

完成一次設定後即可由 workflow 自動部署。
