export type User = {
    id?: string; // UUID
    username: string;
    email: string;
    mobile_number: string;
    profile_image?: string;
    country?: string
  };
  
  export interface SocialLinks {
    [key: string]: string; // To allow additional social platforms
  }
  export type Author = {
    id?: number;
    name: string;
    country?: string;
    author_type?: string;
    number_of_books?: number;
    about_author?: string;
    social_links?: SocialLinks // JSONB field as an object
    avator: string | any
  };
  
// id integer generated always as identity not null,
// book_cover text null,
// author_id integer not null,
// rating numeric(3, 2) null default 0.0,
// language character varying(50) null,
// audio boolean null default false,
// pages integer null,
// description text null,
// download_pdf text null,
// paid boolean null default false,
// category character varying(100) null,
// title text null,

  export  type Book = {
    id?: number;
    title: string;
    book_cover?: string;
    author_id: number;
    rating: number;
    language?: string;
    audio: string;
    pages?: number;
    description?: string;
    download_pdf?: string;
    paid: boolean;
    category?: string;
  };

export type Category = {
  id?: string,
  category_name: string,
  category_image: string | any,
  created_at?: string,
}
  
export type Review = {
    id?: number;
    user_id: string; // UUID
    book_id: number;
    rating: number;
    created_at: string; // ISO date string
    comment?: string;
  };
  
export type Database = {
    users: User;
    authors: Author;
    books: Book;
    reviews: Review;
    category: Category;
  };
  