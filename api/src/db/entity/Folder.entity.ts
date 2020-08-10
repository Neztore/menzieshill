import {
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Tree,
  TreeChildren, TreeParent
} from "typeorm";

import { FSElement } from "./FSElement.abstract.entity";
import { File } from "./File.entity";

@Entity()
@Tree("closure-table")
export class Folder extends FSElement {
    // Contains all files held by THIS folder.
    @PrimaryGeneratedColumn()
    id: number;

    @OneToMany(() => File, file => file.folder)
    files: File[];

    @TreeChildren({
      //  cascade: ["remove"]
    })
    children: Folder[];

    @TreeParent()
    parent: Folder;
}
export default Folder;
