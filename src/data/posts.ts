import postData from "./posts.json";

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  publishedAt: string;
};

export const blogPosts = postData as BlogPost[];
