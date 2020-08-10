import { EventEmitter } from "events";
import {
  Connection, createConnection, Repository, TreeRepository
} from "typeorm";

import { RootString } from "../util";
import { Auth } from "./entity/Auth.entity";
import { Cancellation } from "./entity/Cancellation.entity";
import { CalendarEvent, Repeat } from "./entity/Event.entity";
import { File } from "./entity/File.entity";
import { Folder } from "./entity/Folder.entity";
import { Group } from "./entity/Group.entity";
import { Post } from "./entity/Post.entity";
import { User } from "./entity/User.entity";

class Database extends EventEmitter {
  constructor () {
    super();
    this.init();
  }

    connection: Connection;

    users: Repository<User>;

    auth: Repository<Auth>;

    groups: Repository<Group>;

    events: Repository<CalendarEvent>;

    cancellations: Repository<Cancellation>;

    files: Repository<File>;

    folders: TreeRepository<Folder>;

    posts: Repository<Post>;

    init () {
      createConnection().then(connection => {
        console.log(`DB online.`);
        this.connection = connection;
        this.auth = this.connection.getRepository(Auth);
        this.users = this.connection.getRepository(User);
        this.groups = this.connection.getRepository(Group);
        this.events = this.connection.getRepository(CalendarEvent);
        this.cancellations = this.connection.getRepository(Cancellation);
        this.folders = this.connection.getTreeRepository(Folder);
        this.files = this.connection.getRepository(File);
        this.posts = this.connection.getRepository(Post);
        this.emit("ready");
        return this.connection;
      }).catch(error => console.log(error));
    }

    checkUserExists (username: string, email:string): Promise<User | undefined> {
      // Returns only "hash" and "id" - Only hash is actually used anywhere. This is specified as "hash" has select set to false to prevent
      // Accidental leaks
      return this.users.findOne({
        where: [{ username }, { email }],
        select: ["id", "hash"]
      });
    }

    addUser (info: Object) {
      return this.users.save(info);
    }

    deleteUser (id: number) {
      return this.users.delete(id);
    }

    saveUser (user: User) {
      return this.users.save(user);
    }

    getUser (id: number, withAuth?: boolean) {
      // We get groups by default
      const options = { relations: ["groups"] };
      if (withAuth) { options.relations.push("auth"); }

      return this.users.findOne({ id }, options);
    }

    getUsers () {
      // We get groups by default
      const options = { relations: ["groups"] };

      return this.users.find(options);
    }

    async setAuth (userId: number, token: string): Promise<boolean> {
      const user = await this.getUser(userId);
      if (user) {
        const newAuth = new Auth();
        newAuth.token = token;
        newAuth.user = user;

        const res = await this.connection.manager.save(newAuth);
        if (res.id) {
          // Success
          return true;
        }
        throw new Error(`DB: SetAuth failed for id ${userId}`);
      } else {
        throw new Error(`setAuth: User does not exist for id - ${userId}`);
      }
    }

    deleteAuth (auth: Auth) {
      return this.auth.remove(auth);
    }

    clearAuth (user: User) {
      return this.auth.delete({ user });
    }

    async getAuthByToken (token: string): Promise<Auth | undefined> {
      // We get groups as well as this is only used by the auth middleware.
      return this.auth.createQueryBuilder("auth")
        .leftJoinAndSelect("auth.user", "user")
        .leftJoinAndSelect("user.groups", "groups")
        .where("auth.token = :token", { token })
        .getOne();
    }

    // X95itlkaAeZBKVMYy3YRFXomrk0IEm5qcPx+yE7QMxEMQNl6t8L16feQ/0e9wB3npkPJM7b/GC5zcPjyZWDcbkSwr/no0ratSVMS
    // Modify or create group
    modifyGroup (group: Group) {
      return this.groups.save(group);
    }

    deleteGroup (group: Group) {
      return this.groups.remove(group);
    }

    getGroup (groupId: number) {
      return this.groups.findOne(groupId);
    }

    getGroups () {
      return this.groups.find();
    }

    // Inclusive. I.e. minMonth is the min month that WILL be taken.
    getEvents (min: Date, max: Date): Promise<CalendarEvent[]> {
      return this.events.createQueryBuilder("event")
        .where("event.when between :min and :max", {
          min,
          max
        })
        .andWhere("event.repeat = :none", { none: Repeat.none })
        .leftJoinAndSelect("event.cancellations", "cancellation", "cancellation.when >= :min AND cancellation.when <= :max", {
          min,
          max
        })
        .leftJoinAndSelect("cancellation.cancelledBy", "cancelledBy")
        .orderBy("event.when", "ASC")
        .limit(500) // We should never hit this, but just incase.
        .getMany();
    }

