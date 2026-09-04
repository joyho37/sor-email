// @ts-check
/**
 * 產出的 HTML 是交付物本身，所以測試測的是 HTML 的性質，不是函式的回傳值。
 * 每一條都對應 issue #2 / #3 的一項驗收或限制。
 */
import { describe, it, before } from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as cheerio from 'cheerio';
import { render } from '../scripts/build.mjs';
import { emails, extractVariables, fill } from '../src/emails.js';
import { css, mediaCss } from '../src/styles.js';
import { palettes, EMAIL_WIDTH } from '../src/tokens.js';

const root = path.resolve(fileURLToPath(import.meta.url), '../..');

/** @type {Map<string, string>} */
const built = new Map();
/** @type {Map<string, string>} */
const previews = new Map();

before(async () => {
  for (const email of emails) {
    built.set(email.id, await render(email));
    previews.set(email.id, await render(email, { preview: true }));
  }
});

/**
 * 抓出 `<td …>` 開頭標籤，用來檢查儲存格層級的規則。
 * @param {string} html
 * @returns {string[]}
 */
function tdTags(html) {
  return html.match(/<td\b[^>]*>/g) ?? [];
}

/** @param {string} style */
const hasColor = (style) => /(^|[;\s"])color\s*:/.test(style);
/** @param {string} style */
const hasBackground = (style) => /background-color\s*:/.test(style);

describe('每封信都建置得出來', () => {
  it('六封信，一封一個檔名', () => {
    assert.equal(emails.length, 6);
    assert.equal(new Set(emails.map((e) => e.id)).size, 6);
  });

  for (const email of emails) {
    it(`${email.id} 是一份完整的 HTML 文件`, () => {
      const html = /** @type {string} */ (built.get(email.id));
      assert.match(html, /^<!DOCTYPE html/);
      assert.match(html, /<\/html>\s*$/);
      assert.match(html, /<meta http-equiv="Content-Type" content="text\/html; charset=UTF-8">/);
    });
  }
});

describe('主旨列', () => {
  for (const email of emails) {
    it(`${email.id} 的主旨列在檔案裡找得到`, () => {
      const html = /** @type {string} */ (built.get(email.id));
      // 主旨列的變數不在 body 裡，後端很容易漏掉，所以主旨同時寫進 <title> 與註解。
      assert.ok(html.includes(`<title>${email.subject}</title>`));
      assert.ok(html.includes(`主旨：${email.subject}`));
    });
  }

  it('兒童的兩封信帶上課者姓名，成人與大師班不帶', () => {
    // 家長可為多個孩子報名同一門課的不同時段，會收到多封信，不帶姓名就無法分辨。
    for (const email of emails) {
      const kidsSubject = email.subject.includes('{{上課者姓名}}');
      assert.equal(kidsSubject, email.palette === 'kids', email.id);
    }
  });
});

describe('變數', () => {
  for (const email of emails) {
    it(`${email.id} 產出的 HTML 保留 {{ }} 原樣`, () => {
      const html = /** @type {string} */ (built.get(email.id));
      // 建置不得把變數渲染掉：後端拿到的必須是還帶著 `{{ }}` 的模板。
      assert.ok(extractVariables(html).length > 0);
    });

    it(`${email.id} 只出現清單裡記錄過的變數`, () => {
      const html = /** @type {string} */ (built.get(email.id));
      const found = new Set([...extractVariables(html), ...extractVariables(email.subject)]);
      assert.deepEqual([...found].sort(), [...email.variables].sort());
    });

    it(`${email.id} 的預覽版把變數全部換成假資料`, () => {
      const preview = /** @type {string} */ (previews.get(email.id));
      assert.equal(extractVariables(fill(preview, email.sample)).length, 0);
    });
  }

  it('報名通知與開課通知的梯次名稱是兩個不同的值', () => {
    // ADR-0001：同一個班期在兩封信裡用不同顯示字串，這兩個欄位長得很像但不可互換。
    const adultEnrolment = emails.find((e) => e.id === '03-adult-enrolment');
    const adultClassStart = emails.find((e) => e.id === '04-adult-class-start');
    assert.notEqual(adultEnrolment?.sample.梯次名稱, adultClassStart?.sample.梯次名稱);
  });
});

describe('郵件客戶端限制', () => {
  for (const email of emails) {
    it(`${email.id} 不用 Outlook 會崩壞的排版屬性`, () => {
      const html = /** @type {string} */ (built.get(email.id));
      // Outlook 用 Word 引擎渲染，這些不是降級而是版面崩壞。
      // media query 的條件裡本來就有 max-width，那是增強不是版型，先剝掉再檢查。
      const markup = html.replace(/<style[^>]*>[\s\S]*?<\/style>/g, '');
      for (const banned of [/display\s*:\s*flex/, /display\s*:\s*grid/, /position\s*:/, /max-width\s*:/]) {
        assert.doesNotMatch(markup, banned);
      }
    });

    it(`${email.id} 的按鈕都有 VML 版本`, () => {
      const html = /** @type {string} */ (built.get(email.id));
      const anchors = html.match(/class="(btn-a|btn-ghost-a|footer-btn-a)"/g) ?? [];
      const vml = html.match(/<v:roundrect\b/g) ?? [];
      assert.ok(anchors.length > 0, '這封信應該有按鈕');
      assert.equal(vml.length, anchors.length);
    });

    it(`${email.id} 的信件寬度是 ${EMAIL_WIDTH}px`, () => {
      const html = /** @type {string} */ (built.get(email.id));
      assert.ok(html.includes(`width:${EMAIL_WIDTH}px;`));
      assert.ok(html.includes(`<table role="presentation" width="${EMAIL_WIDTH}"`));
    });
  }
});

describe('CSS inline', () => {
  for (const email of emails) {
    it(`${email.id} 的 <style> 只留 media query 這類增強`, () => {
      const html = /** @type {string} */ (built.get(email.id));
      const styles = [...html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)].map((m) => m[1]);
      assert.equal(styles.length, 1);
      assert.equal(styles[0].trim(), mediaCss.trim());
    });

    it(`${email.id} 用到的 class 都有定義`, () => {
      const html = /** @type {string} */ (built.get(email.id));
      const sheet = css(palettes[email.palette]) + mediaCss;
      const used = new Set(
        [...html.matchAll(/class="([^"]+)"/g)].flatMap((m) => m[1].split(/\s+/)).filter(Boolean),
      );
      for (const name of used) {
        assert.ok(sheet.includes(`.${name} `), `class .${name} 沒有對應的樣式`);
      }
    });
  }
});

describe('深色模式防禦', () => {
  for (const email of emails) {
    it(`${email.id} 每個有文字色的儲存格都明確設了背景色`, () => {
      const html = /** @type {string} */ (built.get(email.id));
      const offenders = tdTags(html)
        .map((/** @type {string} */ tag) => /style="([^"]*)"/.exec(tag)?.[1] ?? '')
        .filter((/** @type {string} */ style) => hasColor(style) && !hasBackground(style));
      // 只設其一，客戶端自動反轉時會變成同色相疊、文字直接消失。
      assert.deepEqual(offenders, []);
    });
  }
});

