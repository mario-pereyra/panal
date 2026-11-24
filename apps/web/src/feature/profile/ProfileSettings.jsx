import { MAX_PAUSE_DAYS } from "@panal/contratos";
import { DAILY_SOFT_CAP, DAYS_PER_MILESTONE, DROPS } from "@panal/motor";
import { useState } from "react";
import { Button } from "../../components/ui/Button.jsx";
import { RadioCardGroup, SelectField, SwitchField, TextField } from "../../components/ui/Form.jsx";
import { getDeviceTimeZone } from "../../lib/device.js";
import { formatCells, formatShortDate, WEEKDAY_FULL_LABELS } from "../../lib/formatters.js";
import styles from "./ProfilePage.module.css";

const GOAL_CARD_OPTIONS = [
  { value: 3, title: "3 celdas", description: "Para días con poco tiempo" },
  { value: 5, title: "5 celdas", description: "El tamaño de siempre" },
  { value: 7, title: "7 celdas", description: "Para días de mucho vuelo" },
];

const REST_DAY_OPTIONS = [
  { value: "", label: "Ninguno" },
  ...WEEKDAY_FULL_LABELS.map((label, value) => ({ value, label })),
];

const DROPS_RULES_TABLE = [
  ["Llenar una celda recurrente", DROPS.recurring],
  ["Llenar una celda única", DROPS.once],
  ["Una única de prioridad alta", DROPS.onceHigh],
  ["Una única ya vencida", DROPS.onceOverdue],
  ["Cerrar el panal del día", DROPS.dailyClose],
  ["Cumplir la cuota semanal de una recurrente", DROPS.weeklyQuota],
  [`Cada ${DAYS_PER_MILESTONE} días de racha`, DROPS.streakMilestone],
  ["Aportar a un cuadro de colmena", DROPS.hiveFrame],
  ["Cerrar una colmena con tu enjambre", DROPS.hiveClosed],
];

const BREAKDOWN_LABELS = {
  cells: "Celdas llenas",
  closures: "Panales cerrados",
  milestones: "Hitos de racha",
  quotas: "Cuotas semanales",
  hives: "Colmenas",
};

function formatGoalChangeConfirmation(chosenGoal, currentGoal) {
  if (chosenGoal === currentGoal) return "Tu panal queda como estaba";
  return `Desde mañana tu panal tendrá ${formatCells(chosenGoal)}.`;
}

function getAvailableTimeZones(currentZone) {
  const zones = Intl.supportedValuesOf?.("timeZone") ?? [];
  return zones.includes(currentZone) ? zones : [currentZone, ...zones];
}

const formatZoneLabel = (zone) => zone.replaceAll("_", " ");

