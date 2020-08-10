import { CalendarEvent } from "../db/entity/Event.entity";
import { User } from "../db/entity/User.entity";

declare module "express-serve-static-core" {
    interface Request {
        user?: User
        event?: CalendarEvent
    }

}
