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
      
      premium: {
        title: 'Programme d\'Entraînement Complet',
        subtitle: 'Guide PDF Professionnel',
        price: '2000',
        currency: 'DA',
        description: 'Obtenez un programme d\'entraînement complet basé sur la science avec des guides visuels détaillés, des protocoles de progression et des recommandations nutritionnelles.',
        features: [
          'Programme structuré pour tous les niveaux',
          'Guides visuels pour chaque exercice',
          'Nombre de répétitions et séries optimisés',
          'Méthodes de progression validées',
        ],
        orderWhatsApp: 'COMMANDER VIA WHATSAPP',
        orderEmail: 'Ou par email:',
      },
    },
    ar: {
      title: 'تخطيط التمرين',
      subtitle: 'نظّم جلساتك للحصول على نتائج مثالية',
      intro: `التخطيط الفعال هو مفتاح النجاح في كمال الأجسام واللياقة البدنية. سواء كنت مبتدئاً أو متقدماً، تنظيم تمارينك يعظم النتائج ويقلل من مخاطر الإصابة.`,
      
      principles: {
        title: 'المبادئ الأساسية',
        items: [
          {
            name: 'الحمل التدريجي',
            desc: 'زد الشدة تدريجياً (الوزن، التكرارات، الحجم) لمواصلة التقدم.',
          },
          {
            name: 'الخصوصية',
            desc: 'تدرب وفقاً لأهدافك المحددة (قوة، تضخم، قدرة على التحمل).',
          },
          {
            name: 'الاستشفاء',
            desc: 'الراحة ضرورية - العضلات تنمو أثناء الاستشفاء، وليس أثناء التدريب.',
          },
          {
            name: 'الدورية',
            desc: 'نوّع الشدة والحجم في دورات لتجنب الثبات.',
          },
        ],
      },

      splits: {
        title: 'أنواع التقسيمات',
        items: [
          '**كامل الجسم (3 مرات/أسبوع):** مثالي للمبتدئين، يحفز كامل الجسم كل جلسة',
          '**علوي/سفلي (4 مرات/أسبوع):** توازن جيد، يسمح بحجم أكبر لكل مجموعة عضلية',
          '**دفع/سحب/أرجل (6 مرات/أسبوع):** للمتقدمين، حجم عالي، استشفاء محسن',
          '**تقسيم عضلي (5-6 مرات/أسبوع):** مجموعة عضلية واحدة في اليوم، حجم أقصى لكل عضلة',
        ],
      },

      structure: {
        title: 'هيكل الجلسة',
        steps: [
          '**الإحماء (5-10 دقائق):** كارديو خفيف + حركة المفاصل',
          '**التنشيط (5 دقائق):** تمارين تنشيط للعضلات المستهدفة',
          '**التمارين الرئيسية (30-40 دقيقة):** حركات مركبة ثقيلة',
          '**تمارين العزل (15-20 دقيقة):** عمل مستهدف',
          '**التهدئة (5 دقائق):** تمدد خفيف',
        ],
      },

      tips: {
        title: 'نصائح احترافية',
        items: [
          'تتبع أداءك في دفتر تدريب',
          'أعط الأولوية لجودة التنفيذ على الكمية',
          'نوّع التمارين كل 4-6 أسابيع',
          'استمع لجسمك - تكيف حسب الحاجة',
          'نم 7-9 ساعات في الليلة للاستشفاء الأمثل',
          'اشرب الماء قبل وأثناء وبعد التدريب',
        ],
      },
      
      premium: {
        title: 'برنامج تدريب كامل',
        subtitle: 'دليل PDF احترافي',
        price: '2000',
        currency: 'دج',
        description: 'احصل على برنامج تدريب كامل مبني على العلم مع أدلة بصرية مفصلة، بروتوكولات التقدم، وتوصيات غذائية.',
        features: [
          'برنامج منظم لجميع المستويات',
          'أدلة بصرية لكل تمرين',
          'عدد التكرارات والمجموعات المثلى',
          'طرق التقدم المثبتة',
        ],
        orderWhatsApp: 'اطلب عبر واتساب',
        orderEmail: 'أو عبر البريد:',
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
      
      premium: {
        title: 'Complete Training Program',
        subtitle: 'Professional PDF Guide',
        price: '2000',
        currency: 'DA',
        description: 'Get a complete science-based training program with detailed visual guides, progression protocols, and nutritional recommendations.',
        features: [
          'Structured program for all levels',
          'Visual guides for each exercise',
          'Optimized rep and set ranges',
          'Validated progression methods',
        ],
        orderWhatsApp: 'ORDER VIA WHATSAPP',
        orderEmail: 'Or by email:',
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

            {/* Premium Program Section */}
            <div style={{
              background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)',
              borderRadius: 'var(--radius-l)',
              padding: 'var(--space-5xl) var(--space-3xl)',
              marginTop: 'var(--space-6xl)',
              color: '#FFFFFF',
              position: 'relative',
              overflow: 'hidden',
            }}>
              {/* Background image overlay */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundImage: 'url(/images/etraining-program.png)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                opacity: 0.15,
                zIndex: 0,
              }} />
              
              <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
                <h2 className="font-display" style={{ fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', fontWeight: '900', marginBottom: 'var(--space-m)', textTransform: 'uppercase' }}>
                  {t.premium.title}
                </h2>
                <p style={{ fontSize: '20px', marginBottom: 'var(--space-l)', opacity: 0.9 }}>
                  {t.premium.subtitle}
                </p>
                <p style={{ fontSize: '18px', lineHeight: '1.8', marginBottom: 'var(--space-3xl)', opacity: 0.85 }}>
                  {t.premium.description}
                </p>

                {/* Features Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--space-l)', marginBottom: 'var(--space-4xl)', textAlign: 'left' }}>
                  {t.premium.features.map((feature, index) => (
                    <div key={index} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-m)' }}>
                      <div style={{ 
                        width: '30px',
                        height: '30px',
                        borderRadius: '50%',
                        background: 'var(--red)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '16px',
                        flexShrink: 0
                      }}>
                        ✓
                      </div>
                      <p style={{ fontSize: '16px', margin: 0 }}>{feature}</p>
                    </div>
                  ))}
                </div>

                {/* Price */}
                <div style={{ marginBottom: 'var(--space-3xl)' }}>
                  <p className="font-display" style={{ fontSize: '64px', fontWeight: '900', lineHeight: '1', color: 'var(--red)' }}>
                    {t.premium.price} <span style={{ fontSize: '36px' }}>{t.premium.currency}</span>
                  </p>
                </div>

                {/* Order Button */}
                <button 
                  onClick={() => {
                    const message = encodeURIComponent(
                      lang === 'fr' 
                        ? `Bonjour! Je suis intéressé par le Programme d'Entraînement Complet (2000 DA).`
                        : lang === 'ar'
                        ? `مرحباً! أنا مهتم ببرنامج التدريب الكامل (2000 دج).`
                        : `Hello! I'm interested in the Complete Training Program (2000 DA).`
                    )
                    window.open(`https://wa.me/213553628299?text=${message}`, '_blank')
                  }}
                  style={{
                    padding: 'var(--space-l) var(--space-4xl)',
                    background: '#25D366',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: 'var(--radius-m)',
                    fontSize: '20px',
                    fontWeight: '900',
                    letterSpacing: '0.05em',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 'var(--space-m)',
                    marginBottom: 'var(--space-l)',
                  }}
                  className="font-display"
                  onMouseOver={(e) => {
                    e.target.style.transform = 'translateY(-4px)'
                    e.target.style.boxShadow = '0 8px 20px rgba(37, 211, 102, 0.4)'
                  }}
                  onMouseOut={(e) => {
                    e.target.style.transform = 'translateY(0)'
                    e.target.style.boxShadow = 'none'
                  }}
                >
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                  {t.premium.orderWhatsApp}
                </button>

                <p style={{ fontSize: '16px', opacity: 0.8 }}>
                  {t.premium.orderEmail} <a href="mailto:Kanardodjamel34@gmail.com" style={{ color: 'var(--red)', textDecoration: 'none', fontWeight: '700' }}>Kanardodjamel34@gmail.com</a>
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
