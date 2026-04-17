import styles from "./page.module.css";

export default function Home() {
  return (
    <main className="container animate-fade-in">
      <div className={`glass-panel ${styles.heroCard}`}>
        <h1 className="heading-1">MeetLove</h1>
        <p className="text-subtitle">
          Discover the psychological blueprint of your closest relationships. Understand, connect, and resolve conflicts seamlessly using MBTI and behavioral profiling.
        </p>
        <div className={styles.buttonGroup}>
          <button className="glass-button">Find My MBTI</button>
          <button className="glass-button" style={{ background: 'var(--card-bg)', color: 'var(--text-primary)', border: '1px solid var(--card-border)' }}>
            I Already Know It
          </button>
        </div>
      </div>
    </main>
  );
}
