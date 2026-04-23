import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {useLocation} from '@docusaurus/router';
import styles from './styles.module.css';

type ExportStrings = {
  copyPage: string;
  printPage: string;
  exportWord: string;
  exportPdf: string;
  more: string;
  copied: string;
  copyFailed: string;
};

function localeFromPathname(pathname: string): string {
  if (pathname.includes('/zh-CN')) {
    return 'zh-CN';
  }
  return 'en';
}

function pickStrings(locale: string): ExportStrings {
  if (locale.startsWith('zh')) {
    return {
      copyPage: '复制页面',
      printPage: '打印页面',
      exportWord: '导出 Word',
      exportPdf: '导出 PDF',
      more: '更多操作',
      copied: '已复制',
      copyFailed: '复制失败',
    };
  }
  return {
    copyPage: 'Copy Page',
    printPage: 'Print Page',
    exportWord: 'Export Word',
    exportPdf: 'Export PDF',
    more: 'More actions',
    copied: 'Copied',
    copyFailed: 'Copy failed',
  };
}

function buildFileBaseName(pathname: string): string {
  const segments = pathname.split('/').filter(Boolean);
  const last = segments[segments.length - 1] ?? 'document';
  return last.replace(/[^\w\u4e00-\u9fa5-]/g, '-') || 'document';
}

function buildWordHtml(title: string, article: HTMLElement): string {
  return `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>${title}</title>
    <style>
      body { font-family: "Segoe UI", "PingFang SC", "Microsoft YaHei", Arial, sans-serif; line-height: 1.7; margin: 32px; color: #1f2328; }
      img { max-width: 100%; }
      pre { white-space: pre-wrap; word-wrap: break-word; background: #f6f8fa; padding: 12px; border-radius: 6px; }
      code { font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace; }
      table { border-collapse: collapse; width: 100%; }
      th, td { border: 1px solid #d0d7de; padding: 6px 10px; }
    </style>
  </head>
  <body>
    ${article.innerHTML}
  </body>
</html>`;
}

