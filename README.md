# 健康小學堂 Prototype

Phase 1 前端互動 Prototype，用於確認「健康小學堂」介面、答題流程、提示方式與結果頁體驗。

## 題庫管理方式

目前題庫唯一來源為：

`data/健康小學堂_題庫_v0.1.xlsx`

網頁啟動時會直接下載並解析 Excel 的 `questions` 工作表，因此更新 Prototype 題庫時，只需要維護 Excel，不需要另外同步修改 JavaScript 題目檔。

目前 v0.1 共 30 題，欄位為：

`question_id / category / knowledge_point_id / question / option_a / option_b / option_c / option_d / answer / hint / explanation / takeaway / source / review_required`

其中：
- `answer`：填 A / B / C / D
- `review_required`：政策、數值或時效性較高的題目填 Y
- `source`：保留衛教來源 URL，方便後續審題

> 目前 Excel 直接讀取方式是 Prototype 的簡化方案。正式產品若進入後端與內容管理階段，建議由 API / DB 輸出題目資料，前端介面不需要因此重做。

## Prototype 範圍

- 30 題 Excel 題庫，每次隨機 5 題
- 每題固定 4 選 1
- 同一輪題目不重複
- 再挑戰時優先避開上一輪 5 題
- 第一次答錯立即顯示 Hint 並鎖定錯誤選項
- 必須答對才能前進
- 每題答對後顯示「健康小提醒」與「重點畫起來」
- 結果頁回顧本輪 5 題
- 「返回首頁」連回 GO HEALTH 主 Prototype
- 手機、HAPPY GO WebView 與桌機 RWD
- `localStorage` 模擬 Session

## 專案結構

```text
.
├── index.html
├── result.html
├── css/
│   └── styles.css
├── data/
│   └── 健康小學堂_題庫_v0.1.xlsx
├── js/
│   ├── question-loader.js  # Excel → 前端題目物件
│   ├── quiz-service.js     # Session / 抽題 / 作答 / 結果
│   ├── app.js
│   └── result.js
└── .github/workflows/
    └── pages.yml
```

## Phase 2 預留邊界

正式版可將 Excel Loader 替換成 API / DB，而保留目前作答 UI 與互動：

1. Health UID / HG Token
2. Content Pack / DB 題庫
3. 後端 Session
4. Answer attempts log
5. 每日第一次完成給點判斷
6. 24 小時續答與跨裝置狀態
7. 後台題庫管理

## GitHub Pages

Push 至 `main` 後，GitHub Actions 會自動部署 GitHub Pages。
