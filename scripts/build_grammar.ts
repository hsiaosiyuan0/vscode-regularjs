import globSync from "glob";
import { safeLoad } from "js-yaml";
import { promises } from "fs";
import { parse, ParsedPath } from "path";
import { promisify } from "util";

const filesPattern = "syntaxes/**/*.yaml";

const read = promises.readFile;
const write = promises.writeFile;
const glob = promisify(globSync);

function outName(p: ParsedPath) {
  return p.dir + "/" + p.name + ".tmLanguage.json";
}

async function process(file: string) {
  const p = parse(file);
  const y = await read(file);
  const out = JSON.stringify(safeLoad(y.toString()), null, 2);
  return write(outName(p), out);
}

async function build() {
  const tasks: Array<Promise<void>> = [];
  const files = await glob(filesPattern, { nocase: true });
  files.forEach(file => tasks.push(process(file)));
  await Promise.all(tasks);
  console.log("Built files:\n", JSON.stringify(files));
}

build();
