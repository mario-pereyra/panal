import { OfflineIcon } from "../../components/ui/icons.jsx";
import styles from "./ConnectionBanner.module.css";
import { useIsOnline } from "./useConnection.js";

export function OfflineBanner() {
  const isOnline = useIsOnline();

  return (
    <div role="status">
      {!isOnline && (
        <div className={styles.banner} data-tone="wing">
          <OfflineIcon />
          <p className={styles.text}>
            Sin conexión. Ves lo último que guardaste; lo que necesite red espera a que vuelva la
            señal.
          </p>
        </div>
      )}
    </div>
  );
}
