import { useEffect } from "react";
import { Navigate, useParams } from "react-router";
import { ZumScreen } from "../../components/domain/ZumScreen.jsx";
import { Button } from "../../components/ui/Button.jsx";
import { FormAlert } from "../../components/ui/Form.jsx";
import { formatCount, pluralize } from "../../lib/formatters.js";
import styles from "./JoinHivePage.module.css";
import { useJoinHive } from "./useJoinHive.js";

export function JoinHivePage() {
  const { codigo } = useParams();
  const {
    user,
    isOnline,
    isLoading,
    unavailableReason,
    invitation,
    alreadyMember,
    joinHive,
    isJoining,
    joinErrorMessage,
  } = useJoinHive(codigo);

  useEffect(() => {
    document.title = "Unirme a una colmena · Panal";
  }, []);

  if (alreadyMember && invitation?.hive?.id) {
    return <Navigate to={`/colmenas/${invitation.hive.id}`} replace />;
  }

  if (isLoading) {
    return (
      <div className={styles.unirme}>
        <ZumScreen mood="feliz" title="Unirme a una colmena">
          <p role="status">Comprobando el enlace…</p>
        </ZumScreen>
      </div>
    );
  }

  if (unavailableReason || !invitation) {
    return (
      <div className={styles.unirme}>
        <ZumScreen
          mood="feliz"
          title="Invitación no disponible"
          description={unavailableReason}
          action={
            <Button to={user ? "/" : "/entrar"} variant="secondary">
              {user ? "Ir a Hoy" : "Entrar al panal"}
            </Button>
          }
        />
      </div>
    );
  }

  const memberCount = invitation.hive?.memberCount ?? invitation.hive?.members?.length ?? 1;
  const titleText = invitation.inviter?.name
    ? `${invitation.inviter.name} te invita a la colmena ${invitation.hive.name}`
    : `Te invitaron a la colmena ${invitation.hive.name}`;
  const descriptionText = `Ya ${pluralize(memberCount, "hay", "son")} ${formatCount(memberCount, "abeja", "abejas")} en el enjambre.`;

  return (
    <div className={styles.unirme}>
      <ZumScreen mood="feliz" title={titleText} description={descriptionText}>
        <FormAlert message={joinErrorMessage} />
        {user ? (
          <Button onClick={joinHive} disabled={isJoining || !isOnline}>
            {isJoining ? "Uniéndote…" : "Unirme"}
          </Button>
        ) : (
          <div className={styles.botones}>
            <Button to="/crear" disabled={!isOnline}>
              Crear mi panal
            </Button>
            <Button to="/entrar" variant="secondary" disabled={!isOnline}>
              Ya tengo un panal
            </Button>
          </div>
        )}
      </ZumScreen>
    </div>
  );
}
