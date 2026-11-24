import { useEffect, useRef } from "react";
import { DailyHoneycomb } from "../../components/domain/DailyHoneycomb.jsx";
import { HoneyDropIcon, ReserveJarIcon } from "../../components/domain/domainIcons.jsx";
import { WaxSeal } from "../../components/domain/WaxSeal.jsx";
import { ZumMascot } from "../../components/domain/ZumMascot.jsx";
import { Button } from "../../components/ui/Button.jsx";
import { FormAlert, TextField } from "../../components/ui/Form.jsx";
import { getHexagonPoints } from "../../components/ui/hexagon.js";
import { formatDrops } from "../../lib/formatters.js";
import styles from "./OnboardingPage.module.css";
import { useOnboarding } from "./useOnboarding.js";

const STEP_WIDTH = 32;

const STEP_TITLES = ["¿De qué tamaño es tu panal?", "Tu primera celda", "Llénala"];

const GOAL_OPTIONS = [
  { goal: 3, name: "Tranquilo", detail: "Tres celdas al día" },
  { goal: 5, name: "Constante", detail: "Cinco celdas al día" },
  { goal: 7, name: "Intenso", detail: "Siete celdas al día" },
];

const SUGGESTIONS = [
  "Tomar agua",
  "Leer 10 minutos",
  "Ordenar el escritorio",
  "Caminar 15 minutos",
];

export function OnboardingPage() {
  const onboarding = useOnboarding();
  const titleRef = useRef(null);
  const previousStep = useRef(onboarding.step);
  const stepTitle = STEP_TITLES[onboarding.step - 1];

  useEffect(() => {
    document.title = `${stepTitle} · Panal`;
  }, [stepTitle]);

  useEffect(() => {
    if (previousStep.current !== onboarding.step) titleRef.current?.focus();
    previousStep.current = onboarding.step;
  }, [onboarding.step]);

  return (
    <main id="contenido" className={styles.primerVuelo} tabIndex={-1}>
      <header className={styles.cabeza}>
        <ZumMascot
          className={styles.zum}
          mood={onboarding.cellId ? "celebrando" : "animando"}
          sizes="120px"
        />
        <div className={styles.pasos}>
          <p className="solo-lectores">{`Paso ${onboarding.step} de ${STEP_TITLES.length}`}</p>
          <svg
            width={STEP_WIDTH * STEP_TITLES.length}
            height="28"
            viewBox={`0 0 ${STEP_WIDTH * STEP_TITLES.length} 28`}
            aria-hidden="true"
          >
            {STEP_TITLES.map((_, index) => (
              <polygon
                key={index}
                className={styles.paso}
                data-hecho={index < onboarding.step ? "" : undefined}
                points={getHexagonPoints(12)}
                transform={`translate(${STEP_WIDTH / 2 + index * STEP_WIDTH} 14)`}
              />
            ))}
          </svg>
          <h1 ref={titleRef} className={styles.titulo} tabIndex={-1}>
            {stepTitle}
          </h1>
        </div>
      </header>

      <FormAlert message={onboarding.errorMessage} />

      {onboarding.step === 1 && <ChooseGoalStep onboarding={onboarding} />}
      {onboarding.step === 2 && <CreateFirstCellStep onboarding={onboarding} />}
      {onboarding.step === 3 && <FillFirstCellStep onboarding={onboarding} />}
    </main>
  );
}

