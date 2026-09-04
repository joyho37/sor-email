// @ts-check
/**
 * 六封信共用的常數。
 *
 * 這裡的每一項都**不是**系統變數：後端不需要傳值，寄信時原樣輸出。
 * 若人員或連結異動，改這個檔案後重新 `npm run build`。
 */

/** 品牌層級的 LINE 官方帳號。六封信共用，不隨班期變動。 */
export const OFFICIAL_LINE_URL = 'https://lin.ee/flrdUJ1';

/** 成人矯正班的課程聯繫人。課務未將其標為變數，故視為常數。 */
export const ADULT_CONTACT = { name: '怡如老師', lineId: 'sandyfiona' };

export const BRAND_NAME = '蕭博士 SoR 美語';
export const BRAND_TAGLINE = 'FoR you, FoR me, FoRmosa.';
export const COPYRIGHT = '© 2026 蕭博士 SoR 美語 · All rights reserved';

/**
 * TODO(#8)：以下網址仍是佔位符，待使用者上傳素材與確認官網網址後替換。
 *
 * 郵件不能用相對路徑，logo 需要長期穩定的公開網址；且該網址必須不隨官網改版失效
 * ——舊信裡的圖若掛在舊站，網站重建後會全部斷掉。
 *
 * 尺寸取自 `assets/logo/` 的 2x 素材：primary 420×154（1x 210×77）、
 * inverse 458×152（1x 229×76）。
 */
export const ASSETS = {
  logoPrimary: {
    url: 'https://REPLACE-ME.example.com/sor/logo-primary.png',
    width: 210,
    height: 77,
    alt: '蕭博士 SoR 美語',
    /** 預覽頁改用本機檔案，讓課務審閱時看得到圖。 */
    localPath: '../../assets/logo/logo-primary@2x.png',
  },
  logoInverse: {
    url: 'https://REPLACE-ME.example.com/sor/logo-inverse.png',
    width: 229,
    height: 76,
    alt: '蕭博士 SoR 美語',
    localPath: '../../assets/logo/logo-inverse@2x.png',
  },
};

/** TODO(#8)：官網網址待確認。 */
export const SITE_URL = 'https://REPLACE-ME.example.com/';

export const SOCIAL = [
  { label: 'YouTube', url: 'https://REPLACE-ME.example.com/youtube' },
  { label: 'Facebook', url: 'https://REPLACE-ME.example.com/facebook' },
  { label: 'Instagram', url: 'https://REPLACE-ME.example.com/instagram' },
];
