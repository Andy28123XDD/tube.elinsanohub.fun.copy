import React from 'react';
import { CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { VideoDetails } from '../types';

interface VideoPlayerProps {
  video: VideoDetails;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ video }) => {
  const thumbnailUrl = `https://invidious.materialio.us/vi/${video.id}/hqdefault.jpg`;

  return (
    <div className="flex-1">
      <div className="aspect-video bg-black">
        <iframe
          src={video.videoUrl}
          className="w-full h-full"
          title={video.title}
          allowFullScreen
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        />
      </div>
      
      <div className="mt-4">
        <h1 className="text-xl font-bold">{video.title}</h1>
        
        <div className="mt-4 flex items-start gap-4">
          <Link to={`/channel/${video.channelId}`}>
            <img
              src={video.channelThumbnail}
              alt={video.channelTitle}
              className="w-12 h-12 rounded-full hover:opacity-90 transition-opacity"
            />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <Link 
                to={`/channel/${video.channelId}`}
                className="font-medium hover:text-blue-600 transition-colors"
              >
                {video.channelTitle}
              </Link>
              {video.isVerified && (
                <CheckCircle className="w-4 h-4 text-gray-500" />
              )}
            </div>
            <p className="text-sm text-gray-600">{video.subscriberCount} subscribers</p>
          </div>
        </div>

        <div className="mt-4 bg-gray-100 rounded-xl p-4">
          <div className="flex items-center gap-2 text-sm text-gray-700 mb-2">
            <span>{video.viewCount} views</span>
            <span>•</span>
            <span>{video.publishedAt}</span>
          </div>
          <p className="text-sm whitespace-pre-wrap">{video.description}</p>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;