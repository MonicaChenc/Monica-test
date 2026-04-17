import React, {useCallback, useMemo, useState} from 'react';
import {useLocation} from '@docusaurus/router';
import styles from './styles.module.css';

function pickStrings(locale: string): {
  copy: string;
  copied: string;
  failed: string;
} {
  if (locale.startsWith('zh')) {
    return {copy: '复制链接', copied: '已复制', failed: '复制失败'};
  }
  return {copy: 'Copy link', copied: 'Copied', failed: 'Copy failed'};
}

function localeFromPathname(pathname: string): string {
  if (pathname.includes('/zh-CN')) {
    return 'zh-CN';
  }
  return 'en';
}

export default function DocPermalinkCopy(): React.ReactElement {
  const {pathname} = useLocation();
  const locale = useMemo(() => localeFromPathname(pathname), [pathname]);
  const {copy, copied, failed} = pickStrings(locale);
  const [state, setState] = useState<'idle' | 'copied' | 'error'>('idle');

  const handleClick = useCallback(async () => {
    const url =
      typeof window !== 'undefined' ? window.location.href : '';
    if (!url) {
      return;
    }
    try {
      await navigator.clipboard.writeText(url);
      setState('copied');
      window.setTimeout(() => setState('idle'), 2000);
    } catch {
      setState('error');
      window.setTimeout(() => setState('idle'), 2000);
    }
  }, []);

  const titleHint =
    state === 'copied' ? copied : state === 'error' ? failed : copy;

  return (
    <div className={styles.root}>
      <button
        type="button"
        className={styles.btn}
        onClick={handleClick}
        aria-label={copy}
        title={titleHint}>
        <span className={styles.icon} aria-hidden>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path
              d="M10 13a5 5 0 0 1 0-7l1-1a5 5 0 0 1 7 7l-1 1M14 11a5 5 0 0 1 0 7l-1 1a5 5 0 0 1-7-7l1-1"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </span>
      </button>
    </div>
  );
}
