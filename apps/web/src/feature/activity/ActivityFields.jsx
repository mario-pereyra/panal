import { LAST_DAY_OF_MONTH, MAX_HIGH_PRIORITY, MAX_TIMES_PER_WEEK } from "@panal/contratos";
import { useCloseDialog } from "../../components/ui/Dialog.jsx";
import {
  ChipGroup,
  FormAlert,
  RadioCardGroup,
  SelectField,
  SwitchField,
  TextField,
} from "../../components/ui/Form.jsx";
import {
  formatDrops,
  formatRuleLabel,
  WEEKDAY_FULL_LABELS,
  WEEKDAY_SHORT_LABELS,
} from "../../lib/formatters.js";
import styles from "./ActivityModal.module.css";

const RULE_KIND_OPTIONS = [
  { value: "diaria", title: "Todos los días" },
  { value: "dias", title: "Ciertos días" },
  { value: "veces", title: "Veces por semana" },
  { value: "mes", title: "Día del mes" },
];

const WEEKDAY_CHIP_OPTIONS = WEEKDAY_SHORT_LABELS.map((label, value) => ({
  value,
  label,
  ariaLabel: WEEKDAY_FULL_LABELS[value],
}));

const TIMES_PER_WEEK_OPTIONS = Array.from({ length: MAX_TIMES_PER_WEEK }, (_, index) => ({
  value: index + 1,
  label: `${index + 1}`,
}));

const DAY_OF_MONTH_OPTIONS = Array.from({ length: LAST_DAY_OF_MONTH }, (_, index) => ({
  value: index + 1,
  label: `${index + 1}`,
}));

function describeRule(rule) {
  if (!rule) return "";
  switch (rule.kind) {
    case "diaria":
      return "Se repite todos los días.";
    case "dias":
      if (rule.days.length === 0) return "Elige al menos un día.";
      if (rule.days.length === 7) return "Se repite todos los días.";
      return `Se repite cada semana: ${formatRuleLabel(rule)}.`;
    case "veces":
      return `Se repite ${formatRuleLabel(rule)}, los días que elijas.`;
    case "mes":
      return rule.day > 28
        ? `Se repite ${formatRuleLabel(rule)}; en los meses más cortos, el último día.`
        : `Se repite ${formatRuleLabel(rule)}.`;
    default:
      return "";
  }
}

export function ActivityFields({ modalState, formState, formId }) {
  const closeDialog = useCloseDialog();
  const { values, errors, selectedHive } = formState;

  return (
    <form
      id={formId}
      className={styles.formulario}
      onSubmit={(event) => formState.handleSubmit(event, closeDialog)}
      noValidate
    >
      <FormAlert message={modalState.errorMessage} />

      <TextField
        label="¿Qué vas a hacer?"
        name="title"
        autoComplete="off"
        enterKeyHint="done"
        required
        autoFocus={!modalState.isEditing}
        value={values.title}
        error={errors.title}
        onChange={(event) =>
          formState.updateField("title", event?.target ? event.target.value : event)
        }
        onBlur={formState.handleBlur}
      />

      {formState.inHive ? (
        <p className={styles.nota}>Las celdas de una colmena son únicas: se cumplen una vez.</p>
      ) : (
        <RadioCardGroup
          label="Tipo"
          name="type"
          options={formState.typeOptions}
          value={values.type}
          onChange={(type) => formState.updateField("type", type)}
          error={errors.type}
        />
      )}

      {formState.isOnce ? (
        <>
          <TextField
            label="Fecha (opcional)"
            name="dueDate"
            type="date"
            min={modalState.today}
            hint="Si tiene fecha, aparece en Hoy desde ya y vence ese día."
            value={values.dueDate}
            error={errors.dueDate}
            onChange={(event) =>
              formState.updateField("dueDate", event?.target ? event.target.value : event)
            }
            onBlur={formState.handleBlur}
          />
          <SwitchField
            label="Prioridad alta"
            name="highPriority"
            description={
              modalState.canMarkHighPriority
                ? "Vale más gotas. Úsala para lo que de verdad importa."
                : `Ya tienes ${MAX_HIGH_PRIORITY} celdas de prioridad alta. Termina una antes de marcar otra.`
            }
            checked={values.highPriority}
            disabled={!modalState.canMarkHighPriority && !values.highPriority}
            onChange={(checked) =>
              formState.updateField(
                "highPriority",
                checked?.target ? checked.target.checked : Boolean(checked),
              )
            }
          />
        </>
      ) : (
        <div className={styles.repeticion}>
          <RadioCardGroup
            label="¿Cada cuánto?"
            name="ruleKind"
            options={RULE_KIND_OPTIONS}
            value={values.ruleKind}
            onChange={(ruleKind) => formState.updateField("ruleKind", ruleKind)}
            error={errors.rule}
          />
          {values.ruleKind === "dias" && (
            <ChipGroup
              label="Días de la semana"
              options={WEEKDAY_CHIP_OPTIONS}
              values={values.days}
              onChange={(days) => formState.updateField("days", days)}
              error={errors["rule.days"]}
            />
          )}
          {values.ruleKind === "veces" && (
            <SelectField
              label="Veces por semana"
              name="count"
              value={values.count}
              options={TIMES_PER_WEEK_OPTIONS}
              onChange={(event) =>
                formState.updateField("count", Number(event?.target ? event.target.value : event))
              }
            />
          )}
          {values.ruleKind === "mes" && (
            <SelectField
              label="Día del mes"
              name="dayOfMonth"
              value={values.dayOfMonth}
              options={DAY_OF_MONTH_OPTIONS}
              onChange={(event) =>
                formState.updateField(
                  "dayOfMonth",
                  Number(event?.target ? event.target.value : event),
                )
              }
            />
          )}
          <p className={styles.regla} aria-live="polite">
            {describeRule(formState.rule)}
          </p>
        </div>
      )}

      {modalState.hives.length > 0 && (
        <div className={styles.colmena}>
          <SelectField
            label="Colmena (opcional)"
            name="hiveId"
            value={values.hiveId}
            onChange={(event) => formState.selectHive(event?.target ? event.target.value : event)}
            options={[
              { value: "", label: "Ninguna: es personal" },
              ...modalState.hives.map((hive) => ({
                value: hive.id,
                label: hive.name,
              })),
            ]}
            error={errors.hiveId}
          />
          {selectedHive && (
            <SelectField
              label="Asignar a"
              name="assigneeId"
              value={values.assigneeId}
              onChange={(event) =>
                formState.updateField("assigneeId", event?.target ? event.target.value : event)
              }
              options={[
                { value: "", label: "Libre: la llena quien llegue primero" },
                ...(selectedHive.members ?? []).map((member) => ({
                  value: member.id,
                  label: member.name,
                })),
              ]}
              error={errors.assigneeId}
            />
          )}
        </div>
      )}

      <p className={styles.vistaPrevia}>
        {`Esta celda vale +${formatDrops(formState.drops)} de miel.`}
      </p>
    </form>
  );
}
