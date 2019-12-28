import {Column, CreateDateColumn, JoinTable, ManyToMany} from "typeorm";
import Group from "./Group.entity";

export abstract class FSElement {
    @Column()
    name: string;

    @CreateDateColumn()
    created: Date;

    @ManyToMany(()=>Group, {eager: true})
    @JoinTable()
    accessGroups: Group[];
}
export default FSElement