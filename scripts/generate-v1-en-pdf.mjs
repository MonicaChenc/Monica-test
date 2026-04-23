import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {marked} from 'marked';
import {chromium} from 'playwright';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');

const DOCS_CURRENT_DIR = path.join(repoRoot, 'docs');
const DOCS_V1_DIR = path.join(repoRoot, 'versioned_docs', 'version-1.0');
const I18N_ZH_CURRENT_DIR = path.join(
  repoRoot,
  'i18n',
  'zh-CN',
  'docusaurus-plugin-content-docs',
  'current',
);
const I18N_ZH_V1_DIR = path.join(
  repoRoot,
  'i18n',
  'zh-CN',
  'docusaurus-plugin-content-docs',
  'version-1.0',
);
const LOGO_PATH = path.join(repoRoot, 'static', 'img', 'm-logo.svg');
const OUTPUT_DIR = path.join(repoRoot, 'static', 'downloads');
const COVER_TITLE = 'welcome';
const COVER_DATE = '2026-01-01';

function stripFrontMatter(markdown) {
  return markdown.replace(/^---[\s\S]*?---\n?/, '');
}

function pickTitleAndBody(markdown, fallbackTitle) {
  const body = stripFrontMatter(markdown).trim();
  const headingMatch = body.match(/^#\s+(.+)$/m);
  const title = (headingMatch?.[1] || fallbackTitle).trim();
  return {title, body};
}

async function loadDocMarkdownInDir(docsDir, docId) {
  const mdPath = path.join(docsDir, `${docId}.md`);
  const mdxPath = path.join(docsDir, `${docId}.mdx`);
  try {
    return await fs.readFile(mdPath, 'utf8');
  } catch {
    return fs.readFile(mdxPath, 'utf8');
  }
}

function buildHtml({logoSvg, sections, versionLabel}) {
  const sectionsHtml = sections
    .map(
      ({title, html}, index) => `
      <section class="doc-section">
        <h1 class="doc-title">
          <span class="doc-index">${index + 1}.</span> ${title}
        </h1>
        <div class="doc-body">${html}</div>
      </section>
    `,
    )
    .join('\n');

  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>${COVER_TITLE} ${versionLabel}</title>
    <style>
      @page { size: A4; margin: 16mm 14mm; }
      body {
        font-family: "Segoe UI", Arial, sans-serif;
        color: #1f2328;
        line-height: 1.7;
        font-size: 13px;
      }
      .cover {
        height: 90vh;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 10px;
        page-break-after: always;
      }
      .logo svg {
        width: 72px;
        height: 72px;
      }
      .cover h1 {
        margin: 8px 0 0;
        font-size: 34px;
        text-transform: lowercase;
      }
      .meta {
        font-size: 15px;
        color: #57606a;
      }
      .doc-section {
        page-break-inside: avoid;
        margin-bottom: 26px;
      }
      .doc-title {
        font-size: 24px;
        border-bottom: 1px solid #d0d7de;
        padding-bottom: 6px;
      }
      .doc-index {
        color: #57606a;
      }
      img { max-width: 100%; }
      pre {
        white-space: pre-wrap;
        word-break: break-word;
        background: #f6f8fa;
        border-radius: 6px;
        padding: 10px;
      }
      code {
        font-family: "SFMono-Regular", Consolas, monospace;
      }
      table {
        width: 100%;
        border-collapse: collapse;
      }
      th, td {
        border: 1px solid #d0d7de;
        padding: 6px 8px;
      }
      blockquote {
        margin: 0;
        padding-left: 12px;
        border-left: 3px solid #d0d7de;
        color: #57606a;
      }
    </style>
  </head>
  <body>
    <section class="cover">
      <div class="logo">${logoSvg}</div>
      <h1>${COVER_TITLE}</h1>
      <div class="meta">Version: ${versionLabel}</div>
      <div class="meta">Date: ${COVER_DATE}</div>
    </section>
    ${sectionsHtml}
  </body>
</html>`;
}

async function main() {
  const logoSvg = await fs.readFile(LOGO_PATH, 'utf8');
  await fs.mkdir(OUTPUT_DIR, {recursive: true});

  const latestBaseDocIds = await listDocIdsFromDir(DOCS_CURRENT_DIR);
  const v1BaseDocIds = await listDocIdsFromDir(DOCS_V1_DIR);

  const targets = [
    {
      locale: 'en',
      version: 'latest',
      versionLabel: 'latest',
      baseDir: DOCS_CURRENT_DIR,
      preferredDir: DOCS_CURRENT_DIR,
      baseDocIds: latestBaseDocIds,
      outputPath: path.join(OUTPUT_DIR, 'docs-latest-en-us.pdf'),
    },
    {
      locale: 'en',
      version: '1.0',
      versionLabel: 'v1.0',
      baseDir: DOCS_V1_DIR,
      preferredDir: DOCS_V1_DIR,
      baseDocIds: v1BaseDocIds,
      outputPath: path.join(OUTPUT_DIR, 'docs-v1.0-en-us.pdf'),
    },
    {
      locale: 'zh-CN',
      version: 'latest',
      versionLabel: 'latest',
      baseDir: DOCS_CURRENT_DIR,
      preferredDir: I18N_ZH_CURRENT_DIR,
      baseDocIds: latestBaseDocIds,
      outputPath: path.join(OUTPUT_DIR, 'docs-latest-zh-cn.pdf'),
    },
    {
      locale: 'zh-CN',
      version: '1.0',
      versionLabel: 'v1.0',
      baseDir: DOCS_V1_DIR,
      preferredDir: I18N_ZH_V1_DIR,
      baseDocIds: v1BaseDocIds,
      outputPath: path.join(OUTPUT_DIR, 'docs-v1.0-zh-cn.pdf'),
    },
  ];

  const browser = await launchBrowser();
  try {
    for (const target of targets) {
      await generateSinglePdf({
        browser,
        logoSvg,
        baseDir: target.baseDir,
        preferredDir: target.preferredDir,
        docIds: target.baseDocIds,
        outputPath: target.outputPath,
        versionLabel: target.versionLabel,
      });
      console.log(
        `Generated PDF (${target.locale} ${target.version}): ${target.outputPath}`,
      );
    }
  } finally {
    await browser.close();
  }
}

async function launchBrowser() {
  try {
    return await chromium.launch({headless: true});
  } catch (error) {
    const message = String(error);
    const missingExecutable =
      message.includes("Executable doesn't exist") ||
      message.includes('Please run the following command to download new browsers');
    if (!missingExecutable) {
      throw error;
    }
    // Fall back to local Chrome if Playwright-managed browser is unavailable.
    return chromium.launch({headless: true, channel: 'chrome'});
  }
}

async function listDocIdsFromDir(rootDir) {
  const results = [];
  await collectDocIds(rootDir, rootDir, results);
  return results.sort((a, b) => a.localeCompare(b));
}

async function collectDocIds(rootDir, currentDir, output) {
  const entries = await fs.readdir(currentDir, {withFileTypes: true});
  for (const entry of entries) {
    const absolutePath = path.join(currentDir, entry.name);
    if (entry.isDirectory()) {
      await collectDocIds(rootDir, absolutePath, output);
      continue;
    }
    if (!entry.isFile()) {
      continue;
    }
    if (!entry.name.endsWith('.md') && !entry.name.endsWith('.mdx')) {
      continue;
    }
    const relative = path.relative(rootDir, absolutePath).replace(/\\/g, '/');
    const docId = relative.replace(/\.(md|mdx)$/i, '');
    output.push(docId);
  }
}

async function readDocMarkdownWithFallback(baseDir, preferredDir, docId) {
  if (preferredDir === baseDir) {
    return loadDocMarkdownInDir(baseDir, docId);
  }
  const preferredMd = path.join(preferredDir, `${docId}.md`);
  const preferredMdx = path.join(preferredDir, `${docId}.mdx`);
  try {
    return await fs.readFile(preferredMd, 'utf8');
  } catch {
    // try mdx or fallback
  }
  try {
    return await fs.readFile(preferredMdx, 'utf8');
  } catch {
    return loadDocMarkdownInDir(baseDir, docId);
  }
}

async function generateSinglePdf({
  browser,
  logoSvg,
  baseDir,
  preferredDir,
  docIds,
  outputPath,
  versionLabel,
}) {
  const sections = [];
  for (const docId of docIds) {
    const rawMd = await readDocMarkdownWithFallback(baseDir, preferredDir, docId);
    const fallbackTitle = docId.split('/').pop() ?? docId;
    const {title, body} = pickTitleAndBody(rawMd, fallbackTitle);
    const html = marked.parse(body);
    sections.push({title, html});
  }

  const html = buildHtml({logoSvg, sections, versionLabel});
  const page = await browser.newPage();
  try {
    await page.setContent(html, {waitUntil: 'networkidle'});
    await page.pdf({
      path: outputPath,
      format: 'A4',
      printBackground: true,
      margin: {top: '10mm', right: '10mm', bottom: '12mm', left: '10mm'},
    });
  } finally {
    await page.close();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
