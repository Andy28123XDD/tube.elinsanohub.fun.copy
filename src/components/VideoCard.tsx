import React from 'react';
import { Link } from 'react-router-dom';
import type { Video } from '../types';

interface VideoCardProps {
  video: Video;
  compact?: boolean;
  isShort?: boolean;
}

const VideoCard: React.FC<VideoCardProps> = ({ video, compact, isShort }) => {
  const thumbnailUrl = `https://invidious.materialio.us/vi/${video.id}/mqdefault.jpg`;

  if (isShort) {
    return (
      <div className="block aspect-[9/16] relative rounded-xl overflow-hidden group">
        <Link to={`/watch?v=${video.id}`}>
          <img
            src={thumbnailUrl}
            alt={video.title}
            className="w-full h-full object-cover"
          />
        </Link>
        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
          <Link to={`/watch?v=${video.id}`}>
            <h3 className="text-white text-sm font-semibold line-clamp-2">{video.title}</h3>
          </Link>
          <Link
            to={`/channel/${video.channelId}`}
            className="text-white/80 text-xs mt-1 hover:text-white block"
          >
            {video.channelTitle}
          </Link>
          <p className="text-white/80 text-xs mt-1">{video.viewCount} views</p>
        </div>
      </div>
    );
  }

  if (compact) {
    return (
      <div className="flex gap-3 hover:bg-gray-100 p-2 rounded-lg transition-colors">
        <Link to={`/watch?v=${video.id}`} className="shrink-0">
          <img
            src={thumbnailUrl}
            alt={video.title}
            className="w-40 aspect-video object-cover rounded-lg"
          />
        </Link>
        <div className="flex-1 min-w-0">
          <Link to={`/watch?v=${video.id}`}>
            <h3 className="text-sm font-semibold line-clamp-2 hover:text-blue-600">{video.title}</h3>
          </Link>
          <Link
            to={`/channel/${video.channelId}`}
            className="text-xs text-gray-600 mt-1 hover:text-black block"
          >
            {video.channelTitle}
          </Link>
          <div className="flex items-center text-xs text-gray-500 mt-1">
            <span>{video.viewCount} views</span>
            <span className="mx-1">•</span>
            <span>{video.publishedAt}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200">
      <Link to={`/watch?v=${video.id}`}>
        <img
          src={thumbnailUrl}
          alt={video.title}
          className="w-full aspect-video object-cover"
        />
      </Link>
      <div className="p-4">
        <Link to={`/watch?v=${video.id}`}>
          <h3 className="text-lg font-semibold line-clamp-2 hover:text-blue-600">{video.title}</h3>
        </Link>
        <Link
          to={`/channel/${video.channelId}`}
          className="text-sm text-gray-600 hover:text-black block mt-2"
        >
          {video.channelTitle}
        </Link>
        <div className="mt-2 flex items-center text-sm text-gray-500">
          <span>{video.viewCount} views</span>
          <span className="mx-2">•</span>
          <span>{video.publishedAt}</span>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;