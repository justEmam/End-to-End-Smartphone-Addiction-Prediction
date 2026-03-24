import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { submitQuiz } from '../api/predict'
import styles from './Quiz.module.css'

const STEPS = [
  {
    title:    'About you',
    subtitle: 'Basic personal information',
    fields:   ['age', 'gender'],
  },
  {
    title:    'Screen time',
    subtitle: 'Your daily usage breakdown',
    fields:   ['daily_screen_time_hours', 'social_media_hours', 'gaming_hours', 'work_study_hours', 'weekend_screen_time'],
  },
  {
    title:    'Lifestyle',
    subtitle: 'Sleep, notifications and impact',
    fields:   ['sleep_hours', 'notifications_per_day', 'app_opens_per_day', 'stress_level', 'academic_work_impact'],
  },
]

const FIELDS = {
  age:                     { label: 'Age',                       type: 'number', placeholder: '22',  min: 10,  max: 100 },
  gender:               { label: 'Gender',               type: 'select', options: ['Male', 'Female', 'Other'] },
  daily_screen_time_hours: { label: 'Daily screen time (hrs)',   type: 'number', placeholder: '6',   min: 0, max: 24, step: 0.5 },
  social_media_hours:      { label: 'Social media (hrs/day)',    type: 'number', placeholder: '3',   min: 0, max: 24, step: 0.5 },
  gaming_hours:            { label: 'Gaming (hrs/day)',          type: 'number', placeholder: '1',   min: 0, max: 24, step: 0.5 },
  work_study_hours:        { label: 'Work / study (hrs/day)',    type: 'number', placeholder: '4',   min: 0, max: 24, step: 0.5 },
  weekend_screen_time:     { label: 'Weekend screen time (hrs)', type: 'number', placeholder: '8',   min: 0, max: 24, step: 0.5 },
  sleep_hours:             { label: 'Sleep (hrs/night)',         type: 'number', placeholder: '7',   min: 0, max: 24, step: 0.5 },
  notifications_per_day:   { label: 'Notifications per day',     type: 'number', placeholder: '80',  min: 0 },
  app_opens_per_day:       { label: 'App opens per day',         type: 'number', placeholder: '50',  min: 0 },
  stress_level:            { label: 'Stress level',              type: 'select', options: ['Low', 'Medium', 'High'] },
  academic_work_impact: { label: 'Impact on work / study', type: 'select', options: ['Yes', 'No'] },
}

const EMPTY = Object.fromEntries(Object.keys(FIELDS).map(k => [k, '']))

export default function Quiz() {
  const navigate            = useNavigate()
  const [step, setStep]     = useState(0)
  const [form, setForm]     = useState(EMPTY)
  const [loading, setLoading] = useState(false)
  const [error, setError]   = useState(null)

  const current = STEPS[step]
  const isLast  = step === STEPS.length - 1

  function handleChange(e) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    setError(null)
  }

  function stepValid() {
    return current.fields.every(f => String(form[f]).trim() !== '')
  }

  function next() {
    if (!stepValid()) { setError('Please fill in all fields.'); return }
    setError(null)
    setStep(s => s + 1)
  }

  async function submit() {
    if (!stepValid()) { setError('Please fill in all fields.'); return }
    setLoading(true)
    setError(null)

    try {
      const payload = {
        ...form,
        age:                     parseInt(form.age),
        daily_screen_time_hours: parseFloat(form.daily_screen_time_hours),
        social_media_hours:      parseFloat(form.social_media_hours),
        gaming_hours:            parseFloat(form.gaming_hours),
        work_study_hours:        parseFloat(form.work_study_hours),
        weekend_screen_time:     parseFloat(form.weekend_screen_time),
        sleep_hours:             parseFloat(form.sleep_hours),
        notifications_per_day:   parseInt(form.notifications_per_day),
        app_opens_per_day:       parseInt(form.app_opens_per_day),
      }

      const result = await submitQuiz(payload)
      navigate('/result', { state: result })
    } catch (err) {
      setError('Something went wrong. Make sure the backend is running.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>

        <div className={styles.progress}>
          {STEPS.map((_, i) => (
            <div key={i} className={`${styles.pip} ${i <= step ? styles.pipActive : ''}`} />
          ))}
        </div>

        <p className={styles.stepLabel}>Step {step + 1} of {STEPS.length}</p>
        <h2 className={styles.title}>{current.title}</h2>
        <p className={styles.subtitle}>{current.subtitle}</p>

        <div className={styles.fields}>
          {current.fields.map(key => {
            const cfg = FIELDS[key]
            return (
              <div className={styles.field} key={key}>
                <label className={styles.label}>{cfg.label}</label>
                {cfg.type === 'select' ? (
                  <select name={key} value={form[key]} onChange={handleChange}>
                    <option value="">Select...</option>
                    {cfg.options.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                ) : (
                  <input
                    type="number"
                    name={key}
                    value={form[key]}
                    onChange={handleChange}
                    placeholder={cfg.placeholder}
                    min={cfg.min}
                    max={cfg.max}
                    step={cfg.step || 1}
                  />
                )}
              </div>
            )
          })}
        </div>

        {error && <p className={styles.error}>{error}</p>}

        <div className={styles.actions}>
          {step > 0 && (
            <button className={styles.back} onClick={() => setStep(s => s - 1)}>
              ← Back
            </button>
          )}
          {isLast ? (
            <button className={styles.submit} onClick={submit} disabled={loading}>
              {loading ? 'Analysing...' : 'Get Results →'}
            </button>
          ) : (
            <button className={styles.next} onClick={next}>Next →</button>
          )}
        </div>

      </div>
    </div>
  )
}
