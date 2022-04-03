import uri from "https://raw.githubusercontent.com/Brecert/mouri/main/mod.ts";
import { BooruSite, ConvertFn, SearchFn, SearchRawFn } from "../types.ts";

export const site: BooruSite = {
  host: "danbooru.donmai.us",
  endpoint: "/posts.json?",
  aliases: ["db", "dan", "danbooru"],
  random: true,
  nsfw: true,
};

export interface PostData {
  id: number;

  rating: "s" | string;
  md5: string;
  created_at: string;
  uploader_id: number;
  source: string;
  last_comment_bumped_at: null | unknown;

  is_note_locked: boolean;
  fav_count: number;
  file_ext: string;
  last_noted_at: null | unknown;
  is_rating_locked: boolean;
  parent_id: number;
  has_children: boolean;
  approver_id: number | null;

  file_size: number;
  is_status_locked: boolean;
  pool_string: string;
  is_pending: boolean;
  is_flagged: boolean;
  is_deleted: boolean;
  updated_at: string;
  is_banned: boolean;
  pixiv_id: number | null;
  last_commented_at: null | unknown;
  has_active_children: boolean;
  bit_flags: number;
  has_large: boolean;
  has_visible_children: boolean;

  score: number;
  up_score: number;
  down_score: number;

  tag_count: number;
  tag_string: string;

  tag_count_general: number;
  tag_count_character: number;
  tag_count_copyright: number;
  tag_count_artists: number;
  tag_count_meta: number;

  tag_string_general: string;
  tag_string_character: string;
  tag_string_copyright: string;
  tag_string_artists: string;
  tag_string_meta: string;

  image_width: number;
  image_height: number;

  file_url: string;
  large_file_url: string;
  preview_file_url: string;
}

export const convert: ConvertFn<PostData> = (post, _options) => ({
  id: post.id,
  tags: post.tag_string.split(" "),
  score: post.score,
  width: post.image_width,
  height: post.image_height,
  fileURL: post.file_url,
});

export const searchRaw: SearchRawFn<PostData[]> = (options) => {
  const url = uri`https://${site.host}${[site.endpoint]}${{
    tags: options.tags.join(" "),
    limit: options.limit.toPrecision(1),
    random: options.random ?? true,
  }}`;

  return fetch(url).then((res) => res.json());
};

export const search: SearchFn = (options) =>
  searchRaw(options).then((p) => p.map((p) => convert(p, options)));
