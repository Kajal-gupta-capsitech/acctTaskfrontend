import React, {
  createContext,
  useContext,
  useState,
} from "react";

import api from "../../api/axios";

const AccountingPeriodContext = createContext();

export const AccountingPeriodProvider = ({ children }) => {
  const [accountingPeriods, setAccountingPeriods] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getAccountingPeriods = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.get("/AccountingPeriods");

      setAccountingPeriods(response.data);
    } catch (err) {
      console.error(
        "Error fetching accounting periods:",
        err
      );

      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AccountingPeriodContext.Provider
      value={{
        accountingPeriods,
        loading,
        error,
        getAccountingPeriods,
      }}
    >
      {children}
    </AccountingPeriodContext.Provider>
  );
};

export const useAccountingPeriod = () => {
  return useContext(AccountingPeriodContext);
};