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