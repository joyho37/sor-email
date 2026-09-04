// @ts-check

/**
 * Outlook 專用的 VML 要活在條件註解裡，反過來「非 Outlook」的區塊要用
 * downlevel-revealed 註解（`<!--[if !mso]><!-->`）。後者不是合法註解，
 * 經過 CSS inliner 的 HTML parser 會被拆壞，所以模板先寫成**合法註解的哨兵**，
 * 等 inline 完成後再換回真正的條件註解。見 `scripts/build.mjs`。
 */
export const SENTINELS = {
  notMsoOpen: '<!--NOT_MSO_OPEN-->',
  notMsoClose: '<!--NOT_MSO_CLOSE-->',
};

/** inline 完成後套用的還原表。 */
export const SENTINEL_REPLACEMENTS = [
  [SENTINELS.notMsoOpen, '<!--[if !mso]><!-->'],
  [SENTINELS.notMsoClose, '<!--<![endif]-->'],
];

/**
 * 垂直間距。用 td 的高度做，不用 margin——Outlook 的 Word 引擎不吃 margin。
 * @param {number} px
 * @param {string} bg 明確的背景色。留空會在深色模式反轉時破版。
 */
export function spacer(px, bg) {
  return `<tr><td height="${px}" style="height:${px}px;line-height:${px}px;font-size:0;background-color:${bg};">&nbsp;</td></tr>`;
}
