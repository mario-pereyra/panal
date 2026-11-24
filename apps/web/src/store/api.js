import { getCellDrops } from "@panal/motor";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const rawBaseQuery = fetchBaseQuery({ baseUrl: "/api", credentials: "same-origin" });

async function baseQueryWithAuthCheck(args, api, extraOptions) {
  const response = await rawBaseQuery(args, api, extraOptions);
  if (response.error?.status === 401 && !["getMe", "login", "register"].includes(api.endpoint)) {
    api.dispatch(panalApi.util.invalidateTags(["Me"]));
  }
  return response;
}

async function upsertMeCache(_, { dispatch, queryFulfilled }) {
  try {
    const { data } = await queryFulfilled;
    dispatch(panalApi.util.upsertQueryData("getMe", undefined, data));
  } catch {
    return;
  }
}

function applyOptimisticFillToHive(hiveData, { id, activityId, userId, day }) {
  const hive = hiveData?.hive ?? hiveData;
  if (!hive) return;
  const targetDay = day ?? hive.today;
  const activity = hive.activities?.find((candidate) => candidate.id === activityId);
  if (activity) {
    activity.filled = true;
    activity.filledBy = userId;
    activity.filledDay = targetDay;
    activity.cellId = id;
    activity.filledToday = true;
    activity.todayCellId = id;
  }
  if (Array.isArray(hive.filledCells) && !hive.filledCells.some((cell) => cell.id === id)) {
    hive.filledCells.push({
      id,
      activityId,
      userId,
      day: targetDay,
      filledAt: new Date().toISOString(),
    });
  }
}

function applyOptimisticFillToDashboard(dashboard, { id, activityId, overdue }) {
  if (!dashboard) return;
  const activity = dashboard.activities?.find((candidate) => candidate.id === activityId);
  if (activity) {
    const filledBefore = (dashboard.filledCells ?? []).filter(
      (cell) => cell.day === dashboard.today,
    ).length;
    dashboard.filledCells.push({
      id,
      activityId,
      userId: dashboard.user?.id,
      day: dashboard.today,
      filledAt: new Date().toISOString(),
      drops: getCellDrops({ ...activity, overdue }, { filledBefore }),
    });
    activity.filledToday = true;
    activity.todayCellId = id;
  }
  if (dashboard.activeHive) {
    applyOptimisticFillToHive(dashboard.activeHive, {
      id,
      activityId,
      userId: dashboard.user?.id,
      day: dashboard.today,
    });
  }
}

function applyOptimisticUnfillToHive(hiveData, { id, activityId }) {
  const hive = hiveData?.hive ?? hiveData;
  if (!hive) return;
  const activity = hive.activities?.find(
    (candidate) => candidate.cellId === id || (activityId && candidate.id === activityId),
  );
  if (activity) {
    activity.filled = false;
    activity.filledBy = null;
    activity.filledDay = null;
    activity.cellId = null;
    activity.filledToday = false;
    activity.todayCellId = null;
  }
  if (Array.isArray(hive.filledCells)) {
    hive.filledCells = hive.filledCells.filter((cell) => cell.id !== id);
  }
}

function applyOptimisticUnfillToDashboard(dashboard, { id }) {
  if (!dashboard) return;
  const removed = dashboard.filledCells?.find((candidate) => candidate.id === id);
  if (removed) {
    dashboard.filledCells = dashboard.filledCells.filter((cell) => cell.id !== id);
    const activity = dashboard.activities?.find((item) => item.id === removed.activityId);
    if (activity) {
      activity.filledToday = false;
      activity.todayCellId = null;
    }
  }
  if (dashboard.activeHive) {
    applyOptimisticUnfillToHive(dashboard.activeHive, {
      id,
      activityId: removed?.activityId,
    });
  }
}

const AFTER_CELL_TAGS = ["Progress", "Hives", "Report"];
const AFTER_ACTIVITY_TAGS = ["Activities", "Dashboard", "Hives", "Report", "Progress"];

