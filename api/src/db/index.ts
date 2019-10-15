import {Connection, createConnection, Repository} from "typeorm";
import User from './entity/User.entity'
import Auth from "./entity/Auth.entity";
import Group from "./entity/Group.entity";
import CalendarEvent from "./entity/Event.entity";
import Cancellation from "./entity/Cancellation.entity";

class Database {
    constructor () {
        this.init()
    }
    _connection: Connection;
    users: Repository<User>;
    auth: Repository<Auth>;
    groups: Repository<Group>;
    events: Repository<CalendarEvent>;
    cancellations: Repository<Cancellation>;

    init () {
        createConnection().then(connection => {

            this._connection = connection;
            this.users = this._connection.getRepository(User);
            this.auth = this._connection.getRepository(Auth);
            this.groups = this._connection.getRepository(Group);
            this.events = this._connection.getRepository(CalendarEvent);
            this.cancellations = this._connection.getRepository(Cancellation);

            return this._connection
        }).catch(error => console.log(error));
    }

    async checkUserExists (username: string, email:string): Promise<User | undefined> {
        // Returns only "hash" and "id" - Only hash is actually used anywhere. This is specified as "hash" has select set to false to prevent
        // Accidental leaks
        return await this.users.findOne({where: [{ username: username }, { email: email }], select: ["id", "hash"]});
    }
    addUser (info: Object) {
        return this.users.save(info);
    }

    deleteUser (id: number) {
        return this.users.delete(id);
    }

    editUser (user: User) {
        return this.users.save(user);
    }

    getUser (id: number, withAuth?: boolean) {
        // We get groups by default
        const options = { relations: ["groups"] };
        if (withAuth) { options.relations.push("auth") }

        return this.users.findOne({id}, options);
    }

    async setAuth (userId: number, token: string): Promise<boolean> {

        const user = await this.getUser(userId);
        if (user) {
            const NewAuth = new Auth();
            NewAuth.token = token;
            NewAuth.user = user;

            let res = await this._connection.manager.save(NewAuth);
            if (res.id) {
                // Success
                return true
            } else {
                throw new Error("DB: SetAuth failed for id "+userId)
            }
        } else {
            throw new Error("setAuth: User does not exist for id - " + userId)
        }
    }

    deleteAuth (auth: Auth) {
        return this.auth.remove(auth);
    }

    clearAuth (user: User) {
        return this.auth.delete({user: user})
    }

    async getAuthByToken (token: string): Promise<Auth | undefined> {
        // We get groups as well as this is only used by the auth middleware.
        const auth = this.auth.createQueryBuilder("auth")
            .leftJoinAndSelect("auth.user", "user")
            .leftJoinAndSelect("user.groups", "groups")
            .where("auth.token = :token", { token})
            .getOne();
        //const auth = await this.auth.findOne({token}, {relations: [ "user" ]});
        if (!auth) return;
        return auth
    }

    // Modify or create group
    modifyGroup (group: Group) {
        return this.groups.save(group);
    }

    deleteGroup (group: Group) {
        return this.groups.remove(group)
    }

    getGroup (groupId: number) {
        return this.groups.findOne(groupId)
    }
    getGroups () {
        return this.groups.find();
    }
    // Inclusive. I.e. minMonth is the min month that WILL be taken.
    getEvents (min: Date, max: Date): Promise<CalendarEvent[]> {
        return this.events.createQueryBuilder('event')
            .where('event.when >= :min', {min})
            .andWhere('event.when <= :max', {max})
            .leftJoinAndSelect("event.cancellations", "cancellation", "cancellation.when >= :min AND cancellation.when <= :max", { min, max})
            .orderBy("event.when", "ASC")
            .limit(500) // We should never hit this, but just incase.
            .getMany();

    }
    getEvent (eventId: number) {
        return this.events.findOne(eventId)
    }

    modifyEvent (event: CalendarEvent) {
        return this.events.save(event);
    }

    deleteEvent (event: CalendarEvent) {
        return this.events.remove(event);
    }

    getCancellation (cancellationId: number) {
        return this.cancellations.findOne(cancellationId)
    }

    modifyCancellation (cancellation: Cancellation) {
        return this.cancellations.save(cancellation);
    }

    deleteCancellation (cancellation: Cancellation) {
        return this.cancellations.remove(cancellation);
    }

    checkCancellation (cancellation: Cancellation) {
        return this.cancellations.find({ when: cancellation.when, event: cancellation.event })
    }

}
export default new Database();
