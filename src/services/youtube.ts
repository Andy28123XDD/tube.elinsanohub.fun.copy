const YOUTUBE_API_KEY = 'AIzaSyB3tYpQkf6NIrB_iO3XNb2zzo7HqvRPd28';
const YOUTUBE_API_BASE = 'https://www.googleapis.com/youtube/v3';

export const searchYouTubeVideos = async (query: string, pageToken?: string | null) => {
  try {
    const searchParams = new URLSearchParams({
      part: 'snippet',
      maxResults: '12',
      q: query,
      type: 'video',
      key: YOUTUBE_API_KEY,
    });

    if (pageToken) {
      searchParams.append('pageToken', pageToken);
    }

    const searchResponse = await fetch(`${YOUTUBE_API_BASE}/search?${searchParams}`);
    const searchData = await searchResponse.json();

    if (!searchResponse.ok) {
      throw new Error(searchData.error?.message || 'Failed to fetch videos');
    }

    const videoIds = searchData.items.map((item: any) => item.id.videoId).join(',');

    const videoParams = new URLSearchParams({
      part: 'snippet,statistics',
      id: videoIds,
      key: YOUTUBE_API_KEY,
    });

    const videoResponse = await fetch(`${YOUTUBE_API_BASE}/videos?${videoParams}`);
    const videoData = await videoResponse.json();

    if (!videoResponse.ok) {
      throw new Error(videoData.error?.message || 'Failed to fetch video details');
    }

    return {
      items: videoData.items.map((item: any) => ({
        id: item.id,
        title: item.snippet.title,
        description: item.snippet.description,
        thumbnail: item.snippet.thumbnails.high.url,
        channelId: item.snippet.channelId,
        channelTitle: item.snippet.channelTitle,
        publishedAt: new Date(item.snippet.publishedAt).toLocaleDateString(),
        viewCount: formatViewCount(item.statistics.viewCount),
      })),
      nextPageToken: searchData.nextPageToken || null,
    };
  } catch (error) {
    console.error('Search error:', error);
    throw error;
  }
};

export const getTrendingVideos = async (pageToken?: string | null) => {
  try {
    const params = new URLSearchParams({
      part: 'snippet,statistics,contentDetails',
      chart: 'mostPopular',
      maxResults: '12',
      key: YOUTUBE_API_KEY,
      regionCode: 'US',
    });

    if (pageToken) {
      params.append('pageToken', pageToken);
    }

    const response = await fetch(`${YOUTUBE_API_BASE}/videos?${params}`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to fetch trending videos');
    }

    return {
      items: data.items.map((item: any) => ({
        id: item.id,
        title: item.snippet.title,
        description: item.snippet.description,
        thumbnail: item.snippet.thumbnails.high.url,
        channelId: item.snippet.channelId,
        channelTitle: item.snippet.channelTitle,
        publishedAt: new Date(item.snippet.publishedAt).toLocaleDateString(),
        viewCount: formatViewCount(item.statistics.viewCount),
        duration: parseDuration(item.contentDetails.duration),
      })),
      nextPageToken: data.nextPageToken || null,
    };
  } catch (error) {
    console.error('Trending error:', error);
    throw error;
  }
};

export const getVideoDetails = async (videoId: string) => {
  try {
    const videoParams = new URLSearchParams({
      part: 'snippet,statistics',
      id: videoId,
      key: YOUTUBE_API_KEY,
    });

    const videoResponse = await fetch(`${YOUTUBE_API_BASE}/videos?${videoParams}`);
    const videoData = await videoResponse.json();

    if (!videoResponse.ok || !videoData.items?.[0]) {
      throw new Error(videoData.error?.message || 'Video not found');
    }

    const video = videoData.items[0];
    const channelId = video.snippet.channelId;

    const channelParams = new URLSearchParams({
      part: 'snippet,statistics',
      id: channelId,
      key: YOUTUBE_API_KEY,
    });

    const channelResponse = await fetch(`${YOUTUBE_API_BASE}/channels?${channelParams}`);
    const channelData = await channelResponse.json();

    if (!channelResponse.ok || !channelData.items?.[0]) {
      throw new Error('Channel information not available');
    }

    const channel = channelData.items[0];

    return {
      id: video.id,
      title: video.snippet.title,
      description: video.snippet.description,
      thumbnail: video.snippet.thumbnails.maxres?.url || video.snippet.thumbnails.high.url,
      videoUrl: `https://www.youtube.com/embed/${video.id}`,
      channelId: channel.id,
      channelTitle: channel.snippet.title,
      channelThumbnail: channel.snippet.thumbnails.default.url,
      isVerified: channel.snippet.customUrl != null,
      subscriberCount: formatSubscriberCount(channel.statistics.subscriberCount),
      viewCount: formatViewCount(video.statistics.viewCount),
      publishedAt: new Date(video.snippet.publishedAt).toLocaleDateString(),
    };
  } catch (error) {
    console.error('Video details error:', error);
    throw error;
  }
};

