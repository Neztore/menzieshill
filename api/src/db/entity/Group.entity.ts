import {Entity, Column, PrimaryGeneratedColumn,ManyToMany} from "typeorm";
import User from "./User.entity";
import Post from "./Post.entity";

// Must update both list & class.
// List is the list of Permissions that are accepted via. web request
// For ease this is also here.
// Gonna have to update this in SO many places.
export class Permission {
    constructor () {
        this.admin = false;
        this.managePosts = false;
        this.manageEvents = false;
        this.manageFiles = false;
        this.managePages = false;
        this.member = false;
    }
    admin: boolean;
    managePosts: boolean;
    manageEvents: boolean;
    manageFiles: boolean;
    managePages: boolean;
    member: boolean

}



@Entity()
export class Group {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 30 })
    name: string;

    /* # Permissions! */

    // Can do everything.
    @Column({  default: "false"})
    admin: boolean;

    // Can create posts.
    @Column({  default: "false"})
    managePosts: boolean;

    // Can create posts.
    @Column({  default: "false"})
    manageEvents: boolean;

    // Can create, edit and delete images and files.
    @Column({  default: "false"})
    manageFiles: boolean;

    // Can modify, add and remove pages.
    @Column({  default: "false"})
    managePages: boolean;

    // Can view 'private' posts. For users who are known to be a member.
    @Column({  default: "false"})
    member: boolean;

    // Whether or not a user can 'join' this group by themselves.
    @Column({  default: "false"})
    joinable: boolean;

    @Column({type: "timestamptz", default: "NOW()"})
    created: Date;

    @ManyToMany(() => User, (user: User) => user.groups)
    users: User[];

    @ManyToMany(() => Post, (post: Post) => post.groups)
    posts: Post[];

}




export default Group;
