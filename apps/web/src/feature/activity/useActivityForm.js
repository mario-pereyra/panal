import { activitySchema, getActivityPermissions } from "@panal/contratos";
import { getCellDrops } from "@panal/motor";
import { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useSearchParams } from "react-router";
import { useForm } from "../../components/ui/useForm.js";
import { useModalRoute } from "../../components/ui/useModalRoute.js";
import { useIsOnline } from "../../core/connection/useConnection.js";
import { selectActiveHives } from "../../core/dashboard/dashboardSelectors.js";
import { useArchiveActivity } from "../../core/dashboard/useCellActions.js";
import { useToasts } from "../../core/toasts/useToasts.js";
import {
  selectMe,
  useGetActivitiesQuery,
  useGetDashboardQuery,
  useGetHivesQuery,
  useSaveActivityMutation,
} from "../../store/api.js";
import { getGeneralErrorMessage, parseApiError } from "../../store/apiErrors.js";
import {
  selectCanMarkHighPriority,
  selectDraftByKey,
  selectEditableActivity,
} from "./activitySelectors.js";
import { discardDraft, saveDraft } from "./activitySlice.js";

const DEFAULT_VALUES = {
  id: null,
  title: "",
  type: "unica",
  dueDate: "",
  highPriority: false,
  ruleKind: "diaria",
  days: [0, 2, 4],
  count: 3,
  dayOfMonth: 1,
  hiveId: "",
  assigneeId: "",
};

export const ACTIVITY_TYPE_OPTIONS = [
  { value: "unica", title: "Única", description: "Se cumple una vez" },
  { value: "recurrente", title: "Recurrente", description: "Se repite" },
];

function buildRule(values) {
  switch (values.ruleKind) {
    case "dias":
      return { kind: "dias", days: values.days };
    case "veces":
      return { kind: "veces", count: Number(values.count) };
    case "mes":
      return { kind: "mes", day: Number(values.dayOfMonth) };
    default:
      return { kind: "diaria" };
  }
}

export function toActivityPayload(values) {
  const isOnce = values.type === "unica";
  return {
    title: values.title,
    type: values.type,
    priority: isOnce && values.highPriority ? "high" : "normal",
    dueDate: isOnce && values.dueDate ? values.dueDate : null,
    rule: isOnce ? null : buildRule(values),
    hiveId: values.hiveId || null,
    assigneeId: values.hiveId && values.assigneeId ? values.assigneeId : null,
  };
}

function toFormValues(activity) {
  const rule = activity.rule ?? {};
  return {
    ...DEFAULT_VALUES,
    id: activity.id,
    title: activity.title,
    type: activity.type,
    dueDate: activity.dueDate ?? "",
    highPriority: activity.priority === "high",
    ruleKind: rule.kind ?? "diaria",
    days: rule.days ?? DEFAULT_VALUES.days,
    count: rule.count ?? DEFAULT_VALUES.count,
    dayOfMonth: rule.day ?? DEFAULT_VALUES.dayOfMonth,
    hiveId: activity.hiveId ?? "",
    assigneeId: activity.assigneeId ?? "",
  };
}

