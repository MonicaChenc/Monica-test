import React, {type ReactNode} from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import type {Props} from '@theme/MDXComponents/Heading';
import {useDocPageFirstH1Claim} from '../../contexts/DocPageFirstH1Context';
import DocPermalinkCopy from '../../components/DocPermalinkCopy';
import styles from '../DocItem/Content/styles.module.css';

export default function MDXHeading(props: Props): ReactNode {
  const {as, className, ...rest} = props;
  const claimFirstMdxH1 = useDocPageFirstH1Claim();

  if (as === 'h1' && claimFirstMdxH1()) {
    return (
      <header className={styles.docTitleHeader}>
        <Heading
          {...rest}
          as={as}
          className={clsx(styles.docTitleHeading, className)}
        />
        <DocPermalinkCopy />
      </header>
    );
  }

  return <Heading {...props} />;
}
