import React, { useState, useEffect } from 'react';
import { Flame } from 'lucide-react';
import VideoCard from '../components/VideoCard';
import { getTrendingVideos } from '../services/youtube';
import type { Video } from '../types';

function HomePage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(false);
  const [nextPageToken, setNextPageToken] = useState<string | null>(null);

  useEffect(() => {
    loadTrendingVideos();
  }, []);

  const loadTrendingVideos = async (token?: string | null) => {
    setLoading(true);
    try {
      const { items, nextPageToken: newToken } = await getTrendingVideos(token);
      setVideos(prev => token ? [...prev, ...items] : items);
      setNextPageToken(newToken);
    } catch (error) {
      console.error('Error loading trending videos:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = async () => {
    if (!nextPageToken) return;
    await loadTrendingVideos(nextPageToken);
  };

  if (loading && videos.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center mb-6">
          <div className="flex items-center space-x-2">
            <Flame className="h-6 w-6 text-red-600" />
            <h2 className="text-xl font-semibold text-gray-900">Trending Now</h2>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video, index) => (
            <VideoCard key={`${video.id}-${index}`} video={video} />
          ))}
        </div>
        
        {videos.length > 0 && nextPageToken && (
          <div className="mt-8 flex justify-center">
            <button
              onClick={loadMore}
              disabled={loading}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-full font-medium transition-colors duration-200 disabled:opacity-50 flex items-center space-x-2"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                'Load More'
              )}
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

export default HomePage;