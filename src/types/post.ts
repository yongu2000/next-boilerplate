export interface Post {
    id: number;
    title: string;
    content: string;
    likes: number;
    user: {
      id: number;
      username: string;
      name: string;
    };
    comments: Comment[];
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