    getRecurringEvents (min: Date, max: Date): Promise<CalendarEvent[]> {
      return this.events.createQueryBuilder("event")
        .where("event.repeat <> :none", { none: Repeat.none })
        .leftJoinAndSelect("event.cancellations", "cancellation", "cancellation.when >= :min AND cancellation.when <= :max", {
          min,
          max
        })
        .leftJoinAndSelect("cancellation.cancelledBy", "cancelledBy")
        .orderBy("event.when", "ASC")
        .limit(500) // We should never hit this, but just incase.
        .getMany();
    }

    getEvent (eventId: number) {
      return this.events.createQueryBuilder("event")
        .where("event.id = :id", { id: eventId })
        .leftJoinAndSelect("event.cancellations", "cancellation")
        .leftJoinAndSelect("cancellation.cancelledBy", "cancelledBy")
        .getOne();
    }

    modifyEvent (event: CalendarEvent) {
      return this.events.save(event);
    }

    deleteEvent (event: CalendarEvent) {
      return this.events.remove(event);
    }

    getCancellation (cancellationId: number) {
      return this.cancellations.findOne(cancellationId);
    }

    modifyCancellation (cancellation: Cancellation) {
      return this.cancellations.save(cancellation);
    }

    deleteCancellation (cancellation: Cancellation) {
      return this.cancellations.remove(cancellation);
    }

    checkCancellation (cancellation: Cancellation) {
      return this.cancellations.find({
        when: cancellation.when,
        event: cancellation.event
      });
    }

    saveFolder (folder: Folder) {
      return this.folders.save(folder);
    }

    /*
        So, as it turns out TypeOrm closure tables don't support automatically removing closure table references.
        And, since they were so kind to not add references in the documentation regarding this issue (which goes back 2+ years)
        until after I started fucking using them, this function is a lot more complicated than it should be.
     */
    // TODO: Add recycle bin, or equivalent. This could be done by adding another root - The bin.
    async deleteFolder (folder: Folder) {
      const desc = await this.folders.findDescendants(folder);
      if (desc.length !== 0) {
        if (desc[0].id !== folder.id) {
          return false;
        }
      }
      await this.connection
        .createQueryBuilder()
        .delete()
        .from("folder_closure")
        .where("\"id_descendant\" = :id", { id: folder.id })
      // .orWhere("id_ancestor = :id", { id: folder.id })
        .execute();

      return this.folders.remove(folder);
    }

    getFolder (id: number) {
      return this.folders.findOne(id, { relations: ["files", "children", "parent"] });
    }

    async getFolderRoot (rootName: RootString): Promise<Folder> {
      const actualName = `${rootName}_ROOT`;
      const roots = await this.folders.findRoots();

      for (let counter = 0; counter < roots.length; counter++) {
        if (roots[counter].name === actualName) {
          // eslint-disable-next-line no-await-in-loop
          const full = await this.getFolder(roots[counter].id);
          if (!full) {
            // what??
            return roots[counter];
          }
          return full;
        }
      }
      // It's not found. Create it.
      const newRoot = new Folder();
      newRoot.name = actualName;
      await this.saveFolder(newRoot);
      return newRoot;
    }

    async addFolder (parent: Folder, newFolder: Folder) {
      const copy = { ...newFolder };
      copy.parent = parent;
      return this.folders.save(copy);
    }

    async getFolderParents (folder: Folder) {
      return this.folders
        .createAncestorsQueryBuilder("folder", "folderClosure", folder)
        .leftJoinAndSelect("folder.accessGroups", "accessGroups")
        .getMany();
    }

    saveFile (file: File) {
      return this.files.save(file);
    }

    getFile (fileLoc: string) {
      return this.files.findOne(fileLoc, { relations: ["accessGroups", "creator", "folder"] });
    }

    deleteFile (file: File) {
      return this.files.remove(file);
    }

    savePost (newPost: Post) {
      return this.posts.save(newPost);
    }

    getPosts (start: number, amount: number) {
      return this.posts.find({
        relations: ["author"],
        skip: start,
        take: amount,
        order: { created: "DESC" }
      });
    }

    getPost (id: number) {
      return this.posts.findOne(id, { relations: ["author"] });
    }

    deletePost (post: Post) {
      return this.posts.remove(post);
    }
}
export default new Database();
