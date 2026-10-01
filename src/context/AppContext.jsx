// import { AccountTypeProvider } from "./AccountTypeContext";
// import { AccountingPeriodProvider } from "./AccountingPeriodContext";
// import { ChartAccountProvider } from "./ChartAccountContext/ChartAccountContext";
// import { TrialBalanceProvider } from "./TrialBalanceContext";


import { ChartAccountProvider } from "./ChartAccountContext/ChartAccountContext";
import { AccountTypeProvider } from "./AccountTypeContext/AccountTypeContext";
import {
  AccountingPeriodProvider,
} from "./AccountingPeriodContext/AccountingPeriodContext";
import {
  TrialBalanceProvider,
} from "./TrialBalanceContext/TrialBalanceContext";
export const AppProvider = ({ children }) => {
  return (
    <ChartAccountProvider>
      <AccountTypeProvider>
        <AccountingPeriodProvider>
          <TrialBalanceProvider>
            {children}
          </TrialBalanceProvider>
        </AccountingPeriodProvider>
      </AccountTypeProvider>
    </ChartAccountProvider>
  );
};