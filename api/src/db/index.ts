import {Connection, createConnection, Repository} from "typeorm";
import UserEntity from './entity/User.entity'

class Database {
    constructor () {
        this.init()
    }
    _connection: Connection;
    users: Repository<UserEntity>;

    init () {
        createConnection().then(connection => {

            this._connection = connection;
            this.users = this._connection.getRepository(UserEntity);
            return this._connection
        }).catch(error => console.log(error));
    }

    async checkUserExists (username: string, email:string): Promise<UserEntity | undefined> {
        return await this.users.findOne({where: [{ username: username }, { email: email }]});
    }
    addUser (info: Object) {
        return this.users.save(info);
    }

    deleteUser (id: number) {
        return this.users.delete({ id });
    }
    getUser (id: number) {
        return this.users.findOne({ id });
    }


}
export default new Database();