export const getChannelDetails = async (channelId: string) => {
  try {
    const params = new URLSearchParams({
      part: 'snippet,statistics,brandingSettings',
      id: channelId,
      key: YOUTUBE_API_KEY,
    });

    const response = await fetch(`${YOUTUBE_API_BASE}/channels?${params}`);
    const data = await response.json();

    if (!response.ok || !data.items?.[0]) {
      throw new Error('Channel not found');
    }

    const channel = data.items[0];
    return {
      id: channel.id,
      title: channel.snippet.title,
      description: channel.snippet.description,
      thumbnail: channel.snippet.thumbnails.high.url,
      bannerUrl: channel.brandingSettings.image?.bannerExternalUrl,
      subscriberCount: formatSubscriberCount(channel.statistics.subscriberCount),
      videoCount: parseInt(channel.statistics.videoCount).toLocaleString(),
      isVerified: channel.snippet.customUrl != null,
    };
  } catch (error) {
    console.error('Channel details error:', error);
    throw error;
  }
};

export const getChannelVideos = async (channelId: string, pageToken?: string) => {
  try {
    const searchParams = new URLSearchParams({
      part: 'snippet',
      channelId,
      order: 'date',
      maxResults: '30',
      type: 'video',
      key: YOUTUBE_API_KEY,
    });

    if (pageToken) {
      searchParams.append('pageToken', pageToken);
    }

    const searchResponse = await fetch(`${YOUTUBE_API_BASE}/search?${searchParams}`);
    const searchData = await searchResponse.json();

    if (!searchResponse.ok) {
      throw new Error('Failed to fetch channel videos');
    }

    const videoIds = searchData.items.map((item: any) => item.id.videoId).join(',');
    const videoParams = new URLSearchParams({
      part: 'snippet,statistics,contentDetails',
      id: videoIds,
      key: YOUTUBE_API_KEY,
    });

    const videoResponse = await fetch(`${YOUTUBE_API_BASE}/videos?${videoParams}`);
    const videoData = await videoResponse.json();

    return {
      items: videoData.items.map((item: any) => ({
        id: item.id,
        title: item.snippet.title,
        description: item.snippet.description,
        thumbnail: item.snippet.thumbnails.high.url,
        channelTitle: item.snippet.channelTitle,
        channelId: item.snippet.channelId,
        publishedAt: new Date(item.snippet.publishedAt).toLocaleDateString(),
        viewCount: formatViewCount(item.statistics.viewCount),
        duration: parseDuration(item.contentDetails.duration),
      })),
      nextPageToken: searchData.nextPageToken || null,
    };
  } catch (error) {
    console.error('Channel videos error:', error);
    throw error;
  }
};

export const getVideoComments = async (videoId: string) => {
  try {
    const params = new URLSearchParams({
      part: 'snippet',
      videoId,
      order: 'relevance',
      maxResults: '50',
      key: YOUTUBE_API_KEY,
    });

    const response = await fetch(`${YOUTUBE_API_BASE}/commentThreads?${params}`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to fetch comments');
    }

    return {
      items: data.items.map((item: any) => ({
        id: item.id,
        authorDisplayName: item.snippet.topLevelComment.snippet.authorDisplayName,
        authorProfileImageUrl: item.snippet.topLevelComment.snippet.authorProfileImageUrl,
        textDisplay: item.snippet.topLevelComment.snippet.textDisplay,
        likeCount: formatLikeCount(item.snippet.topLevelComment.snippet.likeCount),
        publishedAt: formatCommentDate(item.snippet.topLevelComment.snippet.publishedAt),
      })),
    };
  } catch (error) {
    console.error('Comments error:', error);
    return { items: [] };
  }
};

const formatViewCount = (count: string) => {
  const num = parseInt(count, 10);
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toString();
};

const formatSubscriberCount = (count: string) => {
  const num = parseInt(count, 10);
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toString();
};

const formatLikeCount = (count: number) => {
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K`;
  }
  return count.toString();
};

const formatCommentDate = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 1) return 'yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
  return `${Math.floor(diffDays / 365)} years ago`;
};

const parseDuration = (duration: string) => {
  const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
  let hours = 0;
  let minutes = 0;
  let seconds = 0;

  if (match) {
    if (match[1]) hours = parseInt(match[1].slice(0, -1));
    if (match[2]) minutes = parseInt(match[2].slice(0, -1));
    if (match[3]) seconds = parseInt(match[3].slice(0, -1));
  }

  return hours * 3600 + minutes * 60 + seconds;
};