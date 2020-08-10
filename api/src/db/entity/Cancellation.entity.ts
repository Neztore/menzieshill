// For storing event Cancellations.

import {
  Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn
} from "typeorm";

import { CalendarEvent } from "./Event.entity";
import { User } from "./User.entity";
@Entity()
export class Cancellation {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
      type: "timestamptz",
      nullable: true
    }) // For recurring events
    when?: Date;

    @Column({
      length: 500,
      nullable: true
    })
    reason?: string;

    @CreateDateColumn()
    created: Date;

    @ManyToOne(() => User)
    cancelledBy: Partial<User>;

   @ManyToOne(() => CalendarEvent, event => event.cancellations, { onDelete: "CASCADE" })
    event: CalendarEvent;

  // Many to many notifyGroups (Future)
}

export default Cancellation;
