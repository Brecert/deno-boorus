// deno-lint-ignore-file
import uri from "https://raw.githubusercontent.com/Brecert/mouri/main/mod.ts";
import { BooruSite, ConvertFn, SearchFn, SearchRawFn } from "../types.ts";

export const site: BooruSite = {
  host: "safebooru.org",
  endpoint: "/index.php?page=dapi&s=post&q=index&json=1&",
  aliases: ["safebooru", "safe", "sb"],
  random: false,
  nsfw: false,
};

export type PostData = {
  id: number;
  hash: string;

  width: number;
  height: number;

  tags: string;
  score: number;
  change: number;
  image: string;
  rating: string;

  directory: string;

  sample: boolean;
  sample_height: number;
  sample_width: number;

  owner: string;
};

export const convert: ConvertFn<PostData> = (post, options) => ({
  id: post.id,
  tags: post.tags.split(" "),
  score: post.score,
  width: post.width,
  height: post.height,
  fileURL:
    `https://${site.host}/images/${post.directory}/${post.image}`,
});

export const searchRaw: SearchRawFn<PostData[]> = async (options) => {
  if(options.random) {
    console.warn('Safebooru does not have random.')
  }

  const url = uri`https://${site.host}${[site.endpoint]}${{
    tags: options.tags.join("+"),
    limit: options.limit.toPrecision(1),
    random: options.random.toString()
  }}`;

  console.log(url)
  const res = await fetch(url);
  return res.json();
};

export const search: SearchFn = (options) =>
  searchRaw(options).then((p) => p.map((p) => convert(p, options)));
