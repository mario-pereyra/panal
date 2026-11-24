import { titleOnlySchema } from "@panal/contratos";
import { getCellDrops } from "@panal/motor";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { useForm } from "../../components/ui/useForm.js";
import { useIsOnline } from "../../core/connection/useConnection.js";
import { getDeviceTimeZone } from "../../lib/device.js";
import {
  useCompleteOnboardingMutation,
  useFillCellMutation,
  useSaveActivityMutation,
  useUpdateProfileMutation,
} from "../../store/api.js";
import { getGeneralErrorMessage, parseApiError } from "../../store/apiErrors.js";
import {
  resetOnboarding,
  selectOnboarding,
  setCreatedActivity,
  setDailyGoal,
  setFilledCell,
  setStep,
} from "./onboardingSlice.js";

const FIRST_CELL_DROPS = getCellDrops({ type: "recurrente" });

export function useOnboarding() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isOnline = useIsOnline();
  const onboarding = useSelector(selectOnboarding);

  const [updateProfile, profileState] = useUpdateProfileMutation();
  const [saveActivity, activityState] = useSaveActivityMutation();
  const [fillCell, fillState] = useFillCellMutation();
  const [completeOnboarding, completeState] = useCompleteOnboardingMutation();

  const activityForm = useForm({
    initialValues: { title: onboarding.title },
    schema: titleOnlySchema,
    onSubmit: async ({ title }) => {
      const id = onboarding.activityId ?? crypto.randomUUID();
      const result = await saveActivity({
        id,
        title,
        type: "recurrente",
        priority: "normal",
        rule: { kind: "diaria" },
        dueDate: null,
        hiveId: null,
        assigneeId: null,
      });
      if (result.error) {
        activityForm.setServerErrors(parseApiError(result.error).fields ?? {});
        return;
      }
      dispatch(setCreatedActivity({ id, title }));
    },
  });

  const confirmGoal = async () => {
    const result = await updateProfile({
      dailyGoal: onboarding.dailyGoal,
      timeZone: getDeviceTimeZone(),
    });
    if (!result.error) dispatch(setStep(2));
  };

  const fillFirstCell = async () => {
    if (onboarding.cellId || fillState.isLoading || !isOnline) return;
    const id = crypto.randomUUID();
    const result = await fillCell({ id, activityId: onboarding.activityId });
    if (!result.error || parseApiError(result.error).code === "cell_already_filled") {
      dispatch(setFilledCell(id));
    }
  };

  const finishOnboarding = async () => {
    const result = await completeOnboarding({ dailyGoal: onboarding.dailyGoal });
    if (result.error) return;
    dispatch(resetOnboarding());
    navigate("/", { replace: true });
  };

  const activeError =
    profileState.error ??
    activityState.error ??
    (onboarding.cellId ? null : fillState.error) ??
    completeState.error;

  return {
    ...onboarding,
    activityForm,
    drops: FIRST_CELL_DROPS,
    isOnline,
    isSaving:
      profileState.isLoading ||
      activityState.isLoading ||
      fillState.isLoading ||
      completeState.isLoading,
    errorMessage: getGeneralErrorMessage(activeError),
    selectGoal: (goal) => dispatch(setDailyGoal(goal)),
    goBack: () => dispatch(setStep(Math.max(1, onboarding.step - 1))),
    confirmGoal,
    fillFirstCell,
    finishOnboarding,
  };
}