export const panalApi = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithAuthCheck,
  tagTypes: ["Me", "Dashboard", "Activities", "Hives", "Invitation", "Progress", "Report"],
  refetchOnFocus: true,
  refetchOnReconnect: true,
  endpoints: (builder) => ({
    getMe: builder.query({
      query: () => "/me",
      providesTags: ["Me"],
    }),

    register: builder.mutation({
      query: (account) => ({ url: "/account", method: "POST", body: account }),
      onQueryStarted: upsertMeCache,
    }),

    login: builder.mutation({
      query: (credentials) => ({ url: "/session", method: "POST", body: credentials }),
      onQueryStarted: upsertMeCache,
    }),

    logout: builder.mutation({
      query: () => ({ url: "/session", method: "DELETE" }),
    }),

    updateProfile: builder.mutation({
      query: (changes) => ({ url: "/me", method: "PATCH", body: changes }),
      onQueryStarted: upsertMeCache,
      invalidatesTags: ["Dashboard", "Progress", "Report"],
    }),

    completeOnboarding: builder.mutation({
      query: (data) => ({ url: "/me/onboarding", method: "POST", body: data }),
      onQueryStarted: upsertMeCache,
      invalidatesTags: ["Dashboard", "Progress"],
    }),

    startPause: builder.mutation({
      query: () => ({ url: "/me/pause", method: "POST" }),
      onQueryStarted: upsertMeCache,
      invalidatesTags: ["Dashboard", "Progress", "Report"],
    }),

    cancelPause: builder.mutation({
      query: () => ({ url: "/me/pause", method: "DELETE" }),
      onQueryStarted: upsertMeCache,
      invalidatesTags: ["Dashboard", "Progress", "Report"],
    }),

    getProgress: builder.query({
      query: () => "/me/progress",
      providesTags: ["Progress"],
    }),

    getDashboard: builder.query({
      query: () => "/dashboard",
      providesTags: ["Dashboard"],
    }),

    getActivities: builder.query({
      query: (view = "active") => `/activities?view=${view}`,
      providesTags: ["Activities"],
    }),

    saveActivity: builder.mutation({
      query: ({ id, ...activity }) => ({
        url: `/activities/${id}`,
        method: "PUT",
        body: activity,
      }),
      invalidatesTags: AFTER_ACTIVITY_TAGS,
    }),

    updateActivity: builder.mutation({
      query: ({ id, ...changes }) => ({
        url: `/activities/${id}`,
        method: "PATCH",
        body: changes,
      }),
      invalidatesTags: AFTER_ACTIVITY_TAGS,
    }),

    fillCell: builder.mutation({
      query: ({ id, activityId }) => ({
        url: `/cells/${id}`,
        method: "PUT",
        body: { activityId },
      }),
      async onQueryStarted(
        { id, activityId, overdue, hiveId },
        { dispatch, queryFulfilled, getState },
      ) {
        const userId = selectMe(getState())?.id ?? null;
        const patches = [
          dispatch(
            panalApi.util.updateQueryData("getDashboard", undefined, (dashboard) => {
              applyOptimisticFillToDashboard(dashboard, { id, activityId, overdue });
            }),
          ),
        ];
        if (hiveId) {
          patches.push(
            dispatch(
              panalApi.util.updateQueryData("getHive", hiveId, (hiveData) => {
                applyOptimisticFillToHive(hiveData, { id, activityId, userId });
              }),
            ),
          );
        }
        try {
          const { data } = await queryFulfilled;
          dispatch(
            panalApi.util.updateQueryData("getDashboard", undefined, (dashboard) => {
              const cell = dashboard.filledCells?.find((candidate) => candidate.id === id);
              if (cell && data?.cell) Object.assign(cell, data.cell);
              if (data?.todayBonuses !== undefined && dashboard.progress) {
                dashboard.progress.todayBonuses = data.todayBonuses;
              }
            }),
          );
        } catch {
          for (const patch of patches) patch.undo();
        }
      },
      invalidatesTags: (_, error, arg) => {
        if (error) return [];
        return arg?.type && arg.type !== "unica"
          ? AFTER_CELL_TAGS
          : [...AFTER_CELL_TAGS, "Activities"];
      },
    }),

    unfillCell: builder.mutation({
      query: ({ id }) => ({ url: `/cells/${id}`, method: "DELETE" }),
      async onQueryStarted({ id, activityId, hiveId }, { dispatch, queryFulfilled }) {
        const patches = [
          dispatch(
            panalApi.util.updateQueryData("getDashboard", undefined, (dashboard) => {
              applyOptimisticUnfillToDashboard(dashboard, { id });
            }),
          ),
        ];
        if (hiveId) {
          patches.push(
            dispatch(
              panalApi.util.updateQueryData("getHive", hiveId, (hiveData) => {
                applyOptimisticUnfillToHive(hiveData, { id, activityId });
              }),
            ),
          );
        }
        try {
          await queryFulfilled;
        } catch {
          for (const patch of patches) patch.undo();
        }
      },
      invalidatesTags: (_, error) => (error ? [] : [...AFTER_CELL_TAGS, "Dashboard", "Activities"]),
    }),

    getHives: builder.query({
      query: () => "/hives",
      providesTags: ["Hives"],
    }),

    createHive: builder.mutation({
      query: (hive) => ({ url: "/hives", method: "POST", body: hive }),
      invalidatesTags: ["Hives", "Dashboard", "Progress"],
    }),

    getHive: builder.query({
      query: (id) => `/hives/${id}`,
      providesTags: (_, __, id) => [{ type: "Hives", id }],
    }),

    updateHive: builder.mutation({
      query: ({ id, ...changes }) => ({ url: `/hives/${id}`, method: "PATCH", body: changes }),
      invalidatesTags: ["Hives", "Dashboard"],
    }),

    removeHiveMember: builder.mutation({
      query: ({ hiveId, id, userId }) => ({
        url: `/hives/${hiveId ?? id}/members/${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Hives", "Dashboard", "Activities", "Progress"],
    }),

    getHiveInvitation: builder.query({
      query: (hiveId) => `/hives/${hiveId}/invitation`,
      providesTags: (_, __, hiveId) => [{ type: "Invitation", id: hiveId }],
    }),

    createHiveInvitation: builder.mutation({
      query: (hiveId) => ({ url: `/hives/${hiveId}/invitation`, method: "POST" }),
      invalidatesTags: (_, error, hiveId) => (error ? [] : [{ type: "Invitation", id: hiveId }]),
    }),

    revokeHiveInvitation: builder.mutation({
      query: (hiveId) => ({ url: `/hives/${hiveId}/invitation`, method: "DELETE" }),
      invalidatesTags: (_, error, hiveId) => (error ? [] : [{ type: "Invitation", id: hiveId }]),
    }),

    getInvitation: builder.query({
      query: (code) => `/invitations/${code}`,
    }),

    acceptInvitation: builder.mutation({
      query: (code) => ({ url: `/invitations/${code}/accept`, method: "POST" }),
      invalidatesTags: ["Hives", "Dashboard", "Activities", "Progress"],
    }),

    getReport: builder.query({
      query: ({ from, to }) => `/reports?from=${from}&to=${to}`,
      providesTags: ["Report"],
    }),
  }),
});

export const {
  useGetMeQuery,
  useRegisterMutation,
  useLoginMutation,
  useLogoutMutation,
  useUpdateProfileMutation,
  useCompleteOnboardingMutation,
  useStartPauseMutation,
  useCancelPauseMutation,
  useGetProgressQuery,
  useGetDashboardQuery,
  useGetActivitiesQuery,
  useSaveActivityMutation,
  useUpdateActivityMutation,
  useFillCellMutation,
  useUnfillCellMutation,
  useGetHivesQuery,
  useCreateHiveMutation,
  useGetHiveQuery,
  useUpdateHiveMutation,
  useRemoveHiveMemberMutation,
  useGetHiveInvitationQuery,
  useCreateHiveInvitationMutation,
  useRevokeHiveInvitationMutation,
  useGetInvitationQuery,
  useAcceptInvitationMutation,
  useGetReportQuery,
} = panalApi;

const selectMeResult = panalApi.endpoints.getMe.select();
const selectDashboardResult = panalApi.endpoints.getDashboard.select();
const selectProgressResult = panalApi.endpoints.getProgress.select();
const selectHivesListResult = panalApi.endpoints.getHives.select();

export const selectMe = (state) => {
  const data = selectMeResult(state).data;
  return data?.user ?? data;
};

export const selectDashboard = (state) => selectDashboardResult(state).data;

export const selectProgress = (state) => selectProgressResult(state).data;

export function selectActivities(viewOrState, maybeView) {
  if (typeof viewOrState === "object" && viewOrState !== null && "api" in viewOrState) {
    return panalApi.endpoints.getActivities.select(maybeView)(viewOrState).data;
  }
  const selectView = panalApi.endpoints.getActivities.select(viewOrState);
  return (state) => selectView(state).data;
}

export const selectHivesList = (state) => selectHivesListResult(state).data;

export function selectHiveById(idOrState, maybeId) {
  if (typeof idOrState === "object" && idOrState !== null && "api" in idOrState) {
    const data = panalApi.endpoints.getHive.select(maybeId)(idOrState).data;
    return data?.hive ?? data;
  }
  const selectById = panalApi.endpoints.getHive.select(idOrState);
  return (state) => {
    const data = selectById(state).data;
    return data?.hive ?? data;
  };
}

export function selectReport(periodOrState, maybePeriod) {
  if (typeof periodOrState === "object" && periodOrState !== null && "api" in periodOrState) {
    return maybePeriod
      ? panalApi.endpoints.getReport.select(maybePeriod)(periodOrState).data
      : undefined;
  }
  if (!periodOrState) return () => undefined;
  const selectByPeriod = panalApi.endpoints.getReport.select(periodOrState);
  return (state) => selectByPeriod(state).data;
}
