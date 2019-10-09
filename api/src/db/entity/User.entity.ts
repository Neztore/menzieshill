import {Entity, Column, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class UserEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 30, unique: true})
    username: string;

    @Column({ length: 200 })
    hash: string;

    @Column({ length: 50, unique: true})
    email: string;

    @Column({length: 30})
    firstName: string;

    @Column({length: 30})
    lastName: string;

    @Column({type: "timestamptz", default: "NOW()"})
    created: Date;
}

export default UserEntity;
