"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";

import { fetchRelatedVideos } from "@/lib/api";
import type { Video } from "@/types";

type RelatedVideosProps = {
  videoId: string;
};

/**
 *
 * @param root0
 * @param root0.videoId
 */
export default function RelatedVideos({ videoId }: RelatedVideosProps) {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchRelatedVideos(videoId)
      .then((data) => {
        setVideos(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [videoId]);

  if (loading) {
    return <div className="py-4 text-center">Loading related videos...</div>;
  }

  return (
    <div className="space-y-4">
      <h3 className="font-medium">Related Videos</h3>
      <div className="space-y-3">
        {videos.map((video) => (
          <Link
            key={video.id}
            href={`/watch?v=${video.id}`}
            className="group flex gap-2"
          >
            <div className="relative aspect-video w-40 shrink-0 overflow-hidden rounded-lg">
              <Image
                src={video.thumbnail || "/placeholder.svg"}
                alt={video.title}
                fill
                className="object-cover transition-transform group-hover:scale-105"
              />
              <div className="absolute bottom-1 right-1 rounded bg-black/80 px-1 text-xs text-white">
                {video.duration}
              </div>
            </div>
            <div className="flex-1">
              <h4 className="line-clamp-2 text-sm font-medium">
                {video.title}
              </h4>
              <p className="mt-1 text-xs text-muted-foreground">
                {video.channelTitle}
              </p>
              <p className="text-xs text-muted-foreground">
                {video.viewCount} views •{" "}
                {formatDistanceToNow(new Date(video.publishedAt), {
                  addSuffix: true,
                })}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
