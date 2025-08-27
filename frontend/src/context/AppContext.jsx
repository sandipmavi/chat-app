import { createContext, useState } from "react";

export const AppContext = createContext();
const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  

  return (
    <AppContext.Provider value={{ user, setUser, showLogin, setShowLogin }}>
      {children}
    </AppContext.Provider>
  );
};
export default AppProvider;
