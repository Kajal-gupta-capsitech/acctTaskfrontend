import * as React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainScreen from "./pages/mainScreen/MnScreen";
import TrialBalance from "./pages/trialBalance/TrialBalance";
import ChartAccounts from "./pages/chartAccounts/ChartAccounts";
import AccountingPeriod from "./pages/accounts/Accounts";
import CreateTrialBalance from "./pages/trialBalance/components/CreateTrialBalance";
import TbDetails from "./pages/trialBalance/components/TrialBalanceDetailsPage";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Shared layout: Navbar stays here */}
        <Route path="/" element={<MainScreen />}>
          {/* Default page */}
          <Route index element={<ChartAccounts />} />

          {/* Sidebar pages */}
          <Route
            path="chart-accounts"
            element={<ChartAccounts />}
          />

          <Route
            path="accounting-period"
            element={<AccountingPeriod />}
          />

          <Route
            path="trial-balances"
            element={<TrialBalance />}
          />

          {/* Create Journal page also keeps the sidebar */}
          <Route
            // path="trial-balances/:trialBalanceId/journal/:journalId"
            path="trial-balances/:trialBalanceId"
            element={<TbDetails />}
          />

           <Route
            // path="trial-balances/:trialBalanceId/journal/:journalId"
            path="trial-balances/:trialBalanceId/journal/:journalId"
            element={<CreateTrialBalance />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;