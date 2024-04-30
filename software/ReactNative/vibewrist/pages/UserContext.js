// // UserContext.js
import React, { createContext, useContext } from "react";

const UserContext = createContext(null);

/**
 * Provides the user object to the entire application.
 * @name UserProvider
 */
export const UserProvider = ({ children, user }) => (
  <UserContext.Provider value={user}>{children}</UserContext.Provider>
);

export const useUser = () => useContext(UserContext);
