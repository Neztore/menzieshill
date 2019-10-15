import User from "../db/entity/User.entity";
import CalendarEvent from "../db/entity/Event.entity";

declare module 'express-serve-static-core' {
    interface Request {
        user?: User
        event?: CalendarEvent
    }

}