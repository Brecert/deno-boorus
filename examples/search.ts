import * as boorus from "../boorus.ts";

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
      break main
    }
  } catch (err) {
    console.error(err);
    console.log("Try again.");
  }
}
