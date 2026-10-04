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

  // ==========================================
  // GET ALL
  // ==========================================
  const getAccountingPeriods = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.get("/AccountingPeriods");

      const data = response.data?.result || response.data || [];
      setAccountingPeriods(data);
      return data;
    } catch (err) {
      console.error("Error fetching accounting periods:", err);
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // GET BY ID
  // ==========================================
  const getAccountingPeriodById = async (id) => {
    try {
      setError(null);

      const response = await api.get(`/AccountingPeriods/${id}`);

      return response.data;
    } catch (err) {
      console.error("Error fetching accounting period:", err);
      setError(err);
      throw err;
    }
  };

  // ==========================================
  // CREATE
  // ==========================================
  const createAccountingPeriod = async (periodData) => {
    try {
      setError(null);

      const response = await api.post("/AccountingPeriods", periodData);

      await getAccountingPeriods();

      return response.data;
    } catch (err) {
      console.error("Error creating accounting period:", err);
      setError(err);
      throw err;
    }
  };

  // ==========================================
  // UPDATE / PATCH
  // ==========================================
  const updateAccountingPeriod = async (id, periodData) => {
    try {
      setError(null);

      const response = await api.patch(`/AccountingPeriods/${id}`, periodData);

      await getAccountingPeriods();

      return response.data;
    } catch (err) {
      console.error("Error updating accounting period:", err);
      setError(err);
      throw err;
    }
  };

  // ==========================================
  // DELETE
  // ==========================================
  const deleteAccountingPeriod = async (id) => {
    try {
      setError(null);

      const response = await api.delete(`/AccountingPeriods/${id}`);

      await getAccountingPeriods();

      return response.data;
    } catch (err) {
      console.error("Error deleting accounting period:", err);
      setError(err);
      throw err;
    }
  };

  return (
    <AccountingPeriodContext.Provider
      value={{
        accountingPeriods,
        loading,
        error,
        getAccountingPeriods,
        getAccountingPeriodById,
        createAccountingPeriod,
        updateAccountingPeriod,
        deleteAccountingPeriod,
      }}
    >
      {children}
    </AccountingPeriodContext.Provider>
  );
};

export const useAccountingPeriod = () => {
  return useContext(AccountingPeriodContext);
};