import { TreeItem } from "@/types"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}



export function convertFilesToTree(files: { [path: string]: string }): TreeItem[] {
  type Node = { dirs: Map<string, Node>; files: Set<string> };
  const root: Node = { dirs: new Map(), files: new Set() };

  // Build trie from paths
  for (const raw of Object.keys(files)) {
    const parts = raw.split("/").filter(Boolean);
    if (parts.length === 0) continue;
    let node = root;
    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i];
      let next = node.dirs.get(part);
      if (!next) {
        next = { dirs: new Map(), files: new Set() };
        node.dirs.set(part, next);
      }
      node = next;
    }
    node.files.add(parts[parts.length - 1]);
  }
  // Node -> TreeItem[]
  function toItems(node: Node): TreeItem[] {
    const folders: TreeItem[] = [];
    // sort folders per level
    for (const [name, child] of [...node.dirs.entries()].sort(([a], [b]) => a.localeCompare(b))) {
      const children = toItems(child);
      folders.push([name, ...children]);
    }
    // sort files per level
    const filesArr: TreeItem[] = [...node.files].sort((a, b) => a.localeCompare(b));
    return [...folders, ...filesArr];
  }

  return toItems(root);
}
