import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import authReducer from "../core/auth/authSlice.js";
import celebrationsReducer from "../core/celebrations/celebrationsSlice.js";
import clockReducer from "../core/clock/clockSlice.js";
import connectionReducer from "../core/connection/connectionSlice.js";
import preferencesReducer from "../core/preferences/preferencesSlice.js";
import toastsReducer from "../core/toasts/toastsSlice.js";
import activityReducer from "../feature/activity/activitySlice.js";
import cellsReducer from "../feature/cells/cellsSlice.js";
import onboardingReducer from "../feature/onboarding/onboardingSlice.js";
import todayReducer from "../feature/today/todaySlice.js";
import { panalApi } from "./api.js";

const extraFeatureSliceModules = import.meta.glob(
  "../feature/{hives,reports,profile,flight,joinHive,auth,errors}/*Slice.js",
  { eager: true },
);

function getExtraFeatureReducers() {
  const reducers = {};
  for (const [path, mod] of Object.entries(extraFeatureSliceModules)) {
    const slice = Object.values(mod).find(
      (exported) =>
        exported &&
        typeof exported === "object" &&
        typeof exported.name === "string" &&
        typeof exported.reducer === "function",
    );
    if (slice) {
      reducers[slice.reducerPath ?? slice.name] = slice.reducer;
    } else if (typeof mod.default === "function") {
      const match = path.match(/\/([^/]+)Slice\.js$/);
      if (match) reducers[match[1]] = mod.default;
    }
  }
  return reducers;
}

export function createAppStore(preloadedState) {
  const appStore = configureStore({
    reducer: {
      [panalApi.reducerPath]: panalApi.reducer,
      auth: authReducer,
      clock: clockReducer,
      connection: connectionReducer,
      preferences: preferencesReducer,
      toasts: toastsReducer,
      celebrations: celebrationsReducer,
      activity: activityReducer,
      cells: cellsReducer,
      onboarding: onboardingReducer,
      today: todayReducer,
      ...getExtraFeatureReducers(),
    },
    preloadedState,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(panalApi.middleware),
  });
  setupListeners(appStore.dispatch);
  return appStore;
}

export const store = createAppStore();
