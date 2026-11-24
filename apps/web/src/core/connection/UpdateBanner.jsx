import styles from "./ConnectionBanner.module.css";
import { useConnection } from "./useConnection.js";

export function UpdateBanner() {
  const { hasUpdate, applyUpdate } = useConnection();

  return (
    <div role="status">
      {hasUpdate && (
        <div className={styles.banner}>
          <p className={styles.text}>Hay una versión nueva de Panal.</p>
          <button type="button" className={styles.action} onClick={applyUpdate}>
            Actualizar
          </button>
        </div>
      )}
    </div>
  );
}
