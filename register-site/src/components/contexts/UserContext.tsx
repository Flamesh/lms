import { createContext, useContext, useState } from "react";
import { User } from "../../models/user";

interface UserContextProps {
  currentUser?: User | null | undefined;
  setCurrentUser?:any;
  loggedIn: boolean;
  setLoggedIn: (loggedIn: boolean) => void;
}

const UserContext = createContext<UserContextProps>({
  currentUser: null,
  loggedIn: false,
  setCurrentUser: undefined,
  setLoggedIn: () => {},
});

export const UserProvider = ({ children }: any) => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<User>({} as User);

  return (
    <UserContext.Provider
      value={{ loggedIn, setLoggedIn, currentUser, setCurrentUser }}
    >
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => {
  return useContext(UserContext);
}
