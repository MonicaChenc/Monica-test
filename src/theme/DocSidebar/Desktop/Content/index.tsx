import React, {type ReactNode, useMemo, useState} from 'react';
import clsx from 'clsx';
import {ThemeClassNames} from '@docusaurus/theme-common';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import {
  useAnnouncementBar,
  useScrollPosition,
} from '@docusaurus/theme-common/internal';
import {translate} from '@docusaurus/Translate';
import DocSidebarItems from '@theme/DocSidebarItems';
import type {Props} from '@theme/DocSidebar/Desktop/Content';

import styles from './styles.module.css';

function useShowAnnouncementBar() {
  const {isActive} = useAnnouncementBar();
  const [showAnnouncementBar, setShowAnnouncementBar] = useState(isActive);

  useScrollPosition(
    ({scrollY}) => {
      if (isActive) {
        setShowAnnouncementBar(scrollY === 0);
      }
    },
    [isActive],
  );
  return isActive && showAnnouncementBar;
}

type SidebarItem = Props['sidebar'][number];

function filterSidebarItems(items: SidebarItem[], query: string): SidebarItem[] {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) {
    return items;
  }

  return items
    .map((item) => {
      const label = String(item.label ?? '').toLowerCase();
      const selfMatches = label.includes(normalizedQuery);

      if (item.type === 'category') {
        if (selfMatches) {
          return item;
        }
        const filteredChildren = filterSidebarItems(item.items, normalizedQuery);
        if (filteredChildren.length > 0) {
          return {...item, items: filteredChildren};
        }
        return null;
      }

      return selfMatches ? item : null;
    })
    .filter((item): item is SidebarItem => item !== null);
}

export default function DocSidebarDesktopContent({
  path,
  sidebar,
  className,
}: Props): ReactNode {
  const {
    i18n: {currentLocale},
  } = useDocusaurusContext();
  const isZh = currentLocale.toLowerCase().startsWith('zh');
  const showAnnouncementBar = useShowAnnouncementBar();
  const [query, setQuery] = useState('');

  const filteredSidebar = useMemo(
    () => filterSidebarItems(sidebar, query),
    [sidebar, query],
  );

  return (
    <nav
      aria-label={translate({
        id: 'theme.docs.sidebar.navAriaLabel',
        message: 'Docs sidebar',
        description: 'The ARIA label for the sidebar navigation',
      })}
      className={clsx(
        'menu thin-scrollbar',
        styles.menu,
        showAnnouncementBar && styles.menuWithAnnouncementBar,
        className,
      )}>
      <div className={styles.searchBox}>
        <input
          type="search"
          className={styles.searchInput}
          placeholder={translate({
            id: 'theme.docs.sidebar.search.placeholder',
            message: isZh ? '搜索标题...' : 'Search titles...',
            description: 'Sidebar search input placeholder',
          })}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label={translate({
            id: 'theme.docs.sidebar.search.ariaLabel',
            message: isZh ? '搜索文档标题' : 'Search docs titles',
            description: 'Sidebar search input aria label',
          })}
        />
      </div>

      {filteredSidebar.length > 0 ? (
        <ul className={clsx(ThemeClassNames.docs.docSidebarMenu, 'menu__list')}>
          <DocSidebarItems items={filteredSidebar} activePath={path} level={1} />
        </ul>
      ) : (
        <div className={styles.emptyResult}>
          {translate({
            id: 'theme.docs.sidebar.search.empty',
            message: isZh ? '没有匹配标题' : 'No matching titles',
            description: 'Empty state when no docs title matches search',
          })}
        </div>
      )}
    </nav>
  );
}
