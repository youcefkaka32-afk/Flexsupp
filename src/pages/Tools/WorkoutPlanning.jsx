import { useTranslation } from 'react-i18next'
import './ToolPage.css'

export default function WorkoutPlanning() {
  const { i18n } = useTranslation()
  const lang = i18n.language

  const content = {
    fr: {
      title: 'Planification d\'Entraînement',
      subtitle: 'Structurez vos séances pour des résultats optimaux',
      intro: `Une planification efficace est la clé du succès en musculation et fitness. Que vous soyez débutant ou avancé, structurer vos entraînements maximise vos résultats et minimise les risques de blessure.`,
      
      principles: {
        title: 'Principes Fondamentaux',
        items: [
          {
            name: 'Surcharge Progressive',
            desc: 'Augmentez graduellement l\'intensité (poids, répétitions, volume) pour continuer à progresser.',
          },
          {
            name: 'Spécificité',
            desc: 'Entraînez-vous selon vos objectifs spécifiques (force, hypertrophie, endurance).',
          },
          {
            name: 'Récupération',
            desc: 'Le repos est essentiel - les muscles se construisent pendant la récupération, pas pendant l\'entraînement.',
          },
          {
            name: 'Périodisation',
            desc: 'Variez l\'intensité et le volume sur des cycles pour éviter la stagnation.',
          },
        ],
      },

      splits: {
        title: 'Types de Splits',
        items: [
          '**Full Body (3x/semaine):** Idéal pour débutants, stimule tout le corps chaque séance',
          '**Upper/Lower (4x/semaine):** Bon équilibre, permet plus de volume par groupe musculaire',
          '**Push/Pull/Legs (6x/semaine):** Pour avancés, volume élevé, récupération optimisée',
          '**Bro Split (5-6x/semaine):** Un groupe musculaire par jour, volume maximum par muscle',
        ],
      },

      structure: {
        title: 'Structure d\'une Séance',
        steps: [
          '**Échauffement (5-10 min):** Cardio léger + mobilité articulaire',
          '**Activation (5 min):** Exercices d\'activation des muscles ciblés',
          '**Exercices Principaux (30-40 min):** Mouvements composés lourds',
          '**Exercices d\'Isolation (15-20 min):** Travail ciblé',
          '**Retour au calme (5 min):** Étirements légers',
        ],
      },

      tips: {
        title: 'Conseils Pro',
        items: [
          'Notez vos performances dans un journal d\'entraînement',
          'Privilégiez la qualité d\'exécution sur la quantité',
          'Variez les exercices toutes les 4-6 semaines',
          'Écoutez votre corps - adaptez si nécessaire',
          'Dormez 7-9h par nuit pour une récupération optimale',
          'Hydratez-vous avant, pendant et après l\'entraînement',
        ],
      },
    },
    en: {
      title: 'Workout Planning',
      subtitle: 'Structure your sessions for optimal results',
      intro: `Effective planning is key to success in bodybuilding and fitness. Whether you're a beginner or advanced, structuring your workouts maximizes results and minimizes injury risk.`,
      
      principles: {
        title: 'Fundamental Principles',
        items: [
          {
            name: 'Progressive Overload',
            desc: 'Gradually increase intensity (weight, reps, volume) to continue progressing.',
          },
          {
            name: 'Specificity',
            desc: 'Train according to your specific goals (strength, hypertrophy, endurance).',
          },
          {
            name: 'Recovery',
            desc: 'Rest is essential - muscles grow during recovery, not during training.',
          },
          {
            name: 'Periodization',
            desc: 'Vary intensity and volume in cycles to avoid plateaus.',
          },
        ],
      },

      splits: {
        title: 'Training Splits',
        items: [
          '**Full Body (3x/week):** Ideal for beginners, stimulates entire body each session',
          '**Upper/Lower (4x/week):** Good balance, allows more volume per muscle group',
          '**Push/Pull/Legs (6x/week):** For advanced, high volume, optimized recovery',
          '**Bro Split (5-6x/week):** One muscle group per day, maximum volume per muscle',
        ],
      },

      structure: {
        title: 'Session Structure',
        steps: [
          '**Warm-up (5-10 min):** Light cardio + joint mobility',
          '**Activation (5 min):** Activation exercises for target muscles',
          '**Main Exercises (30-40 min):** Heavy compound movements',
          '**Isolation Exercises (15-20 min):** Targeted work',
          '**Cool-down (5 min):** Light stretching',
        ],
      },

      tips: {
        title: 'Pro Tips',
        items: [
          'Track your performance in a training journal',
          'Prioritize execution quality over quantity',
          'Vary exercises every 4-6 weeks',
          'Listen to your body - adapt as needed',
          'Sleep 7-9h per night for optimal recovery',
          'Hydrate before, during, and after training',
        ],
      },
    },
  }

  const t = content[lang] || content.en

  return (
    <div className="tool-page">
      <div className="tool-hero" style={{
        backgroundImage: 'linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.7)), url(https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1470&auto=format&fit=crop)',
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

            {/* Principles */}
            <h2 className="article-title font-display">{t.principles.title}</h2>
            <div className="body-type-grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)', marginBottom: 'var(--space-5xl)' }}>
              {t.principles.items.map((item, index) => (
                <div key={index} className="body-type-card" style={{ textAlign: 'left' }}>
                  <div style={{ 
                    width: '60px', 
                    height: '60px', 
                    marginBottom: 'var(--space-m)', 
                    borderRadius: 'var(--radius-m)',
                    background: 'var(--red)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '28px',
                    fontWeight: '900',
                    color: '#FFFFFF'
                  }}>
                    {index + 1}
                  </div>
                  <h4>{item.name}</h4>
                  <p>{item.desc}</p>
                </div>
              ))}
            </div>

            {/* Workout Images */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: '1fr 1fr', 
              gap: 'var(--space-xl)',
              marginBottom: 'var(--space-5xl)'
            }}>
              <img 
                src="https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=1470&auto=format&fit=crop"
                alt="Strength training"
                style={{ width: '100%', height: '300px', objectFit: 'cover', borderRadius: 'var(--radius-l)', boxShadow: 'var(--shadow-card)' }}
              />
              <img 
                src="https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=1469&auto=format&fit=crop"
                alt="Workout planning"
                style={{ width: '100%', height: '300px', objectFit: 'cover', borderRadius: 'var(--radius-l)', boxShadow: 'var(--shadow-card)' }}
              />
            </div>

            {/* Training Splits */}
            <h2 className="article-title font-display">{t.splits.title}</h2>
            <div className="visual-diagram">
              <div className="diagram-grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
                {t.splits.items.map((item, index) => {
                  const [title, desc] = item.split(':**')
                  return (
                    <div key={index} className="diagram-item" style={{ textAlign: 'left' }}>
                      <h5 dangerouslySetInnerHTML={{ __html: title.replace('**', '') }} />
                      <p>{desc}</p>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Session Structure */}
            <h2 className="article-title font-display">{t.structure.title}</h2>
            <div style={{ 
              background: 'linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 100%)',
              borderRadius: 'var(--radius-l)',
              padding: 'var(--space-3xl)',
              marginBottom: 'var(--space-5xl)'
            }}>
              {t.structure.steps.map((step, index) => {
                const [title, desc] = step.split(':**')
                return (
                  <div key={index} style={{ 
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 'var(--space-l)',
                    marginBottom: index < t.structure.steps.length - 1 ? 'var(--space-xl)' : '0',
                    paddingBottom: index < t.structure.steps.length - 1 ? 'var(--space-xl)' : '0',
                    borderBottom: index < t.structure.steps.length - 1 ? '2px solid #ddd' : 'none'
                  }}>
                    <div style={{ 
                      minWidth: '50px',
                      height: '50px',
                      borderRadius: '50%',
                      background: 'var(--red)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '24px',
                      fontWeight: '900',
                      color: '#FFFFFF',
                      flexShrink: 0
                    }}>
                      {index + 1}
                    </div>
                    <div>
                      <h4 style={{ 
                        fontFamily: 'Barlow Condensed, sans-serif',
                        fontSize: '22px',
                        fontWeight: '900',
                        color: '#111',
                        marginBottom: 'var(--space-xs)',
                        textTransform: 'uppercase'
                      }} dangerouslySetInnerHTML={{ __html: title.replace('**', '') }} />
                      <p style={{ 
                        fontSize: '16px',
                        lineHeight: '1.6',
                        color: '#666',
                        margin: 0
                      }}>{desc}</p>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Exercise demonstration image */}
            <img 
              src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1470&auto=format&fit=crop"
              alt="Exercise demonstration"
              style={{ 
                width: '100%', 
                height: '400px', 
                objectFit: 'cover', 
                borderRadius: 'var(--radius-l)', 
                marginBottom: 'var(--space-5xl)',
                boxShadow: 'var(--shadow-card)'
              }}
            />

            {/* Pro Tips */}
            <h2 className="article-title font-display">{t.tips.title}</h2>
            <div className="diagram-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
              {t.tips.items.map((tip, index) => (
                <div key={index} className="info-box" style={{ margin: 0 }}>
                  <div style={{ 
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: 'var(--red)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '20px',
                    fontWeight: '900',
                    color: '#FFFFFF',
                    marginBottom: 'var(--space-m)'
                  }}>
                    ✓
                  </div>
                  <p style={{ fontSize: '15px', lineHeight: '1.7', color: '#333' }}>{tip}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
