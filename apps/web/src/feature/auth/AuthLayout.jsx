import { useEffect } from "react";
import { Link } from "react-router";
import { HexCellIcon } from "../../components/domain/domainIcons.jsx";
import { ZumMascot } from "../../components/domain/ZumMascot.jsx";
import styles from "./AuthLayout.module.css";

export function AuthLayout({ title, mood, tagline, children }) {
  useEffect(() => {
    document.title = title ? `${title} · Panal` : "Panal";
  }, [title]);

  return (
    <div className={styles.acceso}>
      <a className="saltar" href="#contenido">
        Saltar al formulario
      </a>
      <aside className={styles.miel}>
        <Link to="/entrar" className={styles.marca}>
          <HexCellIcon />
          <span>Panal</span>
        </Link>
        <ZumMascot
          className={styles.zum}
          mood={mood}
          withBackground
          priority
          sizes="(min-width: 900px) 280px, 140px"
        />
        <div className={styles.lema}>{tagline}</div>
      </aside>
      <main id="contenido" className={styles.papel} tabIndex={-1}>
        <div className={styles.formulario}>
          <h1 className={styles.titulo}>{title}</h1>
          {children}
        </div>
      </main>
    </div>
  );
}
