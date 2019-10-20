// For storing event Cancellations.

import {Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn} from "typeorm";
import User from "./User.entity";
import CalendarEvent from "./Event.entity";
@Entity()
export class Cancellation {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: "timestamptz", nullable: true}) // For recurring events
    when?: Date;

    @Column({ length: 500, nullable: true })
    reason?: string;

    @CreateDateColumn()
    created: Date;

    @ManyToOne(() => User)
    cancelledBy: Partial<User>;

   @ManyToOne(() => CalendarEvent, event => event.cancellations, {onDelete: "CASCADE"})
    event: CalendarEvent;

    // Many to many notifyGroups (Future)
}

export default Cancellation;
