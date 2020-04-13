import {ReactNode} from "react";

export interface Group {
    id: number,
    name: string
}
export interface User {
    firstName: string,
    lastName: string
    id: number,
    username: string,
    groups: Array<Group>,
    email: string
}

export interface HttpError {
    error: {
        status:  number,
        message: string,
    }
}

export interface ReactProps {
    children?: ReactNode[] | string[] | Element[]
}



export interface Post {
    id: number,

    title: string,

    content: string,

    created: Date,

    updated: Date,

    groups: Group[],

    author: User,
}

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


export class CalendarEvent {
    id: number;
    name: string;
    when: Date;
    length: number;
    description?: string;
    colour: EventColour;
    type: EventType;
    repeat: Repeat;
    created: Date;
    cancellations: Cancellation[];
	__loc?: number;
}

export class Cancellation {
    id: number;
    when?: Date;
    reason?: string;
    created: Date;
    cancelledBy: Partial<User>;
    event: CalendarEvent;

}

export default CalendarEvent;
