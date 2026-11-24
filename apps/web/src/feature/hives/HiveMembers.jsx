import { MemberAvatar } from "../../components/domain/MemberAvatar.jsx";
import styles from "./HiveMembers.module.css";

export function HiveMembers({ children }) {
  return (
    <ul className={styles.enjambre} role="list">
      {children}
    </ul>
  );
}

export function HiveMemberItem({ member, detail, action, children }) {
  return (
    <li className={styles.abeja}>
      <span className={styles.avatar}>
        <MemberAvatar
          name={member.name}
          color={member.colorIndex ?? member.color}
          isOwner={member.isOwner}
          size="md"
        />
      </span>
      <span className={styles.nombre}>
        {member.name}
        {children}
      </span>
      <span className={styles.detalle}>{detail}</span>
      {action && <span className={styles.accion}>{action}</span>}
    </li>
  );
}
