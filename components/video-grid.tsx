"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchVideos } from "@/redux/features/videoSlice";
import type { AppDispatch, RootState } from "@/redux/store";
import VideoCard from "@/components/video-card";
import { Button } from "./ui/button";

export default function VideoGrid() {
  const dispatch = useDispatch<AppDispatch>();
  const { videos, loading, error, searchQuery, nextPageToken } = useSelector(
    (state: RootState) => state.videos,
  );

  useEffect(() => {
    dispatch(fetchVideos({ searchQuery }));
  }, [dispatch, searchQuery]);

  const loadMoreVideos = () => {
    if (nextPageToken) {
      dispatch(fetchVideos({ searchQuery, pageToken: nextPageToken }));
    }
  };

  if (loading && videos.length === 0) {
    return <div className="py-8 text-center">Loading videos...</div>;
  }

  if (error) {
    return <div className="py-8 text-center text-red-500">Error: {error}</div>;
  }

  return (
    <div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {videos.map((video, index) => (
          <VideoCard key={video.id + index} video={video} />
        ))}
      </div>
      {nextPageToken && (
        <Button
          onClick={loadMoreVideos}
          className="mt-4 p-4 bg-red-600 text-white rounded"
        >
          Load More...
        </Button>
      )}
    </div>
  );
}
