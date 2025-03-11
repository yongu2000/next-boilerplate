export interface Post {
    id: number;
    title: string;
    content: string;
    likes: number;
    viewCounts: number;
    user: {
      id: number;
      username: string;
      name: string;
    };
    comments: Comment[];
    createdAt: string;
    modifiedAt: string;
  }

    // types/post.ts
  export interface PostSummary {
    id: number;
    title: string;
    content: string;
    likes: number;
    viewCounts: number;  // 추가
    user: {
        id: number;
        username: string;
        name: string;
    };
    commentCounts: number;
    createdAt: string;
    modifiedAt: string;
}
  
  export interface Comment {
    id: number;
    content: string;
    user: {
      id: number;
      name: string;
    };
    parentCommentId: number | null;
    replies: Comment[];
    createdAt: string;
    modifiedAt: string;
  }

  export interface CursorResponse<T> {
    items: T[];
    nextCursor: number | null;
    hasNext: boolean;
}



export interface PostPage {
  content: PostSummary[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}