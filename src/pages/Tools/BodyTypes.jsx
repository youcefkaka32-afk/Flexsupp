import { useTranslation } from 'react-i18next'
import './ToolPage.css'

export default function BodyTypes() {
  const { i18n } = useTranslation()
  const lang = i18n.language

  const content = {
    fr: {
      title: 'Types de Corps',
      subtitle: 'Ectomorphe, Mésomorphe ou Endomorphe ?',
      intro: `Comprendre votre type de corps (ou somatotype) peut vous aider à personnaliser votre entraînement et votre nutrition pour obtenir de meilleurs résultats. Bien que la plupart des gens soient un mélange de ces trois types, identifier votre type dominant peut guider vos choix.`,
      types: [
        {
          name: 'ECTOMORPHE',
          traits: 'Corps mince et élancé, métabolisme rapide, difficulté à prendre du poids',
          nutrition: 'Calories élevées, glucides abondants, 5-6 repas/jour',
          training: 'Musculation lourde, courtes séances, cardio limité',
        },
        {
          name: 'MÉSOMORPHE',
          traits: 'Carrure athlétique naturelle, gains musculaires faciles, métabolisme équilibré',
          nutrition: 'Macros équilibrées (40% glucides, 30% protéines, 30% lipides)',
          training: 'Variété d\'entraînements, force + cardio, récupération adaptée',
        },
        {
          name: 'ENDOMORPHE',
          traits: 'Ossature large, gains faciles (muscle et graisse), métabolisme lent',
          nutrition: 'Glucides contrôlés, protéines élevées, portions modérées',
          training: 'Cardio régulier, circuits, entraînement métabolique',
        },
      ],
      tips: 'Conseils Généraux',
      tipsText: `• Identifiez votre type dominant mais reconnaissez que vous êtes unique
• Ajustez progressivement votre approche en fonction de vos résultats
• La génétique influence mais ne détermine pas votre potentiel
• Restez cohérent et patient - les changements prennent du temps
• Consultez un professionnel pour un plan personnalisé`,
    },
    en: {
      title: 'Body Types Guide',
      subtitle: 'Ectomorph, Mesomorph, or Endomorph?',
      intro: `Understanding your body type (or somatotype) can help you customize your training and nutrition for better results. While most people are a mix of these three types, identifying your dominant type can guide your choices.`,
      types: [
        {
          name: 'ECTOMORPH',
          traits: 'Lean and slender build, fast metabolism, difficulty gaining weight',
          nutrition: 'High calories, abundant carbs, 5-6 meals/day',
          training: 'Heavy strength training, short sessions, limited cardio',
        },
        {
          name: 'MESOMORPH',
          traits: 'Naturally athletic build, easy muscle gains, balanced metabolism',
          nutrition: 'Balanced macros (40% carbs, 30% protein, 30% fat)',
          training: 'Variety of training, strength + cardio, adapted recovery',
        },
        {
          name: 'ENDOMORPH',
          traits: 'Larger frame, easy gains (muscle and fat), slower metabolism',
          nutrition: 'Controlled carbs, high protein, moderate portions',
          training: 'Regular cardio, circuits, metabolic training',
        },
      ],
      tips: 'General Tips',
      tipsText: `• Identify your dominant type but recognize you're unique
• Progressively adjust your approach based on your results
• Genetics influence but don't determine your potential
• Stay consistent and patient - changes take time
• Consult a professional for a personalized plan`,
    },
  }

  const t = content[lang] || content.en

  return (
    <div className="tool-page">
      <div className="tool-hero" style={{
        backgroundImage: 'linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.7)), url(https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1470&auto=format&fit=crop)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}>
        <div className="section-shell">
          <h1 className="tool-hero__title font-display">{t.title}</h1>
          <p className="tool-hero__subtitle">{t.subtitle}</p>
        </div>
      </div>

      <div className="tool-content">
        <div className="section-shell">
          <div className="tool-article">
            <p className="article-content" style={{ fontSize: '18px', marginBottom: 'var(--space-3xl)' }}>
              {t.intro}
            </p>

            <div className="body-type-grid">
              {t.types.map((type, index) => (
                <div key={index} className="body-type-card">
                  <div style={{ 
                    width: '120px', 
                    height: '120px', 
                    margin: '0 auto var(--space-l)', 
                    borderRadius: '50%',
                    background: `linear-gradient(135deg, ${index === 0 ? '#60A5FA' : index === 1 ? '#34D399' : '#F59E0B'} 0%, ${index === 0 ? '#3B82F6' : index === 1 ? '#10B981' : '#D97706'} 100%)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '48px',
                    fontWeight: '900',
                    color: '#FFFFFF',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                  }}>
                    {index === 0 ? '|' : index === 1 ? '▼' : '●'}
                  </div>
                  <h4>{type.name}</h4>
                  <p style={{ fontWeight: '600', color: '#333', marginBottom: 'var(--space-m)' }}>
                    {type.traits}
                  </p>
                  <p style={{ marginBottom: 'var(--space-s)' }}>
                    <strong>Nutrition:</strong> {type.nutrition}
                  </p>
                  <p>
                    <strong>{lang === 'fr' ? 'Entraînement' : 'Training'}:</strong> {type.training}
                  </p>
                </div>
              ))}
            </div>

            {/* Visual comparison */}
            <div className="visual-diagram" style={{ marginTop: 'var(--space-5xl)' }}>
              <h3 className="diagram-title font-display">
                {lang === 'fr' ? 'Comparaison Visuelle' : 'Visual Comparison'}
              </h3>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(3, 1fr)', 
                gap: 'var(--space-2xl)',
                marginTop: 'var(--space-2xl)'
              }}>
                <img 
                  src="https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=1470&auto=format&fit=crop"
                  alt="Ectomorph"
                  style={{ width: '100%', height: '300px', objectFit: 'cover', borderRadius: 'var(--radius-m)' }}
                />
                <img 
                  src="https://images.unsplash.com/photo-1605296867304-46d5465a13f1?q=80&w=1470&auto=format&fit=crop"
                  alt="Mesomorph"
                  style={{ width: '100%', height: '300px', objectFit: 'cover', borderRadius: 'var(--radius-m)' }}
                />
                <img 
                  src="https://images.unsplash.com/photo-1566241440091-ec10de8db2e1?q=80&w=1466&auto=format&fit=crop"
                  alt="Endomorph"
                  style={{ width: '100%', height: '300px', objectFit: 'cover', borderRadius: 'var(--radius-m)' }}
                />
              </div>
            </div>

            <h3 className="article-title" style={{ marginTop: 'var(--space-5xl)', fontSize: '2rem' }}>
              {t.tips}
            </h3>
            <div className="article-content">
              {t.tipsText.split('\n').map((tip, index) => (
                <p key={index}>{tip}</p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
