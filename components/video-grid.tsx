"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { fetchVideos } from "@/redux/features/videoSlice";
import type { AppDispatch, RootState } from "@/redux/store";
import VideoCard from "@/components/video-card";

/**
 *
 */
export default function VideoGrid() {
  const dispatch = useDispatch<AppDispatch>();
  const { videos, loading, error, searchQuery } = useSelector(
    (state: RootState) => state.videos,
  );

  useEffect(() => {
    dispatch(fetchVideos(searchQuery));
  }, [dispatch, searchQuery]);

  if (loading) {
    return <div className="py-8 text-center">Loading videos...</div>;
  }

  if (error) {
    return <div className="py-8 text-center text-red-500">Error: {error}</div>;
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {videos.map((video) => (
        <VideoCard key={video.id} video={video} />
      ))}
    </div>
  );
}
