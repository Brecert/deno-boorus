// deno-lint-ignore-file
import uri from "https://raw.githubusercontent.com/Brecert/mouri/main/mod.ts";
import { BooruSite, ConvertFn, SearchFn, SearchRawFn } from "../types.ts";

export const site: BooruSite = {
  host: "e926.net",
  endpoint: "/posts.json?",
  aliases: ["e9", "e926"],
  random: true,
  nsfw: false,
};

export interface PostFile {
  size: number;
  width: number;
  height: number;
  ext: string;
  md5: string;
  url: string;
}

export interface PostPreview {
  width: number;
  height: number;
  url: string;
}

export interface PostSample {
  width: number;
  height: number;
  url: string;
  alternates: unknown;
}

export interface PostScore {
  up: number;
  down: number;
  total: number;
}

export interface PostTags {
  general: string[];
  species: string[];
  characters: string[];
  copyright: string[];
  artist: string[];
  invalid: string[];
  lore: string[];
  meta: string[];
}

export interface PostFlags {
  pending: boolean;
  flagged: boolean;
  note_locked: boolean;
  status_locked: boolean;
  rating_locked: boolean;
  deleted: boolean;
}

export type PostRating = "s" | string;

export interface PostRelationships {
  parent_id: number | null;
  has_children: boolean;
  has_active_children: boolean;
  children: unknown[];
}

export interface PostData {
  id: number;
  created_at: string;
  updated_at: string;
  file: PostFile;
  preview: PostPreview;
  sample: PostSample;
  score: PostScore;
  tags: PostTags;
  locked_tags: string[];
  change_seq: number;
  flags: PostTags;
  rating: PostRating;
  fav_count: number;
  sources: string[];
  pools: unknown[];
  approver_id: number | null;
  uploader_id: number;
  description: string;
  comment_count: number;
  is_favorited: boolean;
  has_notes: boolean;
  duration: unknown | null;
}

export const convert: ConvertFn<PostData> = (post, options) => ({
  id: post.id,
  tags: Object.values(post.tags).flat(),
  score: post.score.total,
  width: post.file.width,
  height: post.file.height,
  fileURL: post.file.url,
});

export const searchRaw: SearchRawFn<undefined | PostData[]> = async (
  options,
) => {
  const url = uri`https://${site.host}${[site.endpoint]}${{
    tags: options.tags.join("+"),
    limit: options.limit.toPrecision(1),
    random: options.random ?? true,
  }}`;

  return fetch(url).then((res) => res.json());
};

export const search: SearchFn = (options) =>
  searchRaw(options).then((p) => p?.map((p) => convert(p, options)));
