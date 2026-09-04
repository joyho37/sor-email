# sor-email

蕭博士 SoR 美語的六封課程通知信樣板。產出的是**六份 CSS 已 inline 的 HTML**，交給後端整合進寄信流程。

## 交付物

| 路徑 | 內容 |
|---|---|
| `dist/emails/*.html` | 六份完整 HTML，**保留 `{{變數}}` 原樣**。後端要拿的是這個 |
| `dist/preview/index.html` | 假資料預覽頁，六封信可切換。線上版在 <https://joyho37.github.io/sor-email/>，也可以直接用瀏覽器開檔 |
| `dist/assets/logo/` | 六封信 `<img src>` 指向的 logo 本體。站台自己託管，不掛在官網上 |
| `docs/variables.md` | 變數清單。後端要接的是這份，不要從 HTML 裡猜 |

`dist/` 有進版控：後端拿的是檔案，不是建置結果。改了 `src/` 就要重跑 `npm run build` 並把 `dist/` 一起提交（測試會擋住忘記重建的情況）。

## 部署

`dist/` 同時是 GitHub Pages 的網站根目錄。push 到 `main` 就由 `.github/workflows/pages.yml` 發佈：跑 `npm test`（沒過就不發佈），移掉 `dist/emails/`，其餘原樣上傳。不在 CI 重跑 build——站上放的就是版控裡的那份檔案。

站台做兩件事：給課務一個可以點的預覽網址，以及**替六封信託管 logo**。郵件不能用相對路徑，logo 需要一個不隨官網改版失效的公開網址（見 `docs/variables.md`）。

- **站台公開，但不進搜尋結果**：每一頁都帶 `<meta name="robots" content="noindex, nofollow">`。專案型 Pages 的 `robots.txt` 落在 `/sor-email/robots.txt` 而非網域根目錄，爬蟲不會讀，所以 meta 才是真正生效的那道；`robots.txt` 仍然產出，但只是將來換自訂網域時的保險。
- **`dist/emails/` 不上站**：交付給後端的檔案要保持乾淨、不塞 noindex，代價是不發佈。後端從 repo 拿。
- **repo 必須保持公開、不改名、不轉移**：logo 網址綁在上面，否則所有已寄出的信都會破圖。

noindex 只蓋得住站台的 HTML，還有兩處蓋不到，是轉公開時一併接受的：

- **repo 本身**：`github.com/joyho37/sor-email` 的頁面照樣可被搜尋引擎索引，也就是 `docs/copy/` 的文案、班期與老師姓名、`src/constants.js` 的聯繫人 LINE ID 都搜得到。把 `dist/emails/` 排除在站台之外擋的只是 Pages 那一條路。
- **logo 圖檔**：圖片不是頁，掛不了 meta；Pages 也不給設 `X-Robots-Tag`。圖片搜尋可能收錄那兩張 PNG。

## 指令

```bash
npm install
npm run build      # src/ → dist/
npm test           # 檢查產出的 HTML 是否符合郵件客戶端限制與變數清單
npm run typecheck
```

## 來源結構

```
src/
├── tokens.js        Figma token 換算成郵件安全的固定值（字級、顏色、圓角）
├── styles.js        由 token 產生的 CSS，建置時 inline 到每個標籤上
├── constants.js     六封信共用的常數（官方客服連結、logo 網址、tagline）
├── emails.js        六封信的清冊：主旨列、配色、變數白名單、預覽假資料
├── layout.ejs       表格式骨架
├── partials/        頁首、頁尾、按鈕、提示區塊、可複製區塊、步驟、關鍵字方塊
└── emails/          六封信的內容
```

## 已知的取捨

- **不用 MJML**：它會產生自己的 markup，精準對齊設計系統時會一直在跟它的抽象打架，且交付給後端的檔案不易閱讀。
- **外層卡片與頁尾是直角、中間不留間距，卡片外框兩套配色共用 1px 中性細框**：對齊網頁設計稿。這偏離 #1 寫的「圓角 20px／10–12px」與「兒童 2px 彩色邊框」，是視覺驗收後的決定，#1 的視覺規格段落需一併更新。內層區塊（提示、可複製區塊、關鍵字方塊、按鈕）仍有圓角與配色專屬的邊框色。
- **兒童與成人現在只靠顏色區分**：#1 原本列了顏色、邊框粗細、圓角、裝飾四項，後三項已在視覺驗收中拿掉。#1 自己就寫明圓角在 Outlook 會消失、顏色是唯一可靠的區分，所以辨識度不受影響。
- **圓角在 Outlook 會消失**：Windows 版 Outlook 用 Word 引擎渲染，接受內層圓角變直角。按鈕另有 VML 版本，形狀會保住。
- **LINE Seed TW 在 Outlook 與 Gmail 不會載入**：多數收件人看到的是系統中文字體。
- **深色模式只求不破版**：每個文字節點明確設 `color`、每個容器明確設 `background-color`，不做專屬配色。
- **只用 logo 一張圖**：其餘視覺全部是 HTML 色塊與邊框，圖片被擋掉後仍然存在。
- **`src/constants.js` 裡的官網與社群網址還是佔位符**，上線前必須替換（#10）。logo 網址已經定案，見上方「部署」。

決策脈絡見 `CONTEXT.md` 與 `docs/adr/`。
