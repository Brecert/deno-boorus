import * as e9 from "./boorus/e926.ts";
import * as db from "./boorus/danbooru.ts";
import * as sb from "./boorus/safebooru.ts";

type ValueOf<T> = T[];

export const boorus = [e9, db, sb];
export type Boorus = typeof boorus[number];

export function findBooru(alias: string) {
  return boorus.find((b) =>
    b.site.aliases.includes(alias) || b.site.endpoint === alias
  );
}
