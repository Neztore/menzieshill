import {
  Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn
} from "typeorm";

import { Cancellation } from "./Cancellation.entity";

/*
    For client - colour mappings
    export enum EventColour {
    Turqoise = "primary",
    Blue = "info",
    LightGrey = "grey-light",
    Red = "danger",
    Yellow = "warning",
    Green = "success",
    White = "white",
    Black = "black"
}
 */

export enum EventColour {
    turqoise = "Turqoise",
    blue = "Blue",
    lightGrey = "LightGrey",
    red = "Red",
    yellow = "Yellow",
    green = "Green",
    white = "White",
    black = "Black"
}
export enum EventType {
    global = "Global",
    swimming = "Swimming",
    waterPolo = "WaterPolo",
    openWater = "OpenWater"
}
export enum Repeat{
    none = "None",
    daily = "Daily",
    weekly = "Weekly",
    monthly = "Monthly"
}

@Entity()
export class CalendarEvent {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 100 })
    name: string;

    @Column({ type: "timestamptz" })
    when: Date;

    @Column() // Hours
    length: number;

    @Column({
      type: "text",
      nullable: true
    })
    description?: string;

    @Column({
      type: "enum",
      enum: EventColour,
      default: EventColour.blue
    })
    colour: EventColour;

    @Column({
      type: "enum",
      enum: EventType,
      default: EventType.global
    })
    type: EventType;

    @Column({
      type: "enum",
      enum: Repeat,
      default: Repeat.none
    })
    repeat: Repeat;

    @CreateDateColumn()
    created: Date;

    @OneToMany(() => Cancellation, cancellation => cancellation.event)
    cancellations: Cancellation[];
}

export default CalendarEvent;
