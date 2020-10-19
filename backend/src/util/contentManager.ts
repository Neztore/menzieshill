/*
  Responsible for producing the "Public facing" representation of the site's content.
  Based upon the "Content" Database root.
 */
import { compile } from "ejs";
import { promises, readFileSync } from "fs";
import marked from "marked";
import { join } from "path";

import Database from "../db";
import { File } from "../db/entity/File.entity";
import { Folder } from "../db/entity/Folder.entity";

const {
  mkdir, readFile, writeFile, access, copyFile, rmdir
} = promises;

const { filesLoc } = require("../../config");

marked.setOptions({
  pedantic: false,
  sanitize: false,
  smartLists: true,
  mangle: true
});
const contentBase = join(process.cwd(), "..", "..", "frontend");
const pageSource = readFileSync(join(process.cwd(), "..", "pageTemplate.ejs"), { encoding: "utf-8" });
const renderFile = compile(pageSource, { async: true });
const reg = /{{(.*?)}}/gm;

// Partials cache
let partials: {[key: string]: string} = {};

export async function generateStatic () {
  const contentRoot = await Database.getFolderRoot("content");
  const res = await Database.folders.findDescendantsTree(contentRoot);
  // Clear partials cache
  partials = {};
  return doFolder(contentBase, res);
}

// Outputs a folder and recurse over all it's children
async function doFolder (path: string, folder: Folder) {
  const fold = await Database.folders.findOne({ id: folder.id }, { relations: ["files"] });
  const kids = fold && fold.files;
  if (!kids) {
    throw new Error("no folder or no children");
  }
  const newPath = folder.name.includes("ROOT") ? path : join(path, folder.name);
  try {
    await access(newPath);
    await rmdir(contentBase, {
      maxRetries: 2,
      recursive: true
    });
  } catch (e) {
    if (e.code !== "ENOENT") {
      throw e;
    }
  }
  await mkdir(newPath);
  for (const file of kids) {
    doFile(newPath, file)
      .then(() => console.log(`Created file ${file.name}`))
      .catch(async e => {
        if (e.code === "ENOENT") {
          console.warn(`File ${file.name} has no source file. Removing from database.`);
          await Database.files.remove(file);
        } else {
          throw e;
        }
      });
  }
  for (const child of folder.children) {
    doFolder(newPath, child)
      .catch(e => console.error(`Failed to do folder ${child.name}: ${e.message}`));
  }
}
// Rebuilds it if it's within content. Otherwise, does nothing.
export async function rebuildFolder (folder: Folder) {
  const tree = await Database.folders.findAncestorsTree(folder);
  // Iterate upwards
  function iterateFolder (fold: Folder): boolean {
    if (fold.parent) {
      return iterateFolder(fold.parent);
    }
    return folder.name === "content_ROOT";
  }
  const isContent = iterateFolder(tree);
  if (isContent) {
    // Here I could use the path to iterateFolder to generate a path
    // and update the specific folder
    // but i cant be bothered and it barely makes a difference anyhow.
    generateStatic()
      .catch(console.error);
  }
}

async function doFile (path: string, file: File) {
  // Do MD rendering as required
  const ext = getExt(file.loc);
  const originalLoc = join(filesLoc, file.loc);
  if (ext && ext.toLowerCase() === "md") {
    let content: string = await readFile(originalLoc, { encoding: "utf-8" });
    content = await renderMarkdown(content, file);
    const newName = `${file.name.replace(/\s/g, "-")}.html`;
    await writeFile(join(path, newName), content);
  } else {
    // If File name has an extension, leave it be
    // if it does not, give the loc extension
    // If no loc ext found, give no extension.
    let outExt = "";
    if (getExt(file.loc) && !getExt(file.name)) {
      outExt = `.${getExt(file.loc)}`;
    }
    await copyFile(originalLoc, join(path, `${file.name}${outExt}`));
  }
}
function getExt (str: string): string|undefined {
  const num = str.lastIndexOf(".");
  if (num === -1) return undefined;
  return str.substring(str.lastIndexOf(".") + 1);
}
async function getPartial (name: string): Promise<string|void> {
  const target = name.substring(2, name.length - 2).trim();
  const partial = await Database.files.createQueryBuilder("file")
    .where("LOWER(file.name) = :target OR LOWER(file.name) = :target || '.md'", { target })// Prioritises 'higher up' files
    .orderBy("file.folder.id", "ASC")
    .getOne();
  if (partial) {
    // Fetch the file itself
    const content: string = await readFile(join(filesLoc, partial.loc), { encoding: "utf-8" });
    partials[name] = content;
    return content;
  }
  return undefined;
}

async function renderMarkdown (content: string, file: File): Promise<string> {
  // Rendering logic
  // noinspection DuplicatedCode
  let highestLevel = 100;
  let title = file.name;
  let description = "Menzieshill Whitehall Swimming and Water Polo club is an amateur sports club in Dundee, Scotland.";
  const renderer = {
    heading (text: string, level: number) {
      if (level < highestLevel && text) {
        title = text;
        highestLevel = level;
      }
      return `<h${level}>${text}</h${level}>`;
    },
    // We disregard code blocks mainly because they get in the way of rendering pretty HTML blocks.
    // The inline code still works, but the <code> and ``` won't. Neither will a load of spaces.
    code (text: string) {
      return text;
    }
  };
  // @ts-ignore
  marked.use({ renderer });
  const newLines = content.split(new RegExp("(\\r\\n|\\r|\\n)"));
  for (let counter = 0; counter < newLines.length; counter++) {
    const text = (newLines[counter] || "").toLowerCase();
    if (text.startsWith("desc:") || text.startsWith("description:")) {
      const pos = text.indexOf(":");
      const parsed = text.substr(pos + 1);
      description = parsed;
      newLines[counter] = parsed;
      break;
    }
  }
  let rdyContent = newLines.join("\n");
  // Built in tags.
  rdyContent = `{{header}} ${rdyContent} {{footer}}`;
  const toHandle = rdyContent.match(reg);
  if (toHandle && Array.isArray(toHandle)) {
    for (const partial of toHandle) {
      // eslint-disable-next-line no-await-in-loop
      const cont = await getPartial(partial);
      if (cont) {
        rdyContent = rdyContent.replace(partial, marked(cont));
      } else {
        rdyContent = rdyContent.replace(partial, `Failed to find content for ${partial}`);
      }
    }
  }
  const body = marked(rdyContent);
  // Custom partial implementation
  return renderFile({
    title,
    description,
    body, // todo: move to env
    ApiUrl: "http://localhost:3000"
  });
}
