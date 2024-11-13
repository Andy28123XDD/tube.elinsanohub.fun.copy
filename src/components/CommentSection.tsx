import React from 'react';
import { ThumbsUp } from 'lucide-react';
import type { Comment } from '../types';

interface CommentSectionProps {
  comments: Comment[];
}

const CommentSection: React.FC<CommentSectionProps> = ({ comments }) => {
  const getInvidiousIconUrl = (originalUrl: string) => {
    const iconId = originalUrl.split('/').pop()?.split('=')[0];
    if (iconId?.startsWith('A')) {
      return `https://invidious.materialio.us/ggpht/ytc/${iconId}=s88-c-k-c0x00ffffff-no-rj`;
    }
    return `https://invidious.materialio.us/ggpht/${iconId}=s88-c-k-c0x00ffffff-no-rj`;
  };

  return (
    <div className="mt-6">
      <h2 className="text-xl font-bold mb-4">Comments</h2>
      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment.id} className="bg-transparent rounded-md p-3 mb-3 flex items-start">
            <img
              src={getInvidiousIconUrl(comment.authorProfileImageUrl)}
              alt={comment.authorDisplayName}
              className="w-10 h-10 rounded-full mr-3"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-medium">{comment.authorDisplayName}</span>
                <span className="text-sm text-gray-500">{comment.publishedAt}</span>
              </div>
              <p className="mt-1">{comment.textDisplay}</p>
              <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
                <ThumbsUp className="w-4 h-4" />
                <span>{comment.likeCount}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentSection;