export interface BooruSite {
  host: string;
  endpoint: string;
  aliases: string[];
  random: boolean;
  nsfw: boolean;
}

export interface SearchOptions {
  tags: string[];
  limit: number;
  random: boolean;
}

export interface BooruPost {
  id: number;
  tags: string[];
  score: number;
  width: number;
  height: number;
  fileURL: string;
}

export type ConvertFn<P> = (post: P, options: SearchOptions) => BooruPost;
export type SearchRawFn<P> = (options: SearchOptions) => Promise<P>;
export type SearchFn = SearchRawFn<BooruPost[]>;
