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
import { ToastProvider } from "./ToastContext/ToastContext";

export const AppProvider = ({ children }) => {
  return (
    <ToastProvider>
      <ChartAccountProvider>
        <AccountTypeProvider>
          <AccountingPeriodProvider>
            <TrialBalanceProvider>
              {children}
            </TrialBalanceProvider>
          </AccountingPeriodProvider>
        </AccountTypeProvider>
      </ChartAccountProvider>
    </ToastProvider>
  );
};