export function ProfileSettings({ profile }) {
  const { settings } = profile;
  if (!settings) return null;
  const isDisabled = !profile.isOnline || profile.isSaving;
  const isMotionReduced = profile.reduceMotion === true || profile.reduceMotion === "reducido";

  return (
    <section className={styles.tarjeta} aria-labelledby="titulo-ajustes">
      <h2 id="titulo-ajustes" className={styles.titulo}>
        Ajustes
      </h2>
      {!profile.isOnline && (
        <p className={styles.nota} role="status">
          Sin conexión: los ajustes se pueden cambiar cuando vuelva la señal.
        </p>
      )}

      <div className={styles.ajustes}>
        <div className={styles.ajuste}>
          <fieldset disabled={isDisabled} className={styles.sinMarco}>
            <RadioCardGroup
              label="Tamaño del panal"
              name="dailyGoal"
              options={GOAL_CARD_OPTIONS}
              value={settings.selectedGoal}
              onChange={(dailyGoal) =>
                profile.saveSetting(
                  { dailyGoal: Number(dailyGoal) },
                  formatGoalChangeConfirmation(Number(dailyGoal), settings.dailyGoal),
                )
              }
            />
          </fieldset>
          {settings.nextGoal && (
            <p className={styles.nota}>
              {`Hoy tu panal tiene ${settings.dailyGoal} celdas. Desde mañana tu panal tendrá ${formatCells(settings.nextGoal)}.`}
            </p>
          )}
        </div>

        <div className={styles.ajuste}>
          <SelectField
            label="Día sin flores"
            hint="Un día de descanso fijo cada semana: no rompe la racha ni pide celdas."
            value={settings.restDay ?? ""}
            disabled={isDisabled}
            onChange={(event) => {
              const rawValue = event?.target ? event.target.value : event;
              profile.saveSetting({
                restDay: rawValue === "" ? null : Number(rawValue),
              });
            }}
            options={REST_DAY_OPTIONS}
          />
        </div>

        {profile.pauseState && (
          <PausePeriodSetting
            pauseState={profile.pauseState}
            saveSetting={profile.saveSetting}
            disabled={isDisabled}
          />
        )}

        <TimeZoneSetting
          currentZone={settings.timeZone}
          saveSetting={profile.saveSetting}
          disabled={isDisabled}
        />

        <div className={styles.ajuste}>
          <SwitchField
            label="Reducir animaciones"
            description="Quita las animaciones de Zum y de las celdas en este dispositivo."
            checked={isMotionReduced}
            onChange={(checked) => {
              const nextValue = checked?.target ? checked.target.checked : Boolean(checked);
              profile.setReduceMotion(nextValue);
            }}
          />
        </div>
      </div>

      <details className={styles.comoSeGanan}>
        <summary>Cómo se ganan las gotas</summary>
        <table>
          <caption className="solo-lectores">Gotas que vale cada logro</caption>
          <tbody>
            {DROPS_RULES_TABLE.map(([achievement, drops]) => (
              <tr key={achievement}>
                <th scope="row">{achievement}</th>
                <td>{`+${drops}`}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {profile.totals?.drops?.breakdown && (
          <>
            <h3 className={styles.subtitulo}>Tus gotas, de dónde vienen</h3>
            <table>
              <caption className="solo-lectores">Tus gotas por origen</caption>
              <tbody>
                {Object.entries(profile.totals.drops.breakdown).map(([sourceKey, drops]) => (
                  <tr key={sourceKey}>
                    <th scope="row">{BREAKDOWN_LABELS[sourceKey] ?? sourceKey}</th>
                    <td>{drops}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
        <p className={styles.nota}>
          {`Pasadas las primeras ${DAILY_SOFT_CAP} celdas del día, cada una vale ${DROPS.afterCap} gotas: el panal premia la constancia, no el atracón.`}
        </p>
      </details>

      <div className={styles.acciones}>
        {profile.canInstall && (
          <Button variant="secondary" onClick={profile.installApp}>
            Instalar Panal
          </Button>
        )}
        {profile.isInstalled && (
          <p className={styles.nota}>Ya tienes Panal instalado en este dispositivo.</p>
        )}
        <Button variant="danger" onClick={profile.logout} disabled={profile.isLoggingOut}>
          {profile.isLoggingOut ? "Cerrando sesión…" : "Cerrar sesión"}
        </Button>
      </div>
    </section>
  );
}

function PausePeriodSetting({ pauseState, saveSetting, disabled }) {
  const { today, activeUntil } = pauseState;
  const [choosingDates, setChoosingDates] = useState(false);
  const [untilDate, setUntilDate] = useState(pauseState.proposedUntil);

  const startCustomPause = async (event) => {
    event.preventDefault();
    const ok = await saveSetting(
      { pausePeriod: { from: today, to: untilDate } },
      `Invernada hasta el ${formatShortDate(untilDate)}. Zum cuida tu racha.`,
    );
    if (ok) setChoosingDates(false);
  };

  return (
    <div className={styles.ajuste}>
      <SwitchField
        label="Invernada"
        description={
          activeUntil
            ? `En invernada hasta el ${formatShortDate(activeUntil)}.`
            : `Una pausa de hasta ${MAX_PAUSE_DAYS} días: la racha te espera congelada.`
        }
        checked={Boolean(activeUntil) || choosingDates}
        disabled={disabled}
        onChange={(checked) => {
          const isTurnedOn = checked?.target ? checked.target.checked : Boolean(checked);
          if (isTurnedOn) setChoosingDates(true);
          else if (activeUntil) {
            saveSetting({ pausePeriod: null }, "Invernada terminada: qué bueno verte de vuelta.");
          } else {
            setChoosingDates(false);
          }
        }}
      />
      {choosingDates && !activeUntil && (
        <form className={styles.invernada} onSubmit={startCustomPause}>
          <TextField
            label="Hasta"
            name="pauseUntil"
            type="date"
            min={today}
            max={pauseState.maxUntil}
            value={untilDate}
            onChange={(event) => setUntilDate(event?.target ? event.target.value : event)}
            required
          />
          <Button type="submit" size="sm" disabled={disabled || !untilDate}>
            Empezar invernada
          </Button>
        </form>
      )}
    </div>
  );
}

function TimeZoneSetting({ currentZone, saveSetting, disabled }) {
  const deviceZone = getDeviceTimeZone();
  const [zones] = useState(() => getAvailableTimeZones(currentZone));

  return (
    <div className={styles.ajuste}>
      <SelectField
        label="Zona horaria"
        hint="El día de Panal cambia a las 3 de la madrugada de esta zona."
        value={currentZone}
        disabled={disabled}
        onChange={(event) =>
          saveSetting({
            timeZone: event?.target ? event.target.value : event,
          })
        }
        options={zones.map((zone) => ({
          value: zone,
          label: formatZoneLabel(zone),
        }))}
      />
      {deviceZone && deviceZone !== currentZone && (
        <Button
          variant="ghost"
          size="sm"
          disabled={disabled}
          onClick={() => saveSetting({ timeZone: deviceZone })}
        >
          {`Usar la de este dispositivo (${formatZoneLabel(deviceZone)})`}
        </Button>
      )}
    </div>
  );
}
