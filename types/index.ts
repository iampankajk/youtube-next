export interface Video {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  channelTitle: string;
  channelThumbnail: string;
  publishedAt: string;
  duration: string;
  viewCount: string;
  likeCount: string;
  subscriberCount: string;
}

export interface Comment {
  id: string;
  text: string;
  authorDisplayName: string;
  authorProfileImageUrl: string;
  likeCount: number;
  publishedAt: string;
  replies?: Comment[];
}
