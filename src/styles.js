// @ts-check
import { EMAIL_WIDTH, FONT_STACK, MONO_STACK, type } from './tokens.js';

/**
 * 產生一封信的 CSS。建置時整段塞進 `<style>`，由 juice inline 到每個標籤上；
 * 只有 `@media` 會留在 `<style>` 裡（部分客戶端會整段移除 `<style>`，
 * 所以留在裡面的必須是「沒有也不會壞」的增強）。
 *
 * 深色模式防禦：**每一條有 `color` 的規則都必須同時給 `background-color`**。
 * 只設其一，客戶端自動反轉時會變成同色相疊、文字直接消失。
 * `test/output.test.mjs` 會擋住漏設的情況。
 *
 * 外層卡片與頁尾是**直角**、彼此不留間距，對齊網頁設計稿。這偏離了 #1 寫的
 * 「圓角 20px／10–12px」，是視覺驗收後的決定；兒童與成人仍靠顏色與邊框粗細區分。
 *
 * 內層區塊（notice、可複製區塊、chip、按鈕）仍有圓角，規則是：
 * `border-radius` 放在 `<table>` 上只裁切**那張表格自己**的背景，裡面 `<td>` 畫的
 * 底色照樣是直角，會蓋在圓角上露出方形缺口。所以圓角容器的邊框與底色只能畫在
 * **一個**元素上；若內層 `<td>` 也必須有底色（深色模式防禦要求），那個 `<td>`
 * 要一起給圓角，半徑扣掉外框寬度（`radiusInnerInset`），否則角落會凸出外框一個像素。
 *
 * @param {import('./tokens.js').kids | import('./tokens.js').adult} palette 配色
 */
