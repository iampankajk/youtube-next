"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { Bell, ThumbsDown, ThumbsUp } from "lucide-react";

import { Button } from "@/components/ui/button";
import { fetchVideoById } from "@/lib/api";
import type { Video } from "@/types";
import VideoPlayer from "@/components/video-player";
import RelatedVideos from "@/components/related-videos";
import CommentSection from "@/components/comment-section";

/**
 *
 */
export default function WatchPage() {
  const searchParams = useSearchParams();
  const videoId = searchParams.get("v");
  const [video, setVideo] = useState<Video | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (videoId) {
      setLoading(true);
      fetchVideoById(videoId)
        .then((data) => {
          setVideo(data);
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [videoId]);

  if (loading) {
    return <div className="p-6 text-center">Loading video...</div>;
  }

  if (!video) {
    return <div className="p-6 text-center">Video not found</div>;
  }

  return (
    <div className="grid grid-cols-1 gap-6 p-4 md:p-6 lg:grid-cols-3">
      <div className="space-y-4 lg:col-span-2">
        <VideoPlayer videoId={video.id} />

        <div>
          <h1 className="text-xl font-semibold">{video.title}</h1>
          <div className="mt-2 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="size-10 overflow-hidden rounded-full">
                <Image
                  src={video.channelThumbnail || "/placeholder.svg"}
                  alt={video.channelTitle}
                  width={40}
                  height={40}
                  className="object-cover"
                />
              </div>
              <div>
                <h3 className="font-medium">{video.channelTitle}</h3>
                <p className="text-xs text-muted-foreground">
                  {video.subscriberCount} subscribers
                </p>
              </div>
              <Button variant="default" size="sm" className="ml-4">
                Subscribe
              </Button>
              <Button variant="ghost" size="icon" className="ml-1">
                <Bell className="size-5" />
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex overflow-hidden rounded-full border">
                <Button variant="ghost" className="rounded-r-none border-r">
                  <ThumbsUp className="mr-2 size-4" />
                  {video.likeCount}
                </Button>
                <Button variant="ghost" className="rounded-l-none">
                  <ThumbsDown className="size-4" />
                </Button>
              </div>
              <Button variant="ghost">Share</Button>
            </div>
          </div>
        </div>

        <div className="mt-4 rounded-lg bg-muted/50 p-3">
          <div className="flex items-center gap-2 text-sm">
            <span>{video.viewCount} views</span>
            <span>•</span>
            <span>
              {formatDistanceToNow(new Date(video.publishedAt), {
                addSuffix: true,
              })}
            </span>
          </div>
          <p className="mt-2 whitespace-pre-line">{video.description}</p>
        </div>

        <CommentSection videoId={video.id} />
      </div>

      <div>
        <RelatedVideos videoId={video.id} />
      </div>
    </div>
  );
}
