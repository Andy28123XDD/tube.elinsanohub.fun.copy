import React, { useState, useEffect } from 'react';
import { useParams, Routes, Route, Link, useLocation } from 'react-router-dom';
import { getChannelDetails, getChannelVideos } from '../services/youtube';
import VideoCard from '../components/VideoCard';
import type { Channel, Video } from '../types';

const ChannelPage = () => {
  const { channelId } = useParams<{ channelId: string }>();
  const [channel, setChannel] = useState<Channel | null>(null);
  const [videos, setVideos] = useState<Video[]>([]);
  const [shorts, setShorts] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [nextPageToken, setNextPageToken] = useState<string | null>(null);
  const location = useLocation();
  const isShorts = location.pathname.includes('/shorts');

  useEffect(() => {
    if (channelId) {
      loadChannelData();
    }
  }, [channelId]);

  const loadChannelData = async () => {
    setLoading(true);
    try {
      const channelData = await getChannelDetails(channelId);
      setChannel(channelData);
      const { items, nextPageToken: token } = await getChannelVideos(channelId);
      
      // Separate videos and shorts
      const shortsVideos = items.filter(video => video.duration <= 60);
      const regularVideos = items.filter(video => video.duration > 60);
      
      setVideos(regularVideos);
      setShorts(shortsVideos);
      setNextPageToken(token);
    } catch (error) {
      console.error('Error loading channel:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = async () => {
    if (!nextPageToken) return;
    try {
      const { items, nextPageToken: token } = await getChannelVideos(channelId!, nextPageToken);
      const newVideos = isShorts 
        ? items.filter(video => video.duration <= 60)
        : items.filter(video => video.duration > 60);
      
      if (isShorts) {
        setShorts(prev => [...prev, ...newVideos]);
      } else {
        setVideos(prev => [...prev, ...newVideos]);
      }
      setNextPageToken(token);
    } catch (error) {
      console.error('Error loading more videos:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (!channel) return null;

  return (
    <div>
      <div className="relative">
        {channel.bannerUrl && (
          <img
            src={channel.bannerUrl}
            alt={channel.title}
            className="w-full h-48 object-cover"
          />
        )}
        <div className="absolute -bottom-16 left-8 flex items-end space-x-4">
          <img
            src={channel.thumbnail}
            alt={channel.title}
            className="w-32 h-32 rounded-full border-4 border-white"
          />
        </div>
      </div>

      <div className="mt-20 px-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold">{channel.title}</h1>
            <div className="mt-2 text-gray-600">
              <span>{channel.subscriberCount} subscribers</span>
              <span className="mx-2">•</span>
              <span>{channel.videoCount} videos</span>
            </div>
            <p className="mt-4 max-w-2xl">{channel.description}</p>
          </div>
          <button className="bg-red-600 text-white px-6 py-2 rounded-full font-medium">
            Subscribe
          </button>
        </div>

        <div className="mt-8 border-b">
          <nav className="flex space-x-6">
            <Link
              to={`/channel/${channelId}`}
              className={`pb-3 px-2 ${!isShorts ? 'border-b-2 border-black' : ''}`}
            >
              Videos
            </Link>
            <Link
              to={`/channel/${channelId}/shorts`}
              className={`pb-3 px-2 ${isShorts ? 'border-b-2 border-black' : ''}`}
            >
              Shorts
            </Link>
          </nav>
        </div>

        <div className="mt-6">
          <Routes>
            <Route
              path="/"
              element={
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {videos.map((video, index) => (
                    <VideoCard key={`${video.id}-${index}`} video={video} />
                  ))}
                </div>
              }
            />
            <Route
              path="/shorts"
              element={
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {shorts.map((video, index) => (
                    <VideoCard key={`${video.id}-${index}`} video={video} isShort />
                  ))}
                </div>
              }
            />
          </Routes>

          {nextPageToken && (
            <div className="mt-8 flex justify-center">
              <button
                onClick={loadMore}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-full font-medium"
              >
                Load More
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChannelPage;