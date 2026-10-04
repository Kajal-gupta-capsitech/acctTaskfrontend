// import React, { createContext, useContext, useState } from "react";
// import api from "../../api/axios";

// const ChartAccountContext = createContext();

// export const ChartAccountProvider = ({ children }) => {
//   const [chartAccounts, setChartAccounts] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   const getChartAccounts = async () => {
//     try {
//       setLoading(true);
//       setError(null);

//       const response = await api.get("/ChartAccounts");

//       setChartAccounts(response.data);
//     } catch (err) {
//       console.error("Error fetching chart accounts:", err);
//       setError(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <ChartAccountContext.Provider
//       value={{
//         chartAccounts,
//         loading,
//         error,
//         getChartAccounts,
//       }}
//     >
//       {children}
//     </ChartAccountContext.Provider>
//   );
// };

// export const useChartAccount = () => {
//   return useContext(ChartAccountContext);
// };


import React, {
  createContext,
  useContext,
  useState,
} from "react";

import api from "../../api/axios";
const ChartAccountContext = createContext();

export const ChartAccountProvider = ({ children }) => {


  const [chartAccounts, setChartAccounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // GET ALL
  const getChartAccounts = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.get("/ChartAccounts");

      setChartAccounts(response.data);
    } catch (err) {
      console.error("Error fetching chart of accounts:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  // CREATE
  const createChartAccount = async (accountData) => {
    try {
      setError(null);

      const response = await api.post(
        "/ChartAccounts",
        accountData
      );

      // Refresh table after successful creation
      await getChartAccounts();

      return response.data;
    } catch (err) {
      console.error("Error creating chart account:", err);

      setError(err);

      throw err;
    }
  };

  return (
    <ChartAccountContext.Provider
      value={{
        chartAccounts,
        loading,
        error,
        getChartAccounts,
        createChartAccount,
      }}
    >
      {children}
    </ChartAccountContext.Provider>
  );
};

export const useChartAccount = () =>
  useContext(ChartAccountContext);