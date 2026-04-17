import React, {type ReactNode} from 'react';
import clsx from 'clsx';
import {ThemeClassNames} from '@docusaurus/theme-common';
import {useDoc} from '@docusaurus/plugin-content-docs/client';
import Heading from '@theme/Heading';
import MDXContent from '@theme/MDXContent';
import type {Props} from '@theme/DocItem/Content';
import {DocPageFirstH1Provider} from '../../../contexts/DocPageFirstH1Context';
import DocPermalinkCopy from '../../../components/DocPermalinkCopy';
import styles from './styles.module.css';

function useSyntheticTitle(): string | null {
  const {metadata, frontMatter, contentTitle} = useDoc();
  const shouldRender =
    !frontMatter.hide_title && typeof contentTitle === 'undefined';
  if (!shouldRender) {
    return null;
  }
  return metadata.title;
}

export default function DocItemContent({children}: Props): ReactNode {
  const {metadata} = useDoc();
  const syntheticTitle = useSyntheticTitle();
  const docKey = metadata.permalink ?? metadata.id;

  return (
    <DocPageFirstH1Provider
      docKey={docKey}
      skipMdxH1Copy={Boolean(syntheticTitle)}>
      <div className={clsx(ThemeClassNames.docs.docMarkdown, 'markdown')}>
        {syntheticTitle && (
          <header className={styles.docTitleHeader}>
            <Heading as="h1" className={styles.docTitleHeading}>
              {syntheticTitle}
            </Heading>
            <DocPermalinkCopy />
          </header>
        )}
        <MDXContent>{children}</MDXContent>
      </div>
    </DocPageFirstH1Provider>
  );
}
