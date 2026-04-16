import type {ReactNode} from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  Svg: React.ComponentType<React.ComponentProps<'svg'>>;
  description: ReactNode;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Enterprise-Ready Structure',
    Svg: require('@site/static/img/m-feature-core.svg').default,
    description: (
      <>
        Provide clear paths for onboarding, deployment, and operations with a
        consistent docs hierarchy.
      </>
    ),
  },
  {
    title: 'Localization for Global Teams',
    Svg: require('@site/static/img/m-feature-guide.svg').default,
    description: (
      <>
        Deliver bilingual content across English and Chinese with one shared
        documentation workflow.
      </>
    ),
  },
  {
    title: 'Controlled Publishing Pipeline',
    Svg: require('@site/static/img/m-feature-build.svg').default,
    description: (
      <>
        Keep content reliable through build validation and automated deployment
        from GitHub Actions.
      </>
    ),
  },
];

function Feature({title, Svg, description}: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className={styles.iconWrap}>
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className={styles.featureBody}>
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
