import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import './ToolPage.css'

export default function CalorieCalculator() {
  const { i18n } = useTranslation()
  const lang = i18n.language
  
  const [gender, setGender] = useState('male')
  const [weight, setWeight] = useState('')
  const [height, setHeight] = useState('')
  const [age, setAge] = useState('')
  const [activity, setActivity] = useState('1.375')
  const [goal, setGoal] = useState('maintain')
  const [calories, setCalories] = useState(null)

  const content = {
    fr: {
      title: 'Calculateur de Calories',
      subtitle: 'Déterminez vos besoins caloriques quotidiens',
      genderLabel: 'Sexe',
      male: 'Homme',
      female: 'Femme',
      weightLabel: 'Poids (kg)',
      heightLabel: 'Taille (cm)',
      ageLabel: 'Âge',
      activityLabel: 'Niveau d\'activité',
      activities: {
        '1.2': 'Sédentaire (peu ou pas d\'exercice)',
        '1.375': 'Légèrement actif (1-3 jours/semaine)',
        '1.55': 'Modérément actif (3-5 jours/semaine)',
        '1.725': 'Très actif (6-7 jours/semaine)',
        '1.9': 'Extrêmement actif (athlète)',
      },
      goalLabel: 'Objectif',
      goals: {
        lose: 'Perdre du poids (-500 kcal)',
        maintain: 'Maintenir le poids',
        gain: 'Prendre du poids (+500 kcal)',
      },
      calculate: 'CALCULER',
      result: 'Calories quotidiennes',
      about: 'Comment ça marche',
      aboutText: `Ce calculateur utilise l'équation de Mifflin-St Jeor pour estimer votre métabolisme de base (BMR), puis l'ajuste en fonction de votre niveau d'activité et de vos objectifs.

Formule:
• Hommes: BMR = 10 × poids(kg) + 6.25 × taille(cm) - 5 × âge + 5
• Femmes: BMR = 10 × poids(kg) + 6.25 × taille(cm) - 5 × âge - 161

Le résultat est ensuite multiplié par votre facteur d'activité et ajusté selon votre objectif:
• Perte de poids: -500 kcal/jour (≈0.5 kg/semaine)
• Maintien: Calories de maintenance
• Prise de masse: +500 kcal/jour (≈0.5 kg/semaine)

Important: Ces estimations sont des points de départ. Ajustez en fonction de vos résultats et consultez un professionnel si nécessaire.`,
    },
    en: {
      title: 'Calorie Calculator',
      subtitle: 'Determine your daily calorie needs',
      genderLabel: 'Gender',
      male: 'Male',
      female: 'Female',
      weightLabel: 'Weight (kg)',
      heightLabel: 'Height (cm)',
      ageLabel: 'Age',
      activityLabel: 'Activity Level',
      activities: {
        '1.2': 'Sedentary (little or no exercise)',
        '1.375': 'Lightly active (1-3 days/week)',
        '1.55': 'Moderately active (3-5 days/week)',
        '1.725': 'Very active (6-7 days/week)',
        '1.9': 'Extremely active (athlete)',
      },
      goalLabel: 'Goal',
      goals: {
        lose: 'Lose weight (-500 kcal)',
        maintain: 'Maintain weight',
        gain: 'Gain weight (+500 kcal)',
      },
      calculate: 'CALCULATE',
      result: 'Daily Calories',
      about: 'How it Works',
      aboutText: `This calculator uses the Mifflin-St Jeor equation to estimate your Basal Metabolic Rate (BMR), then adjusts it based on your activity level and goals.

Formula:
• Men: BMR = 10 × weight(kg) + 6.25 × height(cm) - 5 × age + 5
• Women: BMR = 10 × weight(kg) + 6.25 × height(cm) - 5 × age - 161

The result is then multiplied by your activity factor and adjusted for your goal:
• Weight loss: -500 kcal/day (≈1 lb/week)
• Maintenance: Maintenance calories
• Weight gain: +500 kcal/day (≈1 lb/week)

Important: These estimates are starting points. Adjust based on your results and consult a professional if needed.`,
    },
  }

  const t = content[lang] || content.en

  const calculateCalories = () => {
    if (weight && height && age) {
      // Mifflin-St Jeor equation
      let bmr
      if (gender === 'male') {
        bmr = 10 * weight + 6.25 * height - 5 * age + 5
      } else {
        bmr = 10 * weight + 6.25 * height - 5 * age - 161
      }

      // Apply activity multiplier
      let tdee = bmr * parseFloat(activity)

      // Adjust for goal
      if (goal === 'lose') tdee -= 500
      else if (goal === 'gain') tdee += 500

      setCalories(Math.round(tdee))
    }
  }

  return (
    <div className="tool-page">
      <div className="tool-hero">
        <div className="section-shell">
          <h1 className="tool-hero__title font-display">{t.title}</h1>
          <p className="tool-hero__subtitle">{t.subtitle}</p>
        </div>
      </div>

      <div className="tool-content">
        <div className="section-shell">
          <div className="tool-calculator">
            <div className="calc-inputs" style={{ gridTemplateColumns: '1fr 1fr' }}>
              <div className="calc-field">
                <label className="calc-label font-display">{t.genderLabel}</label>
                <select 
                  className="calc-input"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                >
                  <option value="male">{t.male}</option>
                  <option value="female">{t.female}</option>
                </select>
              </div>

              <div className="calc-field">
                <label className="calc-label font-display">{t.ageLabel}</label>
                <input
                  type="number"
                  className="calc-input"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="25"
                />
              </div>

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

              <div className="calc-field">
                <label className="calc-label font-display">{t.activityLabel}</label>
                <select 
                  className="calc-input"
                  value={activity}
                  onChange={(e) => setActivity(e.target.value)}
                >
                  {Object.entries(t.activities).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </div>

              <div className="calc-field">
                <label className="calc-label font-display">{t.goalLabel}</label>
                <select 
                  className="calc-input"
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                >
                  {Object.entries(t.goals).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </div>

              <button 
                className="calc-button font-display"
                onClick={calculateCalories}
                style={{ gridColumn: '1 / -1' }}
              >
                {t.calculate}
              </button>
            </div>

            {calories && (
              <div className="calc-result">
                <div className="result-value">
                  <span className="result-label font-display">{t.result}:</span>
                  <span className="result-number font-display">{calories}</span>
                </div>
                <div className="result-category">kcal/jour</div>
              </div>
            )}
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
