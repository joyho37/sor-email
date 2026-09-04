// @ts-check
/**
 * 六封信的清冊。主旨列、配色、變數白名單與預覽用假資料都在這裡。
 *
 * `variables` 是**這封信允許出現的全部變數**（含主旨列）。
 * `test/output.test.mjs` 會拿它跟產出的 HTML 對照，多一個少一個都會失敗——
 * 變數清單（docs/variables.md）交給後端，樣板不能偷偷長出沒記錄的變數。
 */

/**
 * @typedef {object} Email
 * @property {string} id 輸出檔名（不含副檔名）
 * @property {string} title 中文標題，給預覽頁用
 * @property {string} subject 主旨列，含 `{{ }}` 變數
 * @property {'kids' | 'adult'} palette
 * @property {string} template `src/emails/` 下的模板檔名
 * @property {string} copy 文案凍結快照的來源檔
 * @property {string[]} variables 允許出現的變數名（不含大括號）
 * @property {Record<string, string>} sample 預覽用假資料，取自文案快照裡的真實班期
 */

const 拼讀小達人第一階01 = '拼讀小達人第一階01(8月班)';

/** @type {Email[]} */
export const emails = [
  {
    id: '01-kids-enrolment',
    title: '① 小達人報名通知',
    subject: '【蕭博士SoR美語】{{上課者姓名}}｜{{梯次名稱}} 報名成功通知',
    palette: 'kids',
    template: '01-kids-enrolment.ejs',
    copy: 'docs/copy/01-kids-enrolment.md',
    variables: ['上課者姓名', '梯次名稱', '報到關鍵字'],
    sample: {
      上課者姓名: '王小明',
      梯次名稱: 拼讀小達人第一階01,
      報到關鍵字: `${拼讀小達人第一階01}報到`,
    },
  },
  {
    id: '02-kids-class-start',
    title: '② 小達人開課通知',
    subject: '【開課通知信】{{上課者姓名}}｜{{梯次名稱}} 請加入課程群組',
    palette: 'kids',
    template: '02-kids-class-start.ejs',
    copy: 'docs/copy/02-kids-class-start.md',
    variables: ['上課者姓名', '梯次名稱', '班級名稱', '班級群組連結', '開課日期', '互動時間'],
    sample: {
      上課者姓名: '王小明',
      梯次名稱: 拼讀小達人第一階01,
      班級名稱: '第一階-04｜B200｜吳鈺文 老師群組',
      班級群組連結: 'https://line.me/R/ti/g/sXuxbd9RSR',
      開課日期: '7/10 (五)',
      互動時間: '每週二及週五 晚上 20:00 – 20:40',
    },
  },
  {
    id: '03-adult-enrolment',
    title: '③ 成人矯正班報名通知',
    subject: '【蕭博士SoR美語】{{梯次名稱}} 報名成功通知',
    palette: 'adult',
    template: '03-adult-enrolment.ejs',
    copy: 'docs/copy/03-adult-enrolment.md',
    variables: ['上課者姓名', '梯次名稱', '報到關鍵字'],
    sample: {
      上課者姓名: '陳美惠',
      梯次名稱: '成人矯正班第36期',
      報到關鍵字: '成人矯正班第36期報到',
    },
  },
  {
    id: '04-adult-class-start',
    title: '④ 成人矯正班開課通知',
    subject: '【蕭博士SoR美語】開課通知！《{{梯次名稱}}》請加入課程群組',
    palette: 'adult',
    template: '04-adult-class-start.ejs',
    copy: 'docs/copy/04-adult-class-start.md',
    variables: ['梯次名稱', '班級名稱', '班級群組連結', '師生相見歡', '正式開課日', '常態上課時間'],
    sample: {
      梯次名稱: '發音聽力矯正課成人班–52100組',
      班級名稱: '31-539成人班｜李莉菁 老師群組',
      班級群組連結: 'https://line.me/R/ti/g/eaVzFdH_nA',
      師生相見歡: '2026/08/14 (五) 21:00 – 22:00',
      正式開課日: '2026/08/21 (五) 21:00 – 22:00',
      常態上課時間: '每週五 晚上 21:00 – 22:00',
    },
  },
  {
    id: '05-masterclass-enrolment',
    title: '⑤ 大師班報名通知',
    subject: '【蕭博士SoR美語】報名成功！《{{梯次名稱}}》學習啟動與報到通知',
    palette: 'adult',
    template: '05-masterclass-enrolment.ejs',
    copy: 'docs/copy/05-masterclass-enrolment.md',
    variables: ['上課者姓名', '梯次名稱', '學號'],
    sample: {
      上課者姓名: '陳美惠',
      梯次名稱: 'SoR大師班第17期',
      學號: 'M17-0042',
    },
  },
  {
    id: '06-masterclass-class-start',
    title: '⑥ 大師班開課通知',
    subject: '【蕭博士SoR美語】開課通知！《{{梯次名稱}}》請加入課程群組',
    palette: 'adult',
    template: '06-masterclass-class-start.ejs',
    copy: 'docs/copy/06-masterclass-class-start.md',
    variables: ['梯次名稱', '班級名稱', '班級群組連結', '師生相見歡', '正式開課日', '常態上課時間'],
    sample: {
      梯次名稱: '大師班-發音聽力矯正課–52100組',
      班級名稱: '31-539成人班｜李莉菁 老師群組',
      班級群組連結: 'https://line.me/R/ti/g/eaVzFdH_nA',
      師生相見歡: '2026/08/14 (五) 21:00 – 22:00',
      正式開課日: '2026/08/21 (五) 21:00 – 22:00',
      常態上課時間: '每週五 晚上 21:00 – 22:00',
    },
  },
];

/**
 * 從一段 HTML 或主旨列裡挖出所有 `{{變數}}` 的名字。
 * @param {string} text
 * @returns {string[]}
 */
export function extractVariables(text) {
  return [...new Set([...text.matchAll(/\{\{\s*([^}]+?)\s*\}\}/g)].map((m) => m[1]))];
}

/**
 * 把 `{{變數}}` 換成假資料。預覽頁專用，產出給後端的檔案不做這一步。
 * @param {string} text
 * @param {Record<string, string>} sample
 * @returns {string}
 */
export function fill(text, sample) {
  return text.replace(/\{\{\s*([^}]+?)\s*\}\}/g, (/** @type {string} */ whole, /** @type {string} */ name) =>
    Object.hasOwn(sample, name) ? sample[name] : whole,
  );
}
