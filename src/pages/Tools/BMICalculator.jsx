import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import './ToolPage.css'

export default function BMICalculator() {
  const { i18n } = useTranslation()
  const lang = i18n.language
  
  const [weight, setWeight] = useState('')
  const [height, setHeight] = useState('')
  const [bmi, setBmi] = useState(null)
  const [category, setCategory] = useState('')

  const content = {
    fr: {
      title: 'Calculateur IMC',
      subtitle: 'Calculez votre Indice de Masse Corporelle',
      weightLabel: 'Poids (kg)',
      heightLabel: 'Taille (cm)',
      calculate: 'CALCULER',
      result: 'Votre IMC',
      categories: {
        underweight: 'Insuffisance pondérale',
        normal: 'Poids normal',
        overweight: 'Surpoids',
        obese: 'Obésité',
      },
      about: 'À propos de l\'IMC',
      aboutText: `L'Indice de Masse Corporelle (IMC) est une mesure qui utilise votre taille et votre poids pour déterminer si votre poids est sain.

Pour la plupart des adultes, un IMC idéal se situe entre 18,5 et 24,9. Un IMC:
• Inférieur à 18,5 indique une insuffisance pondérale
• Entre 18,5 et 24,9 est considéré comme normal
• Entre 25 et 29,9 indique un surpoids
• 30 ou plus indique une obésité

Important: L'IMC est un outil de dépistage, pas un diagnostic. Consultez un professionnel de santé pour une évaluation complète.`,
    },
    ar: {
      title: 'حاسبة مؤشر كتلة الجسم',
      subtitle: 'احسب مؤشر كتلة جسمك',
      weightLabel: 'الوزن (كجم)',
      heightLabel: 'الطول (سم)',
      calculate: 'احسب',
      result: 'مؤشر كتلة جسمك',
      categories: {
        underweight: 'نقص الوزن',
        normal: 'وزن طبيعي',
        overweight: 'زيادة الوزن',
        obese: 'سمنة',
      },
      about: 'حول مؤشر كتلة الجسم',
      aboutText: `مؤشر كتلة الجسم (BMI) هو مقياس يستخدم طولك ووزنك لتحديد ما إذا كان وزنك صحيًا.

بالنسبة لمعظم البالغين، يتراوح مؤشر كتلة الجسم المثالي بين 18.5 و 24.9. مؤشر كتلة الجسم:
• أقل من 18.5 يشير إلى نقص الوزن
• بين 18.5 و 24.9 يعتبر طبيعيًا
• بين 25 و 29.9 يشير إلى زيادة الوزن
• 30 أو أكثر يشير إلى السمنة

مهم: مؤشر كتلة الجسم هو أداة فحص وليس تشخيصًا. استشر أخصائي صحة للحصول على تقييم كامل.`,
    },
    en: {
      title: 'BMI Calculator',
      subtitle: 'Calculate your Body Mass Index',
      weightLabel: 'Weight (kg)',
      heightLabel: 'Height (cm)',
      calculate: 'CALCULATE',
      result: 'Your BMI',
      categories: {
        underweight: 'Underweight',
        normal: 'Normal weight',
        overweight: 'Overweight',
        obese: 'Obese',
      },
      about: 'About BMI',
      aboutText: `Body Mass Index (BMI) is a measure that uses your height and weight to work out if your weight is healthy.

For most adults, an ideal BMI is in the 18.5 to 24.9 range. A BMI:
• Below 18.5 indicates underweight
• Between 18.5 and 24.9 is considered normal
• Between 25 and 29.9 indicates overweight
• 30 or above indicates obesity

Important: BMI is a screening tool, not a diagnosis. Consult a healthcare professional for a complete assessment.`,
    },
  }

  const t = content[lang] || content.en

  const calculateBMI = () => {
    if (weight && height) {
      const heightInMeters = height / 100
      const bmiValue = (weight / (heightInMeters * heightInMeters)).toFixed(1)
      setBmi(bmiValue)

      if (bmiValue < 18.5) setCategory(t.categories.underweight)
      else if (bmiValue >= 18.5 && bmiValue < 25) setCategory(t.categories.normal)
      else if (bmiValue >= 25 && bmiValue < 30) setCategory(t.categories.overweight)
      else setCategory(t.categories.obese)
    }
  }

  return (
    <div className="tool-page">
      <div className="tool-hero" style={{
        backgroundImage: 'linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.7)), url(https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=1470&auto=format&fit=crop)',
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
          <div className="tool-layout">
            <div className="tool-calculator">
              <div className="calc-inputs">
                <div className="calc-field">
                  <label className="calc-label font-display">{t.weightLabel}</label>
                  <input
                    type="number"
                    className="calc-input"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    placeholder="70"
                  />
                </div>

                <div className="calc-field">
                  <label className="calc-label font-display">{t.heightLabel}</label>
                  <input
                    type="number"
                    className="calc-input"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    placeholder="175"
                  />
                </div>

                <button 
                  className="calc-button font-display"
                  onClick={calculateBMI}
                >
                  {t.calculate}
                </button>
              </div>

              {bmi && (
                <div className="calc-result">
                  <div className="result-value">
                    <span className="result-label font-display">{t.result}:</span>
                    <span className="result-number font-display">{bmi}</span>
                  </div>
                  <div className="result-category">{category}</div>
                </div>
              )}

              {/* BMI Chart Visual */}
              <div className="bmi-chart">
                <div className="bmi-range" style={{ background: '#60A5FA', flex: '18.5' }}>
                  <span>&lt;18.5</span>
                </div>
                <div className="bmi-range" style={{ background: '#34D399', flex: '6.4' }}>
                  <span>18.5-24.9</span>
                </div>
                <div className="bmi-range" style={{ background: '#FBBF24', flex: '5' }}>
                  <span>25-29.9</span>
                </div>
                <div className="bmi-range" style={{ background: '#EF4444', flex: '10' }}>
                  <span>30+</span>
                </div>
              </div>
            </div>

            <div className="tool-sidebar">
              <img 
                src="/images/Bodymaxindex.jpg"
                alt="Body Mass Index chart"
                className="sidebar-image"
              />
            </div>
          </div>

          <div className="tool-article">
            <h2 className="article-title font-display">{t.about}</h2>
            <div className="article-content">
              {t.aboutText.split('\n\n').map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
