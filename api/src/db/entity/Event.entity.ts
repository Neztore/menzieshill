import {Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany} from "typeorm";
import Cancellation from "./Cancellation.entity";

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
    Turqoise = "Turqoise",
    Blue = "Blue",
    LightGrey = "LightGrey",
    Red = "Red",
    Yellow = "Yellow",
    Green = "Green",
    White = "White",
    Black = "Black"
}
export enum EventType {
    Global = "Global",
    Swimming = "Swimming",
    WaterPolo = "WaterPolo",
    OpenWater = "OpenWater"
}
export enum Repeat{
    None = "None",
    Daily = "Daily",
    Weekly = "Weekly",
    Monthly = "Monthly"
}


@Entity()
export class CalendarEvent {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 100})
    name: string;

    @Column({type: "timestamptz"})
    when: Date;

    @Column() // Hours
    length: number;

    @Column({  type: "text", nullable: true })
    description?: string;

    @Column({
        type: "enum",
        enum: EventColour,
        default: EventColour.Blue
    })
    colour: EventColour;

    @Column({
        type: "enum",
        enum: EventType,
        default: EventType.Global
    })
    type: EventType;

    @Column({
        type: "enum",
        enum: Repeat,
        default: Repeat.None
    })
    repeat: Repeat;


    @CreateDateColumn()
    created: Date;

    @OneToMany(() => Cancellation, cancellation => cancellation.event)
    cancellations: Cancellation[];





}

export default CalendarEvent;
