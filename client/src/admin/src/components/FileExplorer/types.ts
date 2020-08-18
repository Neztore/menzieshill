import { Group, User } from "../../shared/Types";

export interface Folder {
  name: string;

  id: number;

  created: string;

  parent: Folder;

  accessGroups: Group[];

  files: File[];

  children: Folder[];
}
export interface File {
  loc:string;

  folder: Folder;

  creator: Partial<User>;

  name: string;

  created: Date;

  accessGroups: Group[];
}
