type ConsentScreenProps = {
  onAccept: () => void;
  onViewPrivacyPolicy?: () => void;
};

export function ConsentScreen({
  onAccept,
  onViewPrivacyPolicy
}: ConsentScreenProps) {
  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Data Protection & Consent</h1>

        <p style={styles.text}>
          GenoGuard processes genetic sequence data to perform mutation analysis.
          This data may be considered sensitive under the General Data Protection
          Regulation (GDPR).
        </p>

        <ul style={styles.list}>
          <li>Your data is used only for analysis within this platform</li>
          <li>No data is shared with third parties</li>
          <li>You may export or delete your data at any time</li>
          <li>Demo mode does not permanently store data</li>
        </ul>

        <p style={styles.text}>
          By clicking <strong>“I Agree”</strong>, you explicitly consent to the
          processing of your data for research and educational purposes.
        </p>

        <div style={styles.buttonGroup}>
          <button onClick={onAccept} style={styles.primaryButton}>
            I Agree
          </button>

          {onViewPrivacyPolicy && (
            <button
              onClick={onViewPrivacyPolicy}
              style={styles.secondaryButton}
            >
              View Privacy Policy
            </button>
          )}
        </div>

        <p style={styles.disclaimer}>
          This platform does not provide medical diagnoses and should not be used
          as a substitute for professional medical advice.
        </p>
      </div>
    </div>
  );
}

/* ===============================
   STYLES
=============================== */

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#020617',
    padding: '1rem'
  },
  card: {
    maxWidth: '520px',
    background: '#020617',
    border: '1px solid #1e293b',
    borderRadius: '12px',
    padding: '2rem',
    color: '#e5e7eb',
    boxShadow: '0 20px 40px rgba(0,0,0,0.5)'
  },
  title: {
    marginBottom: '1rem',
    textAlign: 'center'
  },
  text: {
    fontSize: '0.95rem',
    color: '#cbd5f5',
    marginBottom: '1rem'
  },
  list: {
    fontSize: '0.9rem',
    color: '#94a3b8',
    marginBottom: '1.5rem',
    paddingLeft: '1.25rem'
  },
  buttonGroup: {
    display: 'flex',
    gap: '0.75rem',
    justifyContent: 'center'
  },
  primaryButton: {
    padding: '0.6rem 1.2rem',
    borderRadius: '6px',
    border: 'none',
    background: '#22c55e',
    color: '#022c22',
    cursor: 'pointer',
    fontWeight: 600
  },
  secondaryButton: {
    padding: '0.6rem 1.2rem',
    borderRadius: '6px',
    border: '1px solid #334155',
    background: 'transparent',
    color: '#e5e7eb',
    cursor: 'pointer'
  },
  disclaimer: {
    marginTop: '1.5rem',
    fontSize: '0.75rem',
    color: '#64748b',
    textAlign: 'center'
  }
};
