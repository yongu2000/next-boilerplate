import { useState } from 'react';
import { Comment } from '@/types/post';
import { useAuth } from '@/hooks/useAuth';

interface CommentProps {
  comment: Comment;
  postId: number;
  onDelete: (commentId: number) => Promise<void>;
  onReply: (commentId: number, content: string) => Promise<void>;
}

export default function CommentComponent({ comment, postId, onDelete, onReply }: CommentProps) {
  const { user } = useAuth();
  const [isReplying, setIsReplying] = useState(false);
  const [replyContent, setReplyContent] = useState('');

  const handleReplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyContent.trim()) return;

    try {
      await onReply(comment.id, replyContent);
      setReplyContent('');
      setIsReplying(false);
    } catch (error) {
      console.error('댓글 작성 실패:', error);
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex justify-between items-start">
          <div className="flex-grow">
            <div className="flex items-center justify-between">
              <p className="font-medium text-gray-900">{comment.user.name}</p>
              <div className="flex space-x-2">
                {user && (
                  <button
                    onClick={() => setIsReplying(!isReplying)}
                    className="text-indigo-600 hover:text-indigo-700 text-sm"
                  >
                    답글
                  </button>
                )}
                {user?.id === comment.user.id && (
                  <button
                    onClick={() => onDelete(comment.id)}
                    className="text-red-600 hover:text-red-700 text-sm"
                  >
                    삭제
                  </button>
                )}
              </div>
            </div>
            <p className="mt-1 text-gray-600">{comment.content}</p>
            <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
              <span>{new Date(comment.createdAt).toLocaleDateString()}</span>
              {comment.modifiedAt !== comment.createdAt && <span>(수정됨)</span>}
            </div>
          </div>
        </div>
      </div>

      {/* 답글 작성 폼 */}
      {isReplying && (
        <form onSubmit={handleReplySubmit} className="ml-8">
          <textarea
            rows={2}
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            placeholder="답글을 작성해주세요"
            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
          />
          <div className="mt-2 flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => setIsReplying(false)}
              className="px-3 py-1 rounded-md text-sm text-gray-600 hover:text-gray-700"
            >
              취소
            </button>
            <button
              type="submit"
              className="px-3 py-1 rounded-md text-sm bg-indigo-600 text-white hover:bg-indigo-700"
            >
              답글 작성
            </button>
          </div>
        </form>
      )}

      {/* 대댓글 목록 */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="ml-8 space-y-4">
          {comment.replies.map((reply) => (
            <CommentComponent
              key={reply.id}
              comment={reply}
              postId={postId}
              onDelete={onDelete}
              onReply={onReply}
            />
          ))}
        </div>
      )}
    </div>
  );
}
