import { createContext, FC, useContext, useState } from "react";

export interface User {
  _id: string;
  email: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
  session: string;
  iat: number;
  exp: number;
}

export interface UserContext {
  user?: User;
  setUser: (user?: User) => void;
}

interface Props {
  initialUser?: User;
  children: React.ReactNode;
}

export const UserContextImpl = createContext<UserContext>(null!);

export function useUser() {
  return useContext(UserContextImpl);
}

export const UserProvider: FC<Props> = ({ children, initialUser }) => {
  const [user, setUser] = useState(initialUser);

  return (
    <UserContextImpl.Provider value={{ user, setUser }}>
      {children}
    </UserContextImpl.Provider>
  );
};
