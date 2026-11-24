import { createHiveSchema, hiveUpdateSchema } from "@panal/contratos";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { useForm } from "../../components/ui/useForm.js";
import { useIsOnline } from "../../core/connection/useConnection.js";
import { selectActiveHives } from "../../core/dashboard/dashboardSelectors.js";
import { useToasts } from "../../core/toasts/useToasts.js";
import {
  useCreateHiveMutation,
  useGetDashboardQuery,
  useGetHivesQuery,
  useUpdateHiveMutation,
} from "../../store/api.js";
import { getGeneralErrorMessage, parseApiError } from "../../store/apiErrors.js";
import { selectArchivedHives, selectClosedHives } from "./hivesSelectors.js";

const toHivePayload = (values) => ({
  name: values.name,
  description: values.description.trim() ? values.description : null,
  dueDate: values.dueDate || null,
});

export function useHives() {
  const query = useGetHivesQuery();
  const dashboardQuery = useGetDashboardQuery();
  const activeHives = useSelector(selectActiveHives);
  const closedHives = useSelector(selectClosedHives);
  const archivedHives = useSelector(selectArchivedHives);

  return {
    isLoading: query.isLoading,
    isError: query.isError,
    retry: query.refetch,
    today: dashboardQuery.data?.today ?? query.data?.today,
    activeHives: activeHives ?? [],
    closedHives: closedHives ?? [],
    archivedHives: archivedHives ?? [],
  };
}

export function useCreateHiveForm(hive, onSuccess) {
  const navigate = useNavigate();
  const { showToast } = useToasts();
  const isOnline = useIsOnline();
  const today = useGetDashboardQuery().data?.today;
  const [createHive, createState] = useCreateHiveMutation();
  const [updateHive, updateState] = useUpdateHiveMutation();

  const form = useForm({
    initialValues: {
      name: hive?.name ?? "",
      description: hive?.description ?? "",
      dueDate: hive?.dueDate ?? "",
    },
    schema: hive ? hiveUpdateSchema : createHiveSchema,
    transform: toHivePayload,
    onSubmit: async (payload) => {
      const result = hive
        ? await updateHive({ id: hive.id, ...payload })
        : await createHive(payload);
      if (result.error) {
        form.setServerErrors(parseApiError(result.error).fields ?? {});
        return;
      }
      onSuccess?.();
      if (hive) {
        showToast({ message: "Cambios guardados" });
      } else {
        const createdHive = result.data?.hive ?? result.data;
        showToast({ message: `Fundaste ${payload.name}. Ahora invita a tu enjambre.` });
        if (createdHive?.id) navigate(`/colmenas/${createdHive.id}`);
      }
    },
  });

  const activeError = createState.error ?? updateState.error;

  return {
    form,
    isSaving: createState.isLoading || updateState.isLoading || form.isSubmitting,
    errorMessage: getGeneralErrorMessage(activeError),
    isOnline,
    today,
  };
}
