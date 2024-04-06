// UserContext.js
import React, { createContext, useContext } from 'react';

const UserContext = createContext(null);

export const UserProvider = ({ children, user }) => (
  <UserContext.Provider value={user}>{children}</UserContext.Provider>
);

export const useUser = () => useContext(UserContext);