export default function DocExportButtons(): React.ReactElement {
  const {pathname} = useLocation();
  const locale = useMemo(() => localeFromPathname(pathname), [pathname]);
  const {copyPage, printPage, exportWord, exportPdf, more, copied, copyFailed} =
    useMemo(() => pickStrings(locale), [locale]);
  const [open, setOpen] = useState(false);
  const [copyState, setCopyState] = useState<'idle' | 'copied' | 'error'>(
    'idle',
  );
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function closeOnOutsideClick(event: MouseEvent): void {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', closeOnOutsideClick);
    return () => document.removeEventListener('mousedown', closeOnOutsideClick);
  }, []);

  const handleCopyPage = useCallback(async () => {
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      return;
    }
    const article = document.querySelector('article');
    if (!article) {
      return;
    }
    const clonedArticle = article.cloneNode(true) as HTMLElement;
    clonedArticle
      .querySelectorAll('[data-no-export="true"]')
      .forEach((node) => node.remove());
    const articleText = clonedArticle.innerText.trim();
    if (!articleText) {
      return;
    }
    try {
      await navigator.clipboard.writeText(articleText);
      setCopyState('copied');
      window.setTimeout(() => setCopyState('idle'), 1500);
    } catch {
      setCopyState('error');
      window.setTimeout(() => setCopyState('idle'), 1500);
    } finally {
      setOpen(false);
    }
  }, []);

  const handleExportWord = useCallback(() => {
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      return;
    }

    const article = document.querySelector('article');
    if (!article) {
      return;
    }

    const clonedArticle = article.cloneNode(true) as HTMLElement;
    clonedArticle
      .querySelectorAll('[data-no-export="true"]')
      .forEach((node) => node.remove());

    const title = document.title || buildFileBaseName(pathname);
    const html = buildWordHtml(title, clonedArticle);
    const blob = new Blob(['\ufeff', html], {
      type: 'application/msword;charset=utf-8',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${buildFileBaseName(pathname)}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [pathname]);

  const handlePrintPage = useCallback(() => {
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      return;
    }
    setOpen(false);
    window.print();
  }, []);

  const handleExportPdf = useCallback(async () => {
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      return;
    }
    const article = document.querySelector('article');
    if (!article) {
      return;
    }
    const clonedArticle = article.cloneNode(true) as HTMLElement;
    clonedArticle
      .querySelectorAll('[data-no-export="true"]')
      .forEach((node) => node.remove());
    const mount = document.createElement('div');
    mount.style.position = 'fixed';
    mount.style.left = '-99999px';
    mount.style.top = '0';
    mount.style.width = '794px';
    mount.style.background = '#fff';
    mount.appendChild(clonedArticle);
    document.body.appendChild(mount);
    try {
      const html2pdfModule = await import('html2pdf.js');
      const html2pdf = (html2pdfModule as {default: any}).default;
      await html2pdf()
        .set({
          margin: [12, 12, 12, 12],
          filename: `${buildFileBaseName(pathname)}.pdf`,
          image: {type: 'jpeg', quality: 0.98},
          html2canvas: {scale: 2, useCORS: true},
          jsPDF: {unit: 'mm', format: 'a4', orientation: 'portrait'},
        })
        .from(mount)
        .save();
    } finally {
      document.body.removeChild(mount);
      setOpen(false);
    }
  }, [pathname]);

  const copyTitle =
    copyState === 'copied' ? copied : copyState === 'error' ? copyFailed : copyPage;

  return (
    <div ref={rootRef} className={styles.root} data-no-export="true">
      <button
        type="button"
        className={styles.btn}
        onClick={handleCopyPage}
        aria-label={copyPage}
        title={copyTitle}>
        <span className={styles.icon} aria-hidden>
          <svg viewBox="0 0 24 24" width="15" height="15">
            <path
              d="M10 13a5 5 0 0 1 0-7l1-1a5 5 0 0 1 7 7l-1 1M14 11a5 5 0 0 1 0 7l-1 1a5 5 0 0 1-7-7l1-1"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </span>
        {copyPage}
      </button>
      <button
        type="button"
        className={styles.dropdownBtn}
        aria-label={more}
        title={more}
        onClick={() => setOpen((value) => !value)}>
        <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden>
          <path
            d="M7 10l5 5 5-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      {open && (
        <div className={styles.menu} role="menu">
          <button
            type="button"
            className={styles.menuItem}
            onClick={handleCopyPage}
            role="menuitem">
            <span className={styles.icon} aria-hidden>
              <svg viewBox="0 0 24 24" width="15" height="15">
                <path
                  d="M10 13a5 5 0 0 1 0-7l1-1a5 5 0 0 1 7 7l-1 1M14 11a5 5 0 0 1 0 7l-1 1a5 5 0 0 1-7-7l1-1"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </span>
            {copyPage}
          </button>
          <button
            type="button"
            className={styles.menuItem}
            onClick={handlePrintPage}
            role="menuitem">
            <span className={styles.icon} aria-hidden>
              <svg viewBox="0 0 24 24" width="15" height="15">
                <path
                  d="M7 8V3h10v5M7 17H5a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-2M7 14h10v7H7z"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            {printPage}
          </button>
          <button
            type="button"
            className={styles.menuItem}
            onClick={handleExportPdf}
            role="menuitem">
            <span className={styles.icon} aria-hidden>
              <svg viewBox="0 0 24 24" width="15" height="15">
                <path
                  d="M12 3v11m0 0l-4-4m4 4l4-4M5 21h14"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            {exportPdf}
          </button>
          <button
            type="button"
            className={styles.menuItem}
            onClick={handleExportWord}
            role="menuitem">
            <span className={styles.icon} aria-hidden>
              <svg viewBox="0 0 24 24" width="15" height="15">
                <path
                  d="M4 5h16v14H4zM8 9l1.4 6L12 9l2.6 6L16 9"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            {exportWord}
          </button>
        </div>
      )}
    </div>
  );
}
