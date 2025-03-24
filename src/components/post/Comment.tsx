'use client';

import { useState } from 'react';
import { Comment } from '@/types/post';
import { useAuth } from '@/hooks/useAuth';
import { postService } from '@/services/post';
import { toast } from 'react-hot-toast';
import Link from 'next/link';

interface CommentProps {
  comment: Comment;
  postId: number;
  onDelete: (commentId: number) => void;
  onReply: (parentCommentId: number, content: string) => void;
  onUpdate?: (commentId: number) => void;
}

// 날짜 포맷팅 함수 추가
const formatDateTime = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  }).format(date);
};

export default function CommentComponent({ comment, postId, onDelete, onReply, onUpdate }: CommentProps) {
  const { user } = useAuth();
  const [isReplying, setIsReplying] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);

  const handleReplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyContent.trim()) return;
    
    onReply(comment.id, replyContent);
    setReplyContent('');
    setIsReplying(false);
  };

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editContent.trim()) return;

    try {
      await postService.updateComment(postId, comment.id, editContent);
      setIsEditing(false);
      if (onUpdate) onUpdate(comment.id);
      toast.success('댓글이 수정되었습니다.');
    } catch (error) {
      console.error('댓글 수정 실패:', error);
      toast.error('댓글 수정에 실패했습니다.');
    }
  };

  return (
    <div className={`${comment.parentCommentId ? 'ml-8' : ''} space-y-4`}>
      <div className="bg-gray-50 rounded-lg p-4">
        {/* 댓글 내용 */}
        {isEditing ? (
          <form onSubmit={handleUpdateSubmit} className="space-y-2">
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              rows={3}
            />
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-3 py-1 text-sm text-gray-600 hover:text-gray-700"
              >
                취소
              </button>
              <button
                type="submit"
                className="px-3 py-1 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700"
              >
                수정완료
              </button>
            </div>
          </form>
        ) : (
          <>
            <div className="flex justify-between items-start">
              <div>
                <Link href={`/${comment.user.username}`} className="font-medium text-gray-900 hover:text-indigo-600">
                  {comment.user.name}
                </Link>
                <p className="mt-1 text-gray-700">{comment.content}</p>
                <div className="mt-2 text-sm text-gray-500 flex items-center gap-2">
                  <span>{formatDateTime(comment.modifiedAt)}</span>
                  {comment.createdAt !== comment.modifiedAt && (
                    <span className="text-gray-400">(수정됨)</span>
                  )}
                </div>
              </div>
              {user?.id === comment.user.id && (
                <div className="flex space-x-2 text-sm">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="text-gray-600 hover:text-indigo-600"
                  >
                    수정
                  </button>
                  <button
                    onClick={() => onDelete(comment.id)}
                    className="text-gray-600 hover:text-red-600"
                  >
                    삭제
                  </button>
                </div>
              )}
            </div>
            {!comment.parentCommentId && (
              <button
                onClick={() => setIsReplying(!isReplying)}
                className="mt-2 text-sm text-indigo-600 hover:text-indigo-700"
              >
                답글달기
              </button>
            )}
          </>
        )}
      </div>

      {/* 답글 작성 폼 */}
      {isReplying && (
        <form onSubmit={handleReplySubmit} className="ml-8 space-y-2">
          <textarea
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            placeholder="답글을 입력하세요"
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            rows={2}
          />
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => setIsReplying(false)}
              className="px-3 py-1 text-sm text-gray-600 hover:text-gray-700"
            >
              취소
            </button>
            <button
              type="submit"
              className="px-3 py-1 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700"
            >
              답글작성
            </button>
          </div>
        </form>
      )}

      {/* 답글 목록 */}
      {comment.replies?.map((reply) => (
        <CommentComponent
          key={reply.id}
          comment={reply}
          postId={postId}
          onDelete={onDelete}
          onReply={onReply}
          onUpdate={onUpdate}
        />
      ))}
    </div>
  );
}
