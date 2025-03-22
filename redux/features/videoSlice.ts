import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import { fetchVideos as fetchVideosApi } from "@/lib/api";
import type { Video } from "@/types";

interface VideoState {
  videos: Video[];
  loading: boolean;
  error: string | null;
  searchQuery: string;
  nextPageToken: string | null;
}

const initialState: VideoState = {
  videos: [],
  loading: false,
  error: null,
  searchQuery: "",
  nextPageToken: null,
};

export const fetchVideos = createAsyncThunk(
  "videos/fetchVideos",
  async ({
    searchQuery,
    pageToken,
  }: {
    searchQuery: string;
    pageToken?: string;
  }) => {
    const response = await fetchVideosApi(searchQuery, pageToken);
    return response;
  },
);

const videoSlice = createSlice({
  name: "videos",
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
      state.videos = [];
      state.nextPageToken = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchVideos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVideos.fulfilled, (state, action) => {
        state.loading = false;
        state.videos = [...state.videos, ...action.payload.videos];
        state.nextPageToken = action.payload.nextPageToken;
      })
      .addCase(fetchVideos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch videos";
      });
  },
});

export const { setSearchQuery } = videoSlice.actions;
export default videoSlice.reducer;
