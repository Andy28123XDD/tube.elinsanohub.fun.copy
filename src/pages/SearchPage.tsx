import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import VideoCard from '../components/VideoCard';
import { searchYouTubeVideos } from '../services/youtube';
import type { Video } from '../types';

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(false);
  const [nextPageToken, setNextPageToken] = useState<string | null>(null);

  useEffect(() => {
    if (query) {
      loadSearchResults();
    }
  }, [query]);

  const loadSearchResults = async (token?: string | null) => {
    setLoading(true);
    try {
      const { items, nextPageToken: newToken } = await searchYouTubeVideos(query, token);
      setVideos(prev => token ? [...prev, ...items] : items);
      setNextPageToken(newToken);
    } catch (error) {
      console.error('Error searching videos:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    if (nextPageToken) {
      loadSearchResults(nextPageToken);
    }
  };

  if (loading && videos.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">Search Results for "{query}"</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.map((video) => (
          <VideoCard key={video.id} video={video} />
        ))}
      </div>
      {nextPageToken && (
        <div className="mt-8 flex justify-center">
          <button
            onClick={loadMore}
            disabled={loading}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-full font-medium transition-colors duration-200 disabled:opacity-50"
          >
            {loading ? 'Loading...' : 'Load More'}
          </button>
        </div>
      )}
    </div>
  );
};

export default SearchPage;