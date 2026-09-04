// @ts-check
/**
 * 郵件版設計 token。
 *
 * Figma 的官網 token 用 CSS 變數與 Utopia 流體字級，郵件客戶端兩者都不支援，
 * 因此這裡是一份**固定值**對照表。字級已依郵件閱讀情境整體縮小
 * （網頁的 61px 大標放進 600px 寬的信裡不合理）。
 */

/** 信件寬度。表格式版型的唯一寬度來源，不使用 max-width。 */
export const EMAIL_WIDTH = 600;

/**
 * LINE Seed TW 在 Outlook 與 Gmail 不會載入，多數收件人看到的是後面的系統中文字體。
 * 這是已知且接受的落差。
 */
export const FONT_STACK =
  '"LINE Seed TW", -apple-system, BlinkMacSystemFont, "PingFang TC", "Microsoft JhengHei", "Noto Sans TC", sans-serif';

export const MONO_STACK =
  '"SFMono-Regular", Consolas, "Courier New", "PingFang TC", "Microsoft JhengHei", monospace';

/** Utopia clamp(11.11px, …, 61.04px) 換算後的固定級距。 */
export const type = {
  h1: { size: '26px', line: '38px' },
  h2: { size: '19px', line: '30px' },
  h3: { size: '17px', line: '27px' },
  body: { size: '16px', line: '28px' },
  small: { size: '14px', line: '24px' },
  caption: { size: '13px', line: '21px' },
  eyebrow: { size: '12px', line: '16px' },
};

/** 兩套配色共用的中性色。 */
export const neutral = {
  text: '#1A1A1A', // color/text/primary
  textMuted: '#5A5A5A',
  bodyBg: '#FAF8F4', // bg/surface-1
  cardBg: '#FFFFFF',
  divider: '#DFDFDF',
  footerBg: '#1A1A1A', // bg/footer
  footerText: '#FFFFFF',
  footerMuted: '#B8B8B8',
  copyBg: '#F1F1EF',
  copyBorder: '#DDDCD6',
  copyText: '#1A1A1A',
  copyFill: '#8A6A20', // 收件人要自己填的佔位符
};

/**
 * 兒童配色（信 1、2）。
 *
 * eyebrow 底色是設計稿的 rgba(244,203,200,0.5) 疊在白卡片上壓平後的實色——
 * Outlook 的 Word 引擎不支援 rgba，只能給實色。
 */
export const kids = {
  ...neutral,
  name: 'kids',
  accent: '#EF857D',
  accentDeep: '#C6504E',
  cardBorder: '#EF857D',
  cardBorderWidth: '2px',
  radius: '20px',
  radiusInner: '16px',
  radiusInset: '18px', // radius - cardBorderWidth
  radiusInnerInset: '15px', // radiusInner - 1px
  eyebrowBg: '#FAE5E4',
  eyebrowText: '#C6504E',
  btnBg: '#F5AF7E', // action/primary，配 #1A1A1A 字約 9.4:1
  btnText: '#1A1A1A',
  btnBorder: '#F5AF7E',
  btn2Bg: '#FFFFFF',
  btn2Text: '#C6504E',
  btn2Border: '#EF857D',
  noticeBorder: '#EF857D',
  chipBorder: '#EF857D',
  chipText: '#C6504E',
  chipBg: '#FFF7F6',
};

/** 成人配色（信 3–6）。大師班沿用，不另立風格。 */
export const adult = {
  ...neutral,
  name: 'adult',
  accent: '#4F518C', // category/adult-fill
  accentDeep: '#3B3D6B',
  cardBorder: '#E4E4EC',
  cardBorderWidth: '1px',
  radius: '12px',
  radiusInner: '10px',
  radiusInset: '11px', // radius - cardBorderWidth
  radiusInnerInset: '9px', // radiusInner - 1px
  eyebrowBg: '#ECECF4',
  eyebrowText: '#4F518C',
  btnBg: '#4F518C', // 配白字約 7.3:1
  btnText: '#FFFFFF',
  btnBorder: '#4F518C',
  btn2Bg: '#FFFFFF',
  btn2Text: '#4F518C',
  btn2Border: '#4F518C',
  noticeBorder: '#D7D7E2',
  chipBorder: '#C9C9DA',
  chipText: '#3B3D6B',
  chipBg: '#F6F6FA',
};

/** @type {Record<string, typeof kids | typeof adult>} */
export const palettes = { kids, adult };
