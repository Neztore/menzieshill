import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    ManyToMany,
    JoinTable,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne
} from "typeorm";
import {Group} from "./Group.entity";
import User from "./User.entity";

@Entity()
export class Post {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 50})
    title: string;

    @Column({ type: "text" })
    content: string;

    @CreateDateColumn()
    created: Date;

    @UpdateDateColumn()
    updated: Date;

    @ManyToMany(() => Group, group => group.posts)
    @JoinTable()
    groups: Group[];

    @ManyToOne(() => User)
    author: User;
    // TODO: Attachments.
}

export default Post;
