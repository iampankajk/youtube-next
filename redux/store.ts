import { configureStore } from "@reduxjs/toolkit";
import videoReducer from "./features/videoSlice";

export const store = configureStore({
  reducer: {
    videos: videoReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
