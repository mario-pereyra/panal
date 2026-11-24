import { DAYS_PER_MILESTONE, FRAMES_PER_HIVE, MAX_RESERVES } from "@panal/motor";
import { DailyHoneycomb } from "../../components/domain/DailyHoneycomb.jsx";
import { HoneyDropIcon } from "../../components/domain/domainIcons.jsx";
import { RankLadder } from "../../components/domain/RankLadder.jsx";
import { WaxSeal } from "../../components/domain/WaxSeal.jsx";
import { ZumMascot } from "../../components/domain/ZumMascot.jsx";
import { Button } from "../../components/ui/Button.jsx";
import { Dialog, useCloseDialog } from "../../components/ui/Dialog.jsx";
import { formatDays, formatDrops } from "../../lib/formatters.js";
import styles from "./CelebrationModal.module.css";
import { useCelebrations } from "./useCelebrations.js";

const FRAME_ORDINALS = ["primer", "segundo", "tercer", "cuarto", "quinto"];
const NUMBER_WORDS = ["cero", "una", "dos", "tres", "cuatro", "cinco", "seis", "siete"];

function getCelebrationCopy(item) {
  switch (item.type) {
    case "hive-closed":
      return {
        title: "¡Enjambrazón!",
        detail: `${item.hiveName} llegó al cien por cien. Todo el enjambre suma.`,
        chips: [`+${formatDrops(item.drops)} de miel`],
      };
    case "rank":
      return {
        title: `¡Nuevo oficio: ${item.name}!`,
        detail: item.nextName
          ? `${item.remainingDrops === 1 ? "Falta" : "Faltan"} ${formatDrops(item.remainingDrops)} para ${item.nextName}.`
          : "Llegaste a lo más alto de la escalera.",
        chips: [`Nivel ${item.level}`],
      };
    case "frame":
      return {
        title: `¡La colmena cerró su ${FRAME_ORDINALS[item.frame - 1] ?? item.frame} cuadro!`,
        detail: `${item.hiveName}: cuadro ${item.frame} de ${FRAMES_PER_HIVE}.`,
        chips: [`+${formatDrops(item.drops)} de miel`],
      };
    case "badge":
      return {
        title: `Nuevo sello de cera: ${item.name}`,
        detail: "Ya está en tu colección, en Mi vuelo.",
        chips: [],
      };
    case "streak":
      return {
        title: `¡Racha de vuelo: ${formatDays(item.days)}!`,
        detail: `Cada ${NUMBER_WORDS[DAYS_PER_MILESTONE] ?? DAYS_PER_MILESTONE} días tu racha suma una reserva de miel, hasta ${NUMBER_WORDS[MAX_RESERVES] ?? MAX_RESERVES}.`,
        chips: [`+${formatDrops(item.drops)} de miel`],
      };
    case "daily-close":
      return {
        title: "¡Panal cerrado!",
        detail: "Zum selló el panal de hoy.",
        chips: [
          `+${formatDrops(item.drops)} de miel`,
          ...(item.streak ? [`Racha de vuelo: ${formatDays(item.streak)}`] : []),
        ],
      };
    default:
      return { title: "¡Bien hecho!", detail: "", chips: [] };
  }
}

export function CelebrationModal() {
  const { celebration, celebrations, goal, closeCelebration } = useCelebrations();
  if (!celebration) return null;

  const list = celebrations?.length ? celebrations : [celebration];
  const [primary, ...others] = list;

  return (
    <Dialog title={getCelebrationCopy(primary).title} onClose={closeCelebration} closeOnBackdrop>
      <div className={styles.celebration}>
        <ZumMascot className={styles.zum} mood="celebrando" sizes="160px" />
        <AchievementItem item={primary} goal={goal} primary />
        {others.map((item) => (
          <AchievementItem key={item.key} item={item} goal={goal} />
        ))}
        <ContinueButton />
      </div>
    </Dialog>
  );
}

function ContinueButton() {
  const closeDialog = useCloseDialog();
  return (
    <Button className={styles.continueButton} onClick={closeDialog} autoFocus>
      Seguir
    </Button>
  );
}

function AchievementItem({ item, goal, primary = false }) {
  const copy = getCelebrationCopy(item);
  return (
    <section className={styles.achievement} data-primary={primary ? "" : undefined}>
      <AchievementIllustration item={item} goal={goal} />
      <div className={styles.texts}>
        {!primary && <h3 className={styles.secondaryTitle}>{copy.title}</h3>}
        {copy.chips.length > 0 && (
          <p className={styles.badges}>
            {copy.chips.map((chip) => (
              <span key={chip} className={styles.badgeChip}>
                <HoneyDropIcon />
                {chip}
              </span>
            ))}
          </p>
        )}
        {copy.detail && <p className={styles.detail}>{copy.detail}</p>}
      </div>
    </section>
  );
}

function AchievementIllustration({ item, goal }) {
  switch (item.type) {
    case "daily-close":
      return <DailyHoneycomb className={styles.illustration} filled={goal} goal={goal} closed />;
    case "rank":
      return <RankLadder currentLevel={item.level} />;
    case "badge":
      return <WaxSeal id={item.id} earned size={88} />;
    default:
      return null;
  }
}