export function useActivityModal() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const { closeModal } = useModalRoute();
  const dispatch = useDispatch();
  const { showToast } = useToasts();
  const isOnline = useIsOnline();
  const draftKey = id ?? "new";
  const isEditing = Boolean(id);

  const dashboardQuery = useGetDashboardQuery();
  const activeQuery = useGetActivitiesQuery("active");
  const archivedQuery = useGetActivitiesQuery("archived", { skip: !isEditing });
  useGetHivesQuery();
  const [saveActivity, saveState] = useSaveActivityMutation();
  const { archiveActivity } = useArchiveActivity();

  const activity = useSelector((state) => selectEditableActivity(state, id));
  const me = useSelector(selectMe);
  const draft = useSelector((state) => selectDraftByKey(state, draftKey));
  const hives = useSelector(selectActiveHives);
  const canMarkHighPriority = useSelector((state) => selectCanMarkHighPriority(state, id));

  const [newId] = useState(() => crypto.randomUUID());
  const requestedHiveId = searchParams.get("colmena");
  const baseValues = isEditing
    ? activity
      ? toFormValues(activity)
      : null
    : { ...DEFAULT_VALUES, id: newId, hiveId: requestedHiveId ?? "" };

  const today = dashboardQuery.data?.today ?? activeQuery.data?.today;
  const permissions =
    activity &&
    (activity.permissions ??
      (me && today ? getActivityPermissions(activity, { userId: me.id, today }) : null));
  const isSearching =
    isEditing && (activity ? !permissions : activeQuery.isLoading || archivedQuery.isLoading);
  const notFound = isEditing && !isSearching && !permissions?.canEdit;

  const exitModal = () => closeModal(requestedHiveId ? `/colmenas/${requestedHiveId}` : "/celdas");

  const saveDraftValues = (values) => dispatch(saveDraft({ key: draftKey, values }));
  const clearDraftValues = () => dispatch(discardDraft(draftKey));

  const save = async (payload, rawValues) => {
    const result = await saveActivity({ id: rawValues.id, ...payload });
    if (result.error) {
      return { ok: false, fields: parseApiError(result.error).fields ?? {} };
    }
    clearDraftValues();
    showToast({
      message: isEditing ? "Cambios guardados" : "Celda creada: ya está en tu panal",
    });
    return { ok: true };
  };

  const archive = async () => {
    const ok = await archiveActivity(id);
    if (ok) clearDraftValues();
    return ok;
  };

  return {
    isEditing,
    draftKey,
    initialValues: draft ?? baseValues,
    hasDraft: Boolean(draft),
    isSearching,
    notFound,
    isArchived: Boolean(activity?.archived || activity?.archivedAt),
    today,
    canArchive: Boolean(permissions?.canArchive),
    canChangeType: !isEditing || Boolean(permissions?.canChangeType),
    hives: hives ?? [],
    canMarkHighPriority: canMarkHighPriority || activity?.priority === "high",
    isOnline,
    isSaving: saveState.isLoading,
    errorMessage: getGeneralErrorMessage(saveState.error),
    saveDraftValues,
    clearDraftValues,
    save,
    archive,
    exitModal,
  };
}

export function useActivityForm(modalState, onSuccess) {
  const form = useForm({
    initialValues: modalState.initialValues,
    schema: activitySchema,
    transform: toActivityPayload,
    onSubmit: async (payload) => {
      const result = await modalState.save(payload, form.values);
      if (result.ok) {
        onSuccess?.();
      } else {
        form.setServerErrors(result.fields);
      }
    },
  });

  const updateField = (name, value) => {
    const nextValues = { ...form.values, [name]: value };
    form.setFieldValue(name, value);
    modalState.saveDraftValues(nextValues);
  };

  const updateFields = (patch) => {
    const nextValues = { ...form.values, ...patch };
    form.setFields(patch);
    modalState.saveDraftValues(nextValues);
  };

  const derived = useMemo(() => {
    const payload = toActivityPayload(form.values);
    return {
      isOnce: payload.type === "unica",
      rule: payload.rule,
      drops: getCellDrops(payload),
      inHive: Boolean(payload.hiveId),
      selectedHive: modalState.hives.find((hive) => hive.id === payload.hiveId) ?? null,
      typeOptions: modalState.canChangeType
        ? ACTIVITY_TYPE_OPTIONS
        : ACTIVITY_TYPE_OPTIONS.filter((option) => option.value === payload.type),
    };
  }, [form.values, modalState.hives, modalState.canChangeType]);

  return {
    ...form,
    ...derived,
    hasUnsavedChanges: Boolean(form.isDirty || modalState.hasDraft),
    updateField,
    updateFields,
    selectHive: (hiveId) => updateFields({ hiveId, assigneeId: "", type: "unica" }),
  };
}
