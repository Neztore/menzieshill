import {Entity, Column, PrimaryGeneratedColumn,ManyToOne} from "typeorm";
import User from "./User.entity";
@Entity()
export class Auth {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 100 })
    token: string;

    @Column({type: "timestamptz", default: "NOW()"})
    created: Date;

    @ManyToOne(() => User, (user: User) => user.auth)
    user: User;
}

export default Auth;
