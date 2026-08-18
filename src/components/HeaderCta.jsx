import SpecularButton from './ui/SpecularButton.jsx';

// Header CTA in Agency Architect branding: imperial blue glass, beige label,
// light-blue specular sheen. No metal-fx ring.
export default function HeaderCta() {
  return (
    <SpecularButton
      size="lg"
      radius={20}
      tint="#001d51"
      tintOpacity={1}
      blur={0}
      textColor="#faf8f5"
      lineColor="#9dbfef"
      baseColor="#1b3b78"
      intensity={1.3}
      shineSize={9}
      shineFade={38}
      thickness={1.4}
      speed={0.35}
      followMouse
      proximity={280}
      autoAnimate={false}
      onClick={() => {
        window.location.href = '/creative-scale-audit/';
      }}
    >
      Gratis Meta Audit
    </SpecularButton>
  );
}
