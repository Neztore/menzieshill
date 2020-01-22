import {ReactNode} from "react";

export interface HttpError {
    error: {
        status:  number,
        message: string,
    }
}


export interface ReactProps {
    children?: ReactNode[] | string[] | Element[]
}