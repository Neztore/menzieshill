import {
  Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn
} from "typeorm";

import { Auth } from "./Auth.entity";
import { Group, Permission } from "./Group.entity";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
      length: 30,
      unique: true
    })
    username: string;

    @Column({
      length: 200,
      select: false
    })
    hash: string;

    @Column({
      length: 50,
      unique: true
    })
    email: string;

    @Column({ length: 30 })
    firstName: string;

    @Column({ length: 30 })
    lastName: string;

    @Column({
      type: "timestamptz",
      default: "NOW()"
    })
    created: Date;

    @OneToMany(() => Auth, auth => auth.user)
    auth: Auth[];

    @ManyToMany(() => Group, group => group.users)
    @JoinTable()
    groups: Group[];

    perm?: Permission
}

export default User;
