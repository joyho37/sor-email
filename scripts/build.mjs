// @ts-check
/**
 * 建置：把 partial 組裝成六份 CSS 已 inline 的完整 HTML，另外產一份假資料預覽。
 *
 *   src/            模板來源（partial + 六封信的內容）
 *   dist/emails/    交給後端的檔案，**保留 `{{變數}}` 原樣**
 *   dist/preview/   假資料版本 + 可切換的預覽頁，給課務審閱
 *
 * dist/ 要進版控：後端拿的是檔案，不是建置結果。
 */
import { mkdir, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import ejs from 'ejs';
import juice from 'juice';
import { emails, fill } from '../src/emails.js';
import { css, mediaCss } from '../src/styles.js';
import { palettes, EMAIL_WIDTH } from '../src/tokens.js';
import { SENTINELS, SENTINEL_REPLACEMENTS, spacer } from '../src/helpers.js';
import {
  ADULT_CONTACT,
  ASSETS,
  BRAND_TAGLINE,
  COPYRIGHT,
  OFFICIAL_LINE_URL,
  SITE_URL,
  SOCIAL,
} from '../src/constants.js';

const root = path.resolve(fileURLToPath(import.meta.url), '../..');
const srcDir = path.join(root, 'src');
const distDir = path.join(root, 'dist');

/**
 * 郵件不能用相對路徑，所以正式產出用雲端網址；預覽版改用本機檔案，
 * 讓課務不必等雲端網址就能審閱。
 * @param {typeof ASSETS.logoPrimary} asset
 * @param {boolean} preview
 */
function resolveLogo(asset, preview) {
  const { width, height, alt } = asset;
  return { src: preview ? asset.localPath : asset.url, width, height, alt };
}

/**
 * 產生一封信的完整 HTML。
 * @param {import('../src/emails.js').Email} email
 * @param {{ preview: boolean }} opts 預覽版改用本機 logo，讓課務不必等雲端網址就能審閱
 */
export async function render(email, opts = { preview: false }) {
  const palette = palettes[email.palette];
  const locals = {
    palette,
    bg: palette.cardBg,
    width: EMAIL_WIDTH,
    subject: email.subject,
    mediaCss,
    spacer: (/** @type {number} */ px) => spacer(px, palette.cardBg),
    SENTINELS,
    // 頁首／頁尾只拿得到「已經決定好網址的 logo」，不必自己去 ASSETS 裡挑。
    logoPrimary: resolveLogo(ASSETS.logoPrimary, opts.preview),
    logoInverse: resolveLogo(ASSETS.logoInverse, opts.preview),
    officialLineUrl: OFFICIAL_LINE_URL,
    adultContact: ADULT_CONTACT,
    siteUrl: SITE_URL,
    social: SOCIAL,
    tagline: BRAND_TAGLINE,
    copyright: COPYRIGHT,
  };

  const content = await ejs.renderFile(path.join(srcDir, 'emails', email.template), locals);
  const html = await ejs.renderFile(path.join(srcDir, 'layout.ejs'), { ...locals, content });

  // 關鍵樣式 inline 到每個標籤上：部分客戶端會整段移除 `<style>`，
  // 留在 `<style>` 裡的只有 media query 這類「沒有也不會壞」的增強。
  const inlined = juice.inlineContent(html, css(palette), {
    preserveImportant: true,
    inlinePseudoElements: false,
  });

  return SENTINEL_REPLACEMENTS.reduce(
    (acc, [from, to]) => acc.replaceAll(from, to),
    inlined,
  ).replace(/\n{3,}/g, '\n\n');
}

/** 六封信各塞一組假資料，同一頁可切換，方便課務審閱。 */
function previewIndex() {
  const tabs = emails
    .map(
      (e, i) =>
        `      <button type="button" class="tab${i === 0 ? ' is-active' : ''}" data-src="${e.id}.html" data-subject="${fill(e.subject, e.sample)}">${e.title}</button>`,
    )
    .join('\n');

  return `<!DOCTYPE html>
<html lang="zh-Hant">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>SoR 郵件樣板預覽</title>
<style>
  body { margin: 0; font-family: -apple-system, "PingFang TC", "Microsoft JhengHei", sans-serif; background: #EFEDE8; color: #1A1A1A; }
  header { padding: 20px 24px 0; }
  h1 { font-size: 18px; margin: 0 0 4px; }
  .note { font-size: 13px; color: #5A5A5A; margin: 0 0 16px; }
  .tabs { display: flex; flex-wrap: wrap; gap: 8px; padding: 0 24px 16px; }
  .tab { font: inherit; font-size: 14px; padding: 8px 14px; border-radius: 999px; border: 1px solid #C9C6BE; background: #fff; color: #1A1A1A; cursor: pointer; }
  .tab.is-active { background: #1A1A1A; color: #fff; border-color: #1A1A1A; }
  .subject { margin: 0 24px 12px; padding: 12px 16px; background: #fff; border: 1px solid #DFDFDF; border-radius: 8px; font-size: 14px; }
  .subject b { color: #5A5A5A; font-weight: 600; margin-right: 8px; }
  iframe { display: block; width: 100%; height: calc(100vh - 210px); border: 0; border-top: 1px solid #DFDFDF; background: #FAF8F4; }
</style>
</head>
<body>
<header>
  <h1>蕭博士 SoR 美語｜課程通知信預覽</h1>
  <p class="note">假資料版本，取自文案凍結快照裡的真實班期。交給後端的檔案在 <code>dist/emails/</code>，那裡的變數仍是 <code>{{ }}</code>。</p>
</header>
<div class="tabs">
${tabs}
</div>
<p class="subject"><b>主旨</b><span id="subject"></span></p>
<iframe id="frame" title="郵件預覽"></iframe>
<script>
  const tabs = document.querySelectorAll('.tab');
  const frame = document.getElementById('frame');
  const subject = document.getElementById('subject');
  function show(tab) {
    tabs.forEach((t) => t.classList.toggle('is-active', t === tab));
    frame.src = tab.dataset.src;
    subject.textContent = tab.dataset.subject;
  }
  tabs.forEach((tab) => tab.addEventListener('click', () => show(tab)));
  show(tabs[0]);
</script>
</body>
</html>
`;
}

async function build() {
  await rm(distDir, { recursive: true, force: true });
  await mkdir(path.join(distDir, 'emails'), { recursive: true });
  await mkdir(path.join(distDir, 'preview'), { recursive: true });

  for (const email of emails) {
    const html = await render(email);
    await writeFile(path.join(distDir, 'emails', `${email.id}.html`), html, 'utf8');

    const preview = fill(await render(email, { preview: true }), email.sample);
    await writeFile(path.join(distDir, 'preview', `${email.id}.html`), preview, 'utf8');
  }

  await writeFile(path.join(distDir, 'preview', 'index.html'), previewIndex(), 'utf8');
  console.log(`建置完成：${emails.length} 封信 → dist/emails/，預覽 → dist/preview/index.html`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  await build();
}
