import { addDays } from "@panal/motor";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router";
import { useIsOnline } from "../../core/connection/useConnection.js";
import { useArchiveActivity, useToggleCell } from "../../core/dashboard/useCellActions.js";
import { useToasts } from "../../core/toasts/useToasts.js";
import {
  useGetActivitiesQuery,
  useGetDashboardQuery,
  useUpdateActivityMutation,
} from "../../store/api.js";
import { CELL_TABS, selectCellsByTab, selectFilterHives } from "./cellsSelectors.js";
import {
  clearCellFilters,
  selectHasCellFilters,
  selectHiveFilter,
  selectPriorityFilter,
  setHiveFilter,
  setPriorityFilter,
} from "./cellsSlice.js";

export function useCells() {
  const dispatch = useDispatch();
  const { showToast } = useToasts();
  const isOnline = useIsOnline();
  const [searchParams] = useSearchParams();
  const requestedTab = searchParams.get("ver");
  const activeTab = CELL_TABS.includes(requestedTab) ? requestedTab : "hoy";

  const dashboardQuery = useGetDashboardQuery();
  const activeQuery = useGetActivitiesQuery("active");
  const doneQuery = useGetActivitiesQuery("done", { skip: activeTab !== "hechas" });
  const archivedQuery = useGetActivitiesQuery("archived", {
    skip: activeTab !== "archivadas",
  });
  const [updateActivity] = useUpdateActivityMutation();
  const { toggleCell } = useToggleCell();
  const { archiveActivity, restoreActivity } = useArchiveActivity();

  const { groups, counts } = useSelector(selectCellsByTab);
  const hiveFilter = useSelector(selectHiveFilter);
  const priorityFilter = useSelector(selectPriorityFilter);
  const hasFilters = useSelector(selectHasCellFilters);
  const hives = useSelector(selectFilterHives);

  const currentQuery = { hechas: doneQuery, archivadas: archivedQuery }[activeTab] ?? activeQuery;

  const archiveRow = (row) => archiveActivity(row.id);

  const restoreRow = async (row) => {
    if (restoreActivity) {
      return restoreActivity(row.id);
    }
    const result = await updateActivity({ id: row.id, archived: false });
    if (result.error) {
      showToast({
        message: "No se pudo recuperar. Inténtalo otra vez.",
        tone: "error",
      });
      return false;
    }
    showToast({ message: "Celda recuperada: vuelve a tu panal." });
    return true;
  };

  const postponeRow = async (row) => {
    const today = dashboardQuery.data?.today;
    if (!today) return;
    const baseDay = row.dueDate && row.dueDate > today ? row.dueDate : today;
    const result = await updateActivity({
      id: row.id,
      dueDate: addDays(baseDay, 1),
    });
    if (result.error) {
      showToast({
        message: "No se pudo posponer. Inténtalo otra vez.",
        tone: "error",
      });
      return;
    }
    showToast({ message: "Pospuesta para el día siguiente." });
  };

  return {
    activeTab,
    groups: groups[activeTab] ?? [],
    counts,
    isLoading: currentQuery.isLoading || dashboardQuery.isLoading,
    isError: currentQuery.isError || dashboardQuery.isError,
    retry: () => {
      currentQuery.refetch();
      dashboardQuery.refetch();
    },
    isOnline,
    hiveFilter,
    priorityFilter,
    hasFilters,
    hives,
    setHiveFilter: (value) => dispatch(setHiveFilter(value)),
    setPriorityFilter: (value) => dispatch(setPriorityFilter(value)),
    clearFilters: () => dispatch(clearCellFilters()),
    toggleCell,
    archiveRow,
    restoreRow,
    postponeRow,
  };
}
