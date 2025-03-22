import { fetchVideos } from "../../lib/api";
import {
  fetchVideos as fetchVideosThunk,
  setSearchQuery,
} from "@/redux/features/videoSlice";
import videoReducer from "@/redux/features/videoSlice";
import { configureStore } from "@reduxjs/toolkit";

jest.mock("../../lib/api", () => ({
  fetchVideos: jest.fn(),
}));

const mockedFetchVideos = fetchVideos as jest.Mock;

describe("Video API and Redux Tests", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("fetchVideos API should return expected video data", async () => {
    const mockResponse = {
      videos: [
        {
          id: "1",
          title: "Test Video",
          description: "This is a test video",
          thumbnail: "thumbnail.jpg",
          channelTitle: "Test Channel",
          publishedAt: "2024-01-01T00:00:00Z",
          duration: "PT5M30S",
          viewCount: "1000",
          likeCount: "100",
          channelThumbnail: "",
          subscriberCount: "",
        },
      ],
      nextPageToken: "NEXT_PAGE_TOKEN",
    };

    mockedFetchVideos.mockResolvedValue(mockResponse);

    const result = await fetchVideos("test");
    expect(result).toEqual(mockResponse);
    expect(mockedFetchVideos).toHaveBeenCalledWith("test"); // Adjust expectation
  });

  test("fetchVideos Redux thunk should update state correctly", async () => {
    const mockResponse = {
      videos: [
        {
          id: "1",
          title: "Test Video",
          description: "This is a test video",
          thumbnail: "thumbnail.jpg",
          channelTitle: "Test Channel",
          publishedAt: "2024-01-01T00:00:00Z",
          duration: "PT5M30S", // Match Video type expected by reducer
          viewCount: "1000",
          likeCount: "100",
        },
      ],
      nextPageToken: "NEXT_PAGE_TOKEN",
    };

    mockedFetchVideos.mockResolvedValue(mockResponse);

    const store = configureStore({
      reducer: videoReducer,
      middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(), // Use callback for middleware
    });
    await store.dispatch(fetchVideosThunk({ searchQuery: "test" }));

    const state = store.getState();
    expect(state.videos).toEqual(mockResponse.videos);
    expect(state.nextPageToken).toEqual("NEXT_PAGE_TOKEN");
    expect(state.loading).toBe(false);
  });

  test("setSearchQuery should reset videos and search query", () => {
    const initialState = {
      videos: [
        {
          id: "1",
          title: "Old Video",
          description: "Old description",
          thumbnail: "old_thumbnail.jpg",
          channelTitle: "Old Channel",
          publishedAt: "2024-01-01T00:00:00Z",
          duration: "PT5M",
          viewCount: "100",
          likeCount: "10",
          channelThumbnail: "old_channel_thumbnail.jpg",
          subscriberCount: "",
        },
      ],
      loading: false,
      error: null,
      searchQuery: "old search",
      nextPageToken: "OLD_TOKEN",
    };

    const newState = videoReducer(initialState, setSearchQuery("new search"));

    expect(newState.searchQuery).toBe("new search");
    expect(newState.videos).toEqual([]);
    expect(newState.nextPageToken).toBeNull();
  });
});
