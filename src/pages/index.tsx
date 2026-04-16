import type {ReactNode} from 'react';
import clsx from 'clsx';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import Heading from '@theme/Heading';

import styles from './index.module.css';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className={styles.heroTitle}>
          Build, Ship, and Scale with Monica Docs
        </Heading>
        <p className={styles.heroSubtitle}>
          Centralized product documentation for onboarding, implementation,
          operations, and release notes.
        </p>
        <div className={styles.heroSearch}>
          <input
            type="search"
            className={styles.heroSearchInput}
            placeholder="Search docs"
            aria-label="Search docs"
          />
        </div>
      </div>
    </header>
  );
}

export default function Home(): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`${siteConfig.title} | Documentation Center`}
      description="Product documentation for onboarding, integration, and operations.">
      <HomepageHeader />
      <main>
        <HomepageFeatures />
      </main>
    </Layout>
  );
}
