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
    title: 'Simple Setup',
    Svg: require('@site/static/img/m-feature-core.svg').default,
    description: (
      <>
        Start quickly with a clean structure for docs, guides, and FAQs.
      </>
    ),
  },
  {
    title: 'Content First',
    Svg: require('@site/static/img/m-feature-guide.svg').default,
    description: (
      <>
        Keep your documentation organized and easy to navigate for readers.
      </>
    ),
  },
  {
    title: 'Fast Publishing',
    Svg: require('@site/static/img/m-feature-build.svg').default,
    description: (
      <>
        Build and deploy updates with confidence through your GitHub workflow.
      </>
    ),
  },
];

function Feature({title, Svg, description}: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
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