describe('變數清單是交付物，不能落後於樣板', () => {
  it('每個變數在 docs/variables.md 都有一節', async () => {
    const doc = await readFile(path.join(root, 'docs', 'variables.md'), 'utf8');
    const documented = new Set(extractVariables(doc));
    for (const email of emails) {
      for (const name of email.variables) {
        assert.ok(documented.has(name), `${name}（${email.id}）沒有寫進變數清單`);
      }
    }
  });
});

describe('圓角', () => {
  for (const email of emails) {
    it(`${email.id} 圓角容器的角落儲存格自己也有圓角`, () => {
      // `border-radius` 只裁切該元素**自己**的背景，裡面 `<td>` 的底色照樣是直角，
      // 會蓋在圓角上露出方形缺口。角落那一列的儲存格只要有底色就必須自己也有圓角。
      const $ = cheerio.load(/** @type {string} */ (built.get(email.id)));
      let checked = 0;
      $('table').each((_, table) => {
        if (!/border-radius\s*:\s*[^;]*[1-9]/.test($(table).attr('style') ?? '')) return;
        const rows = $(table).children('tbody').children('tr').toArray();
        for (const row of [rows[0], rows[rows.length - 1]].filter(Boolean)) {
          for (const td of $(row).children('td').toArray()) {
            const style = $(td).attr('style') ?? '';
            if (!/background-color\s*:/.test(style)) continue;
            checked += 1;
            assert.match(style, /border-radius\s*:/, `角落儲存格有底色卻沒有圓角：${$.html(td).slice(0, 100)}`);
          }
        }
      });
      assert.ok(checked > 0, '這封信應該有圓角容器');
    });

    it(`${email.id} 有邊框的 class 不會同時套在 table 和 td 上`, () => {
      // 同一個 class 掛在 table 又掛在裡面的 td，邊框會畫兩次、變成兩條線。
      const $ = cheerio.load(/** @type {string} */ (built.get(email.id)));
      /** @param {string} selector */
      const classesOn = (selector) =>
        new Set(
          $(selector)
            .toArray()
            .flatMap((el) => ($(el).attr('class') ?? '').split(/\s+/))
            .filter(Boolean),
        );
      const onTd = classesOn('td');
      const sheet = css(palettes[email.palette]);
      for (const name of classesOn('table')) {
        if (!onTd.has(name)) continue;
        const rule = sheet.match(new RegExp(`\\.${name}\\s*\\{[^}]*\\}`));
        assert.ok(rule, `class .${name} 沒有對應的樣式`);
        assert.doesNotMatch(rule[0], /border(-radius)?\s*:/, `.${name} 同時套在 table 和 td 上`);
      }
    });
  }
});

describe('進版控的 dist 與模板同步', () => {
  it('dist/emails/ 就是六封信', async () => {
    const files = await readdir(path.join(root, 'dist', 'emails'));
    assert.deepEqual(files.sort(), emails.map((e) => `${e.id}.html`).sort());
  });

  for (const email of emails) {
    it(`dist/emails/${email.id}.html 是最新的建置結果`, async () => {
      const onDisk = await readFile(path.join(root, 'dist', 'emails', `${email.id}.html`), 'utf8');
      assert.equal(onDisk, built.get(email.id), '模板改了但沒重新 npm run build');
    });
  }

  it('預覽頁存在且六封信都掛得上去', async () => {
    const index = await readFile(path.join(root, 'dist', 'preview', 'index.html'), 'utf8');
    for (const email of emails) {
      assert.ok(index.includes(`${email.id}.html`), email.id);
    }
  });
});
