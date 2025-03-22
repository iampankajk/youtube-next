import Link from "next/link";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";

import type { Video } from "@/types";

type VideoCardProps = {
  video: Video;
};

/**
 *
 * @param root0
 * @param root0.video
 */
export default function VideoCard({ video }: VideoCardProps) {
  return (
    <Link href={`/watch?v=${video.id}`} className="group">
      <div className="relative mb-2 aspect-video overflow-hidden rounded-lg">
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
      <div className="flex gap-2">
        <div className="size-9 shrink-0 overflow-hidden rounded-full">
          <Image
            src={video.channelThumbnail || "/placeholder.svg"}
            alt={video.channelTitle}
            width={36}
            height={36}
            className="object-cover"
          />
        </div>
        <div>
          <h3 className="line-clamp-2 text-sm font-medium">{video.title}</h3>
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
      </div>
    </Link>
  );
}
