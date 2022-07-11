import React from "react";
import { createContext, useState } from "react";

export const DataContext = createContext(null);

const Dataprovider = ({ children }) => {
  const [username, setUsername] = useState("");
  return (
    <DataContext.Provider value={{ username, setUsername }}>
      {children}
    </DataContext.Provider>
  );
};

export default Dataprovider;
