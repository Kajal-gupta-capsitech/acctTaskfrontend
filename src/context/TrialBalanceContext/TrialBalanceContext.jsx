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

  // ==========================================
  // GET BY ID
  // ==========================================
  const getTrialBalanceById = async (id) => {
    try {
      setError(null);

      const response = await api.get(
        `/TrialBalances/${id}`
      );

      return response.data;
    } catch (err) {
      console.error(
        "Error fetching trial balance:",
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

    await getTrialBalances();

    return response.data;
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

  return (
    <TrialBalanceContext.Provider
      value={{
        // State
        trialBalances,
        loading,
        error,

        // CRUD
        getTrialBalances,
        getTrialBalanceById,
        createTrialBalance,
        updateTrialBalance,
        deleteTrialBalance,
      }}
    >
      {children}
    </TrialBalanceContext.Provider>
  );
};

export const useTrialBalance = () =>
  useContext(TrialBalanceContext);