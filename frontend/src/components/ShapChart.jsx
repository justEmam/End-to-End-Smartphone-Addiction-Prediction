import styles from './ShapChart.module.css'

export default function ShapChart({ shapValues }) {
  const top10  = shapValues.slice(0, 10)
  const maxAbs = Math.max(...top10.map(d => Math.abs(d.shap_value)))

  return (
    <div className={styles.chart}>
      {top10.map(({ feature, shap_value }) => {
        const pct      = (Math.abs(shap_value) / maxAbs) * 50  // 50% = half track
        const positive = shap_value >= 0

        return (
          <div className={styles.row} key={feature}>
            <span className={styles.feature}>{feature.replace(/_/g, ' ')}</span>
            <div className={styles.track}>
              <div className={styles.midline} />
              <div
                className={styles.bar}
                style={{
                  width:      `${pct}%`,
                  left:       positive ? '50%' : `${50 - pct}%`,
                  background: positive ? 'var(--danger)' : 'var(--success)',
                }}
              />
            </div>
            <span
              className={styles.value}
              style={{ color: positive ? 'var(--danger)' : 'var(--success)' }}
            >
              {positive ? '+' : ''}{shap_value.toFixed(3)}
            </span>
          </div>
        )
      })}

      <div className={styles.legend}>
        <span style={{ color: 'var(--success)' }}>▬ lowers risk</span>
        <span style={{ color: 'var(--danger)'  }}>▬ raises risk</span>
      </div>
    </div>
  )
}
