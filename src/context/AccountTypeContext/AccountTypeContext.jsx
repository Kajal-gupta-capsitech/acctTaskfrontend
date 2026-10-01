import React, { createContext, useContext, useState } from "react";
import api from "../../api/axios";

const AccountTypeContext = createContext();

export const AccountTypeProvider = ({ children }) => {
  const [accountTypes, setAccountTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getAccountTypes = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.get("/AccountTypes");

      setAccountTypes(response.data);
    } catch (err) {
      console.error("Error fetching account types:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AccountTypeContext.Provider
      value={{
        accountTypes,
        loading,
        error,
        getAccountTypes,
      }}
    >
      {children}
    </AccountTypeContext.Provider>
  );
};

export const useAccountType = () =>
  useContext(AccountTypeContext);