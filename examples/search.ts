import * as boorus from "../boorus.ts";
import * as path from "https://deno.land/std@0.133.0/path/mod.ts";
import * as fs from "https://deno.land/std@0.133.0/fs/mod.ts";
import { writableStreamFromWriter } from "https://deno.land/std@0.133.0/streams/mod.ts";

function selectBooru(message: string) {
  while (true) {
    const input = prompt(message)?.trim() ?? "";
    const booru = boorus.findBooru(input);
    if (booru) return booru;
    console.log(`"${input}" is not a valid booru alias.`);
  }
}

const booru = selectBooru("select a booru (e926, danbooru, safebooru):");

main:
while (true) {
  try {
    const tags = prompt("search tags:")?.trim().split(" ");
    if (!tags) break;

    const results = await booru.search({ limit: 1, tags: tags, random: true });

    if (results.length === 0) {
      console.warn(`No search results found for: ${tags.join(" ")}`);
      continue;
    }

    for (const result of results) {
      console.log(result.fileURL);
      if (confirm("download file?")) {
        const dir = path.join("./", booru.site.host);
        await fs.ensureDir(dir)
        const name = path.basename(result.fileURL);
        const file = await Deno.open(path.join(dir, name), {
          write: true,
          create: true,
        });

        const res = await fetch(result.fileURL);
        await res.body?.pipeTo(writableStreamFromWriter(file));
      }
      break main;
    }
  } catch (err) {
    console.error(err);
    console.log("Try again.");
  }
}
