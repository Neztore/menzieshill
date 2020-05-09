import {
    Entity,
    Tree,
    TreeChildren,
    TreeParent,
    OneToMany, PrimaryGeneratedColumn,
} from "typeorm";
import File from "./File.entity";
import FSElement from "./FSElement.abstract.entity";

@Entity()
@Tree("closure-table")
export class Folder extends FSElement{
    // Contains all files held by THIS folder.
    @PrimaryGeneratedColumn()
    id: number;

    @OneToMany(()=>File, file =>file.folder)
    files: File[];

    @TreeChildren({
      //  cascade: ["remove"]
    })
    children: Folder[];

    @TreeParent()
    parent: Folder;
}
export default Folder