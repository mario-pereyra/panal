import { createSlice, nanoid } from "@reduxjs/toolkit";

function normalizeToastPayload(input, toneArg) {
  if (typeof input === "string") {
    return {
      id: nanoid(),
      message: input,
      tone: toneArg ?? "success",
      action: null,
    };
  }
  const message = input?.message ?? input?.text ?? "";
  const rawTone = input?.tone ?? input?.variant ?? toneArg ?? "success";
  const tone = rawTone === "error" || rawTone === "danger" ? "error" : "success";
  return {
    id: input?.id ?? nanoid(),
    message,
    tone,
    action: input?.action ?? null,
  };
}

export const toastsSlice = createSlice({
  name: "toasts",
  initialState: () => ({ queue: [] }),
  reducers: {
    addToast: {
      reducer(state, action) {
        if (action.payload.message) {
          state.queue.push(action.payload);
        }
      },
      prepare(input, toneArg) {
        return { payload: normalizeToastPayload(input, toneArg) };
      },
    },
    removeToast(state, action) {
      if (!action.payload) {
        state.queue.shift();
      } else {
        state.queue = state.queue.filter((toast) => toast.id !== action.payload);
      }
    },
  },
});

export const { addToast, removeToast } = toastsSlice.actions;

export const selectToasts = (state) => state.toasts.queue;

export default toastsSlice.reducer;
