import { useLocation, useNavigate } from 'react-router-dom'
import PredictionCard from '../components/PredictionCard'
import ShapChart      from '../components/ShapChart'
import styles from './Result.module.css'

export default function Result() {
  const { state }  = useLocation()
  const navigate   = useNavigate()

  if (!state) {
    return (
      <div className={styles.empty}>
        <p>No result found.</p>
        <button onClick={() => navigate('/')}>Go home</button>
      </div>
    )
  }

  const { prediction, probabilities, shap_values } = state

  return (
    <div className={styles.wrapper}>
      <div className={styles.inner}>

        <div className={styles.header}>
          <span className={styles.badge}>Your result</span>
          <h1 className={styles.title}>Analysis complete</h1>
          <p className={styles.subtitle}>
            Here's what the model found based on your usage patterns.
          </p>
        </div>

        <PredictionCard prediction={prediction} probabilities={probabilities} />

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>What's driving this?</h2>
          <p className={styles.sectionSub}>
            Each bar shows how much a feature pushed the prediction toward your result.
            Red raises risk, green lowers it.
          </p>
          <ShapChart shapValues={shap_values} />
        </section>

        <button className={styles.restart} onClick={() => navigate('/')}>
          ← Take it again
        </button>

      </div>
    </div>
  )
}