function ChooseGoalStep({ onboarding }) {
  return (
    <form
      className={styles.paso1}
      onSubmit={(event) => {
        event.preventDefault();
        onboarding.confirmGoal();
      }}
    >
      <fieldset className={styles.tamanos} disabled={!onboarding.isOnline || onboarding.isSaving}>
        <legend className="solo-lectores">Tamaño del panal de cada día</legend>
        {GOAL_OPTIONS.map((option) => (
          <label key={option.goal} className={styles.tamano}>
            <input
              type="radio"
              name="dailyGoal"
              value={option.goal}
              checked={onboarding.dailyGoal === option.goal}
              onChange={() => onboarding.selectGoal(option.goal)}
            />
            <DailyHoneycomb className={styles.miniatura} filled={0} goal={option.goal} />
            <span className={styles.nombreDeTamano}>{option.name}</span>
            <span className={styles.detalleDeTamano}>{option.detail}</span>
          </label>
        ))}
      </fieldset>
      <p className={styles.nota}>Puedes cambiarlo cuando quieras desde Mi vuelo.</p>
      <Button
        type="submit"
        className={styles.seguir}
        disabled={onboarding.isSaving || !onboarding.isOnline}
      >
        {onboarding.isSaving ? "Guardando…" : "Seguir"}
      </Button>
    </form>
  );
}

function CreateFirstCellStep({ onboarding }) {
  const { activityForm } = onboarding;

  return (
    <form className={styles.paso2} onSubmit={activityForm.handleSubmit} noValidate>
      <TextField
        label="¿Qué vas a hacer cada día?"
        name="title"
        placeholder="Por ejemplo, tomar agua"
        autoComplete="off"
        required
        value={activityForm.values.title}
        error={activityForm.errors.title}
        onChange={(event) =>
          activityForm.setFieldValue("title", event?.target ? event.target.value : event)
        }
        onBlur={activityForm.handleBlur}
      />
      <div className={styles.sugerencias}>
        <p className={styles.nota}>O elige una:</p>
        <ul role="list">
          {SUGGESTIONS.map((suggestion) => (
            <li key={suggestion}>
              <Button
                variant="secondary"
                size="sm"
                disabled={!onboarding.isOnline}
                onClick={() => activityForm.setFieldValue("title", suggestion)}
              >
                {suggestion}
              </Button>
            </li>
          ))}
        </ul>
      </div>
      <div className={styles.acciones}>
        <Button variant="ghost" onClick={onboarding.goBack}>
          Volver
        </Button>
        <Button type="submit" disabled={onboarding.isSaving || !onboarding.isOnline}>
          {onboarding.isSaving ? "Creando…" : "Crear celda"}
        </Button>
      </div>
    </form>
  );
}

function FillFirstCellStep({ onboarding }) {
  const isFilled = Boolean(onboarding.cellId);

  return (
    <div className={styles.paso3}>
      <label className={styles.celdaGrande} data-llena={isFilled ? "" : undefined}>
        <input
          type="checkbox"
          checked={isFilled}
          disabled={isFilled || onboarding.isSaving || !onboarding.isOnline}
          onChange={onboarding.fillFirstCell}
          aria-describedby="ayuda-primera-celda"
        />
        <svg viewBox="-60 -60 120 120" aria-hidden="true">
          <polygon points={getHexagonPoints(54)} />
          <path d="M-20 0 l14 15 l28 -30" pathLength="1" />
        </svg>
        <span className={styles.tituloDeCelda}>{onboarding.title}</span>
      </label>
      <p id="ayuda-primera-celda" className={styles.nota}>
        {isFilled
          ? "¡Primera celda llena!"
          : "Tócala cuando la cumplas. Si ya lo hiciste hoy, también vale."}
      </p>

      <div role="status" className={styles.ganado}>
        {isFilled && (
          <>
            <span className={styles.ficha}>
              <HoneyDropIcon />
              {`+${formatDrops(onboarding.drops)} de miel`}
            </span>
            <div className={styles.sello}>
              <WaxSeal id="primera-celda" earned size={64} />
              <p>Sello de cera: Primera celda</p>
            </div>
            <p className={styles.regalo}>
              <ReserveJarIcon /> Te regalamos una reserva de miel: protege tu racha un día.
            </p>
          </>
        )}
      </div>

      {isFilled && (
        <Button
          onClick={onboarding.finishOnboarding}
          disabled={onboarding.isSaving || !onboarding.isOnline}
          className={styles.seguir}
        >
          {onboarding.isSaving ? "Abriendo tu panal…" : "Ir a mi panal"}
        </Button>
      )}
    </div>
  );
}