export function css(palette) {
  return `
    .body-bg { background-color: ${palette.bodyBg}; }

    .card {
      background-color: ${palette.cardBg};
      border: ${palette.cardBorderWidth} solid ${palette.cardBorder};
    }

    .h1 {
      font-family: ${FONT_STACK};
      font-size: ${type.h1.size};
      line-height: ${type.h1.line};
      font-weight: 700;
      color: ${palette.text};
      background-color: ${palette.cardBg};
    }
    .h2 {
      font-family: ${FONT_STACK};
      font-size: ${type.h2.size};
      line-height: ${type.h2.line};
      font-weight: 700;
      color: ${palette.accentDeep};
      background-color: ${palette.cardBg};
    }
    .h3 {
      font-family: ${FONT_STACK};
      font-size: ${type.h3.size};
      line-height: ${type.h3.line};
      font-weight: 700;
      color: ${palette.text};
      background-color: ${palette.cardBg};
    }
    .p {
      font-family: ${FONT_STACK};
      font-size: ${type.body.size};
      line-height: ${type.body.line};
      font-weight: 400;
      color: ${palette.text};
      background-color: ${palette.cardBg};
    }
    .p-muted {
      font-family: ${FONT_STACK};
      font-size: ${type.small.size};
      line-height: ${type.small.line};
      font-weight: 400;
      color: ${palette.textMuted};
      background-color: ${palette.cardBg};
    }

    .eyebrow {
      font-family: ${FONT_STACK};
      font-size: ${type.eyebrow.size};
      line-height: ${type.eyebrow.line};
      font-weight: 700;
      letter-spacing: 1px;
      color: ${palette.eyebrowText};
      background-color: ${palette.eyebrowBg};
      border-radius: 999px;
    }

    .step-no {
      font-family: ${FONT_STACK};
      font-size: ${type.small.size};
      line-height: 28px;
      font-weight: 700;
      color: ${palette.btnText};
      background-color: ${palette.accent};
      border-radius: 999px;
    }

    .divider { background-color: ${palette.divider}; line-height: 1px; font-size: 1px; }

    .notice {
      background-color: ${palette.cardBg};
      border: 1px solid ${palette.noticeBorder};
      border-radius: ${palette.radiusInner};
    }
    .notice-text {
      font-family: ${FONT_STACK};
      font-size: ${type.small.size};
      line-height: ${type.small.line};
      font-weight: 400;
      color: ${palette.text};
      background-color: ${palette.cardBg};
      border-radius: ${palette.radiusInnerInset};
    }

    .chip {
      font-family: ${MONO_STACK};
      font-size: ${type.body.size};
      line-height: ${type.body.line};
      font-weight: 700;
      color: ${palette.chipText};
      background-color: ${palette.chipBg};
      border: 1px solid ${palette.chipBorder};
      border-radius: ${palette.radiusInner};
    }

    .copy {
      background-color: ${palette.copyBg};
      border: 1px dashed ${palette.copyBorder};
      border-radius: ${palette.radiusInner};
    }
    .copy-text {
      font-family: ${MONO_STACK};
      font-size: ${type.small.size};
      line-height: 26px;
      font-weight: 400;
      color: ${palette.copyText};
      background-color: ${palette.copyBg};
      border-radius: ${palette.radiusInnerInset};
    }
    .copy-label {
      font-family: ${FONT_STACK};
      font-size: ${type.caption.size};
      line-height: ${type.caption.line};
      font-weight: 700;
      color: ${palette.textMuted};
      background-color: ${palette.copyBg};
      border-radius: ${palette.radiusInnerInset};
    }

    .btn { background-color: ${palette.btnBg}; border-radius: 999px; }
    .btn-a {
      font-family: ${FONT_STACK};
      font-size: ${type.body.size};
      line-height: ${type.body.line};
      font-weight: 700;
      color: ${palette.btnText};
      background-color: ${palette.btnBg};
      text-decoration: none;
      display: inline-block;
    }
    .btn-ghost { background-color: ${palette.btn2Bg}; border: 1px solid ${palette.btn2Border}; border-radius: 999px; }
    .btn-ghost-a {
      font-family: ${FONT_STACK};
      font-size: ${type.body.size};
      line-height: ${type.body.line};
      font-weight: 700;
      color: ${palette.btn2Text};
      background-color: ${palette.btn2Bg};
      text-decoration: none;
      display: inline-block;
    }

    .header { background-color: ${palette.cardBg}; }
    .footer { background-color: ${palette.footerBg}; }
    .footer-text {
      font-family: ${FONT_STACK};
      font-size: ${type.caption.size};
      line-height: ${type.caption.line};
      font-weight: 400;
      color: ${palette.footerMuted};
      background-color: ${palette.footerBg};
    }
    .footer-strong {
      font-family: ${FONT_STACK};
      font-size: ${type.small.size};
      line-height: ${type.small.line};
      font-weight: 700;
      color: ${palette.footerText};
      background-color: ${palette.footerBg};
    }
    .footer-btn { background-color: ${palette.footerBg}; border: 1px solid #4A4A4A; border-radius: 999px; }
    .footer-btn-a {
      font-family: ${FONT_STACK};
      font-size: ${type.small.size};
      line-height: ${type.small.line};
      font-weight: 700;
      color: ${palette.footerText};
      background-color: ${palette.footerBg};
      text-decoration: none;
      display: inline-block;
    }
    .footer-link {
      font-family: ${FONT_STACK};
      font-size: ${type.caption.size};
      line-height: ${type.caption.line};
      font-weight: 400;
      color: ${palette.footerMuted};
      background-color: ${palette.footerBg};
      text-decoration: underline;
    }

    .link {
      font-weight: 700;
      color: ${palette.accentDeep};
      background-color: transparent;
      text-decoration: underline;
    }
    .em {
      font-weight: 700;
      color: ${palette.text};
      background-color: transparent;
    }
    .var {
      font-weight: 700;
      color: ${palette.accentDeep};
      background-color: transparent;
    }
    .fill {
      font-weight: 700;
      color: ${palette.copyFill};
      background-color: transparent;
      text-decoration: underline;
    }
  `;
}

/**
 * 留在 `<style>` 裡的非關鍵增強。inline 樣式贏過 class，所以這裡一律 `!important`。
 */
export const mediaCss = `
    @media only screen and (max-width: ${EMAIL_WIDTH + 20}px) {
      .w-full { width: 100% !important; }
      .px { padding-left: 20px !important; padding-right: 20px !important; }
      .h1 { font-size: 22px !important; line-height: 32px !important; }
      .stack-btn { display: block !important; width: 100% !important; }
    }
    a[x-apple-data-detectors] { color: inherit !important; text-decoration: none !important; }
`;
