import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import VideoPlayer from '../components/VideoPlayer';
import VideoCard from '../components/VideoCard';
import CommentSection from '../components/CommentSection';
import { getVideoDetails, searchYouTubeVideos, getVideoComments } from '../services/youtube';
import type { VideoDetails, Video, Comment } from '../types';

const WatchPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const videoId = searchParams.get('v');
  const navigate = useNavigate();
  const [video, setVideo] = useState<VideoDetails | null>(null);
  const [relatedVideos, setRelatedVideos] = useState<Video[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadVideoData = async () => {
      if (!videoId) {
        setError('No video ID provided');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const [videoData, commentsData] = await Promise.all([
          getVideoDetails(videoId),
          getVideoComments(videoId)
        ]);

        setVideo(videoData);
        setComments(commentsData.items || []);

        // Search for related videos using the video title
        const { items } = await searchYouTubeVideos(videoData.title);
        // Filter out the current video from related videos
        const filteredVideos = items.filter(item => item.id !== videoId);
        setRelatedVideos(filteredVideos);
      } catch (error) {
        console.error('Error loading video data:', error);
        setError('This video is unavailable. Please try another video.');
        setTimeout(() => navigate('/'), 3000); // Redirect to home after 3 seconds
      } finally {
        setLoading(false);
      }
    };

    loadVideoData();
  }, [videoId, navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">{error}</h2>
          <p className="text-gray-600">Redirecting to homepage...</p>
        </div>
      </div>
    );
  }

  if (!video) {
    return null;
  }

  return (
    <div className="max-w-[1800px] mx-auto px-4 py-6 flex flex-col lg:flex-row gap-6">
      <div className="flex-1">
        <VideoPlayer video={video} />
        <CommentSection comments={comments} />
      </div>
      
      <div className="w-full lg:w-[400px] flex-shrink-0">
        <h2 className="text-lg font-semibold mb-4">Related Videos</h2>
        <div className="space-y-3">
          {relatedVideos.map((video) => (
            <VideoCard key={video.id} video={video} compact />
          ))}
        </div>
      </div>
    </div>
  );
};

export default WatchPage;