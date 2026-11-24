import { useRef, useState } from "react";
import { useParams } from "react-router";
import { ZumMascot } from "../../components/domain/ZumMascot.jsx";
import { Button } from "../../components/ui/Button.jsx";
import { Dialog } from "../../components/ui/Dialog.jsx";
import { FormAlert } from "../../components/ui/Form.jsx";
import { CopyIcon, ShareIcon } from "../../components/ui/icons.jsx";
import { useModalRoute } from "../../components/ui/useModalRoute.js";
import { formatShortDate } from "../../lib/formatters.js";
import { HiveMemberItem, HiveMembers } from "./HiveMembers.jsx";
import styles from "./InviteModal.module.css";
import { useInvite } from "./useHiveDetail.js";

export function InviteModal() {
  const { id } = useParams();
  const { closeModal } = useModalRoute();
  const {
    invitation,
    expirationLabel,
    isLoading,
    errorMessage,
    hive,
    isOnline,
    regenerate,
    isCreating,
  } = useInvite(id);
  const inputRef = useRef(null);
  const [copiedUrl, setCopiedUrl] = useState("");

  const handleClose = () => closeModal(`/colmenas/${id}`);

  const inviteUrl = invitation ? `${window.location.origin}/unirme/${invitation.code}` : "";
  const canShare = typeof navigator.share === "function";

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(inviteUrl);
      setCopiedUrl(inviteUrl);
    } catch {
      inputRef.current?.select();
    }
  };

  const shareLink = () =>
    navigator
      .share({
        title: `Únete a ${hive?.name ?? "mi colmena"} en Panal`,
        url: inviteUrl,
      })
      .catch((reason) => {
        if (reason?.name !== "AbortError") copyLink();
      });

  return (
    <Dialog
      title="Invitar al enjambre"
      subtitle={hive ? `Quien abra este enlace podrá unirse a ${hive.name}.` : undefined}
      onClose={handleClose}
      closeOnBackdrop
    >
      <div className={styles.invitacion}>
        <ZumMascot className={styles.zumChica} mood="feliz" sizes="96px" />
        <FormAlert message={errorMessage} />
        {isLoading || isCreating || !invitation ? (
          <p className={styles.nota} role="status">
            Creando el enlace…
          </p>
        ) : (
          <>
            <label className={styles.enlace}>
              <span className="solo-lectores">Enlace de invitación</span>
              <input
                ref={inputRef}
                value={inviteUrl}
                readOnly
                onFocus={(event) => event.target.select()}
              />
            </label>
            <div className={styles.botones}>
              <Button onClick={copyLink} disabled={!isOnline} aria-live="polite">
                <CopyIcon className={styles.iconoDeBoton} />
                {copiedUrl === inviteUrl ? "Copiado" : "Copiar"}
              </Button>
              {canShare && (
                <Button variant="secondary" onClick={shareLink} disabled={!isOnline}>
                  <ShareIcon className={styles.iconoDeBoton} />
                  Compartir
                </Button>
              )}
            </div>
            <p className={styles.vence}>
              {expirationLabel && `${expirationLabel}. `}
              <button
                type="button"
                className={styles.enlaceDeTexto}
                onClick={regenerate}
                disabled={isCreating || !isOnline}
              >
                Anular y crear otro
              </button>
            </p>
          </>
        )}
        {hive && (
          <section aria-labelledby="ya-en-el-enjambre">
            <h3 id="ya-en-el-enjambre" className={styles.subtitulo}>
              Ya en el enjambre
            </h3>
            <HiveMembers>
              {hive.members.map((member) => (
                <HiveMemberItem
                  key={member.id}
                  member={member}
                  detail={member.joinedDay ? `desde el ${formatShortDate(member.joinedDay)}` : ""}
                />
              ))}
            </HiveMembers>
          </section>
        )}
      </div>
    </Dialog>
  );
}
