import Image from 'next/image'
import styles from './page.module.css'

export default function Home() {
  return (
    <main >
      <div className={styles.base}>
        <div className={styles.baseNav}>
          <div className={styles.child}>Alguna descripcion de empresa</div>
          <div className={styles.child}>Two</div>
          <div className={styles.child}>Three</div>
        </div>
        <div className={styles.baseComponent}>
          <div className={styles.child}>Four</div>
          <div className={styles.child}>Five</div>
          <div className={styles.child}>Six</div>
        </div>
      </div>
    </main>
  )
}
