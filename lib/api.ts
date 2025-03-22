import type { Comment, Video } from "@/types";

const BASE_URL = "https://youtube.googleapis.com/youtube/v3";

// Helper function to convert YouTube duration (ISO 8601) to readable format
const formatDuration = (isoDuration: string): string => {
  const match = isoDuration?.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
  if (!match) return "0:00";

  const hours = parseInt(match[1] || "0");
  const minutes = parseInt(match[2] || "0");
  const seconds = parseInt(match[3] || "0");

  if (hours) {
    return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  }
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

// Helper function to format view/like counts
const formatCount = (count: number): string => {
  if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1)}M`;
  if (count >= 1_000) return `${(count / 1_000).toFixed(1)}K`;
  return count.toString();
};

type YouTubeSearchItem = {
  id: { videoId: string };
  snippet: {
    title: string;
    description: string;
    thumbnails: { medium: { url: string } };
    channelTitle: string;
    publishedAt: string;
  };
};

type YouTubeVideoItem = {
  id: string;
  snippet: {
    title: string;
    description: string;
    thumbnails: { medium: { url: string } };
    channelTitle: string;
    publishedAt: string;
    categoryId: string;
  };
  contentDetails: { duration: string };
  statistics: { viewCount: string; likeCount: string };
};

type YouTubeCommentItem = {
  id: string;
  snippet: {
    topLevelComment: {
      snippet: {
        textDisplay: string;
        authorDisplayName: string;
        authorProfileImageUrl: string;
        likeCount: number;
        publishedAt: string;
      };
    };
  };
};

export const fetchVideos = async (searchQuery: string, pageToken?: string) => {
  try {
    const response = await fetch(
      `${BASE_URL}/search?q=${encodeURIComponent(searchQuery)}&part=snippet&type=video&maxResults=20&pageToken=${pageToken || ""}&key=${process.env.NEXT_PUBLIC_GOOGLE_API_KEY}`,
    );

    if (!response.ok) throw new Error("Failed to fetch videos");

    const data = await response.json();
    const videoIds = data.items
      .map((item: { id: { videoId: string } }) => item.id.videoId)
      .join(",");
    const detailsResponse = await fetch(
      `${BASE_URL}/videos?part=snippet,contentDetails,statistics&id=${videoIds}&key=${process.env.NEXT_PUBLIC_GOOGLE_API_KEY}`,
    );

    if (!detailsResponse.ok) throw new Error("Failed to fetch video details");

    const detailsData = await detailsResponse.json();

    return {
      videos: detailsData.items.map((item: any) => ({
        id: item.id,
        title: item.snippet.title,
        description: item.snippet.description,
        thumbnail: item.snippet.thumbnails.medium.url,
        channelTitle: item.snippet.channelTitle,
        publishedAt: item.snippet.publishedAt,
        duration: item.contentDetails.duration,
        viewCount: item.statistics.viewCount,
        likeCount: item.statistics.likeCount,
      })),
      nextPageToken: data.nextPageToken || null,
    };
  } catch (error) {
    console.error("Error fetching videos:", error);
    return { videos: [], nextPageToken: null };
  }
};

export const fetchVideoById = async (id: string): Promise<Video | null> => {
  try {
    const response = await fetch(
      `${BASE_URL}/videos?part=snippet,contentDetails,statistics&id=${id}&key=${process.env.NEXT_PUBLIC_GOOGLE_API_KEY}`,
    );

    if (!response.ok) throw new Error("Failed to fetch video");

    const data = await response.json();
    if (!data.items.length) return null;

    const item: YouTubeVideoItem = data.items[0];
    return {
      id: item.id,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnail: item.snippet.thumbnails.medium.url,
      channelTitle: item.snippet.channelTitle,
      channelThumbnail: "",
      publishedAt: item.snippet.publishedAt,
      duration: formatDuration(item.contentDetails.duration),
      viewCount: formatCount(parseInt(item.statistics.viewCount)),
      likeCount: formatCount(parseInt(item.statistics.likeCount)),
      subscriberCount: "",
    };
  } catch (error) {
    console.error("Error fetching video:", error);
    return null;
  }
};

export const fetchRelatedVideos = async (videoId: string): Promise<Video[]> => {
  try {
    const videoDetailsUrl = `${BASE_URL}/videos?part=snippet&id=${videoId}&key=${process.env.NEXT_PUBLIC_GOOGLE_API_KEY}`;
    const videoDetailsResponse = await fetch(videoDetailsUrl);
    if (!videoDetailsResponse.ok)
      throw new Error("Failed to fetch video details");

    const videoDetailsData = await videoDetailsResponse.json();
    if (!videoDetailsData.items.length) return [];

    const categoryId = videoDetailsData.items[0].snippet.categoryId;

    const categoryVideosUrl = `${BASE_URL}/search?part=snippet&type=video&videoCategoryId=${categoryId}&maxResults=5&key=${process.env.NEXT_PUBLIC_GOOGLE_API_KEY}`;
    const categoryResponse = await fetch(categoryVideosUrl);
    if (!categoryResponse.ok)
      throw new Error("Failed to fetch category videos");

    const categoryData = await categoryResponse.json();
    if (!categoryData.items.length) return [];

    const videoIds = categoryData.items
      .map((item: YouTubeSearchItem) => item.id.videoId)
      .join(",");
    const detailsUrl = `${BASE_URL}/videos?part=snippet,contentDetails,statistics&id=${videoIds}&key=${process.env.NEXT_PUBLIC_GOOGLE_API_KEY}`;
    const detailsResponse = await fetch(detailsUrl);
    if (!detailsResponse.ok) throw new Error("Failed to fetch video details");

    const detailsData = await detailsResponse.json();

    return detailsData.items.map((item: YouTubeVideoItem) => ({
      id: item.id,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnail: item.snippet.thumbnails.medium.url,
      channelTitle: item.snippet.channelTitle,
      channelThumbnail: "",
      publishedAt: item.snippet.publishedAt,
      duration: formatDuration(item.contentDetails.duration),
      viewCount: formatCount(parseInt(item.statistics.viewCount)),
      likeCount: formatCount(parseInt(item.statistics.likeCount)),
      subscriberCount: "",
    }));
  } catch (error) {
    console.error("Error fetching related videos:", error);
    return [];
  }
};

export const fetchComments = async (videoId: string): Promise<Comment[]> => {
  try {
    const response = await fetch(
      `${BASE_URL}/commentThreads?part=snippet&videoId=${videoId}&maxResults=20&key=${process.env.NEXT_PUBLIC_GOOGLE_API_KEY}`,
    );

    if (!response.ok) throw new Error("Failed to fetch comments");

    const data = await response.json();

    return data.items.map((item: YouTubeCommentItem) => ({
      id: item.id,
      text: item.snippet.topLevelComment.snippet.textDisplay,
      authorDisplayName: item.snippet.topLevelComment.snippet.authorDisplayName,
      authorProfileImageUrl:
        item.snippet.topLevelComment.snippet.authorProfileImageUrl,
      likeCount: item.snippet.topLevelComment.snippet.likeCount,
      publishedAt: item.snippet.topLevelComment.snippet.publishedAt,
      replies: [],
    }));
  } catch (error) {
    console.error("Error fetching comments:", error);
    return [];
  }
};
