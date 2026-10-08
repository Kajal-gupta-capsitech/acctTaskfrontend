import React, {
  createContext,
  useContext,
  useState,
} from "react";

import api from "../../api/axios";

const TrialBalanceContext = createContext();

export const TrialBalanceProvider = ({ children }) => {
  const [trialBalances, setTrialBalances] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ==========================================
  // GET ALL
  // ==========================================
  const getTrialBalances = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.get("/TrialBalances");

      setTrialBalances(response.data.result);

      return response.data.result;
    } catch (err) {
      console.error(
        "Error fetching trial balances:",
        err
      );

      setError(err);

      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getTrialBalanceDetails = async (id) => {
    try {
      const response = await api.get(`/TrialBalances/${id}/details`);

      return response.data;
    } catch (error) {
      console.error("Error fetching trial balance details:", error);
      throw error;
    }
  };

  // ==========================================
  // GET JOURNAL BY ID
  // ==========================================
  const getJournalById = async (
    refNo,
    journalId
  ) => {
    try {
      setError(null);

      const response = await api.get(
        `/TrialBalances/${refNo}/journals/${journalId}`
      );

      return response.data;
    } catch (err) {
      console.error(
        "Error fetching journal:",
        err
      );

      setError(err);

      throw err;
    }
  };


  const getImportsById = async (
    refNo,
    importId
  ) => {
    try {
      setError(null);

      const response = await api.get(
        `/TrialBalances/${refNo}/imports/${importId}`
      );

      return response.data;
    } catch (err) {
      console.error(
        "Error fetching journal:",
        err
      );

      setError(err);

      throw err;
    }
  };
  // ==========================================
  // CREATE
  // ==========================================
  // const createTrialBalance = async (
  //   trialBalanceData
  // ) => {
  //   try {
  //     setError(null);

  //     const response = await api.post(
  //       "/TrialBalances",
  //       trialBalanceData
  //     );

  //     // Refresh list after creating
  //     await getTrialBalances();

  //     return response.data;
  //   } catch (err) {
  //     console.error(
  //       "Error creating trial balance:",
  //       err
  //     );

  //     setError(err);

  //     throw err;
  //   }
  // };


  // const createTrialBalance = async (
  //   trialBalanceData
  // ) => {
  //   try {
  //     setError(null);
  // console.log("Creating trial balance with data:", trialBalanceData);
  //     const response = await api.post(
  //       "/TrialBalances",
  //       trialBalanceData
  //     );

  //     await getTrialBalances();

  //     return response.data;
  //   } catch (err) {
  //     console.error(
  //       "Error creating trial balance:",
  //       err
  //     );

  //     setError(err);

  //     throw err;
  //   }
  // };


  const createTrialBalance = async (
    trialBalanceData
  ) => {
    try {
      setError(null);

      const isFormData =
        trialBalanceData instanceof FormData;

      const response = await api.post(
        "/TrialBalances",
        trialBalanceData,
        isFormData
          ? {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
          : undefined
      );


      // await getTrialBalances();

      return response.data.result;
    } catch (err) {
      console.error(
        "Error creating trial balance:",
        err
      );

      setError(err);

      throw err;
    }
  };

  const importTrialBalancebyId = async (
    trialBalanceData
  ) => {
    try {
      setError(null);

      const isFormData =
        trialBalanceData instanceof FormData;

      const response = await api.post(
        "/TrialBalances",
        trialBalanceData,
        isFormData
          ? {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
          : undefined
      );


      // await getTrialBalances();

      return response.data.result;
    } catch (err) {
      console.error(
        "Error creating trial balance:",
        err
      );

      setError(err);

      throw err;
    }
  };


  // ==========================================
  // IMPORT CSV
  // ==========================================
  const importTrialBalance = async (
    refNo,
    importData
  ) => {
    try {
      setError(null);

      const response = await api.post(
        `/TrialBalances/${refNo}/imports`,
        importData
      );

      // Refresh Trial Balance list
      await getTrialBalances();

      return response.data;
    } catch (err) {
      console.error(
        "Error importing trial balance:",
        err
      );

      setError(err);

      throw err;
    }
  };
  // ==========================================
  // UPDATE / PATCH
  // ==========================================


  const updateTrialBalance = async (
    id,
    trialBalanceData
  ) => {
    try {
      setError(null);

      const response = await api.patch(
        `/TrialBalances/${id}`,
        trialBalanceData
      );

      console.log("response", response);
      // Refresh list after update
      await getTrialBalances();

      return response.data;
    } catch (err) {
      console.error(
        "Error updating trial balance:",
        err
      );

      setError(err);

      throw err;
    }
  };

  // ==========================================
  // DELETE
  // ==========================================
  const deleteTrialBalance = async (id) => {
    try {
      setError(null);

      const response = await api.delete(
        `/TrialBalances/${id}`
      );

      // Refresh list after delete
      await getTrialBalances();

      return response.data;
    } catch (err) {
      console.error(
        "Error deleting trial balance:",
        err
      );

      setError(err);

      throw err;
    }
  };

  // ==========================================
  // CREATE / UPDATE JOURNAL
  // ==========================================
  const createOrUpdateJournal = async (
    refNo,
    journalId,
    journalData,
    attachment = null
  ) => {
    try {
      setError(null);

      const formData = new FormData();

      // Journal object must be sent as JSON string
      formData.append(
        "journal",
        JSON.stringify(journalData)
      );

      // Attachment is optional
      if (attachment) {
        formData.append(
          "attachment",
          attachment
        );
      }

      const response = await api.post(
        `/TrialBalances/${refNo}/journals/${journalId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return response.data;
    } catch (err) {
      console.error(
        "Error creating/updating journal:",
        err
      );

      setError(err);

      throw err;
    }
  };


  return (
    <TrialBalanceContext.Provider
      value={{
        // State
        trialBalances,
        loading,
        error,

        // CRUD
        getTrialBalances,
        createTrialBalance,
        updateTrialBalance,
        deleteTrialBalance,
        getJournalById,
        getTrialBalanceDetails,

        // Journal
        createOrUpdateJournal,

        importTrialBalancebyId,
        getImportsById,

      }}
    >
      {children}
    </TrialBalanceContext.Provider>
  );
};

export const useTrialBalance = () =>
  useContext(TrialBalanceContext);