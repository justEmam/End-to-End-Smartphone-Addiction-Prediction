import styles from './PredictionCard.module.css'

const COLORS = {
  Mild:     'var(--success)',
  Moderate: 'var(--warning)',
  Severe:   'var(--danger)',
}

const DESCRIPTIONS = {
  Mild:     'Your phone usage appears to be within a manageable range. A few habits to watch but nothing alarming.',
  Moderate: 'You show signs of problematic usage. Consider setting daily screen time limits.',
  Severe:   'Your usage patterns suggest high addiction risk. A digital detox may be worth considering.',
}

export default function PredictionCard({ prediction, probabilities }) {
  const color = COLORS[prediction] || 'var(--accent)'

  return (
    <div className={styles.card} style={{ '--level': color }}>
      <div className={styles.top}>
        <span className={styles.label}>Addiction level</span>
        <div className={styles.result}>{prediction}</div>
        <p className={styles.desc}>{DESCRIPTIONS[prediction]}</p>
      </div>

      <div className={styles.bars}>
        {Object.entries(probabilities).map(([label, prob]) => (
          <div className={styles.row} key={label}>
            <span className={styles.barLabel}>{label}</span>
            <div className={styles.track}>
              <div
                className={styles.fill}
                style={{
                  width:      `${(prob * 100).toFixed(1)}%`,
                  background: COLORS[label] || 'var(--accent)',
                  opacity:    label === prediction ? 1 : 0.3,
                }}
              />
            </div>
            <span className={styles.pct}>{(prob * 100).toFixed(1)}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}
