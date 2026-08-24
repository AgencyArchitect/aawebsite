export type Feature = {
  title: string;
  description: string;
  icon: 'custom' | 'scale' | 'personal';
  iconImage: string;
};

type FeatureSectionProps = {
  features: Feature[];
};

/**
 * Compact USP grid based on the installed @efferd/features-1 block.
 * Content is passed from Astro so it remains present in server-rendered HTML.
 */
export function FeatureSection({ features }: FeatureSectionProps) {
  return (
    <div className="aa-feature-grid" role="list" aria-label="Waarom Agency Architect">
      {features.map((feature) => (
        <article className="aa-feature-card" role="listitem" key={feature.title}>
          <div className="aa-feature-icon" aria-hidden="true">
            <img className="aa-feature-image" src={feature.iconImage} alt="" width="512" height="512" />
          </div>
          <h3>{feature.title}</h3>
          <p>{feature.description}</p>
        </article>
      ))}
    </div>
  );
}

const glyphs: Record<Feature['icon'], string> = {
  custom: '◈',
  scale: '↗',
  personal: '◎',
};