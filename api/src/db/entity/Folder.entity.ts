import {
    Entity,
    Tree,
    Column,
    PrimaryGeneratedColumn,
    TreeChildren,
    TreeParent,
    OneToMany, JoinColumn, ManyToMany, JoinTable
} from "typeorm";
import File from "./File.entity";
import Group from "./Group.entity";

@Entity()
@Tree("closure-table")
export class Folder {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @OneToMany(()=>File, file =>file.folder)
    files: File[];

    @ManyToMany(()=>Group)
    @JoinTable()
    accessGroups: Group[];

    @TreeChildren()
    children: Element[];

    @TreeParent()
    parent: Element;
}
export default Folder