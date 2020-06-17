import { createContext } from "react";

import { User } from "../shared/Types";

const UserContext = createContext<User | null>(null);

export const UserProvider = UserContext.Provider;
export const UserConsumer = UserContext.Consumer;
export default UserContext;