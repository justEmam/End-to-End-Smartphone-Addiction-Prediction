import { useNavigate } from 'react-router-dom'
import styles from './Home.module.css'

export default function Home() {
  const navigate = useNavigate()

  return (
    <div className={styles.wrapper}>
      <div className={styles.grid} />

      <main className={styles.hero}>
        <span className={styles.badge}>AI-Powered Assessment</span>

        <h1 className={styles.title}>
          How addicted are you<br />
          <em>to your phone?</em>
        </h1>

        <p className={styles.subtitle}>
          Answer 12 questions about your daily screen habits. Our model will
          predict your addiction level and explain exactly what's driving it.
        </p>

        <button className={styles.cta} onClick={() => navigate('/quiz')}>
          Start Quiz <span className={styles.arrow}>→</span>
        </button>

        <p className={styles.note}>2 minutes · No account needed</p>
      </main>

      <footer className={styles.footer}>
        Built with scikit-learn · Django REST · React
      </footer>
    </div>
  )
}
