import * as React from "react";

import {
  Button,
  Dropdown,
  Combobox,
  Option,
  Input,
  Textarea,
  Field,
  Table,
  TableHeader,
  TableHeaderCell,
  TableBody,
  TableRow,
  TableCell,
  makeStyles,
  Menu,
  MenuItem,
  MenuList,
  MenuPopover,
  MenuTrigger,
  Spinner,
} from "@fluentui/react-components";

import {
  ArrowLeftRegular,
  AddRegular,
  Delete16Regular,
  Save20Regular,
  ChevronDown20Regular,
} from "@fluentui/react-icons";

import { useNavigate, useParams } from "react-router-dom";

import { BreadCrumbs } from "../../../componenets/breadCrumbs/BreadCrumbs";

import { useTrialBalance } from "../../../context/TrialBalanceContext/TrialBalanceContext";

import { useChartAccount } from "../../../context/ChartAccountContext/ChartAccountContext";

import { useAccountingPeriod } from "../../../context/AccountingPeriodContext/AccountingPeriodContext";
import { useToast } from "../../../context/ToastContext/ToastContext";
import { useEffect } from "react";

import { useLocation } from "react-router-dom";

const useStyles = makeStyles({
  page: {
    width: "100%",
    boxSizing: "border-box",

    "@media (max-width: 700px)": {
      padding: "0 16px 20px",
    },
  },

  content: {
    // width: "100%",
    // maxWidth: "820px",
    margin: "0 auto",
    padding: "0 10px 10px",

    "@media (max-width: 700px)": {
      maxWidth: "100%",
    },
  },

  header: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "14px 0 18px",
    borderBottom: "1px solid #eeeeee",
    marginBottom: "30px",
  },

  title: {
    fontSize: "18px",
    fontWeight: 600,
    color: "#171717",
  },

  draft: {
    display: "inline-flex",
    alignItems: "center",
    padding: "3px 8px",
    marginLeft: "2px",
    backgroundColor: "#e8e8e8",
    color: "#333333",
    borderRadius: "4px",
    fontSize: "12px",
    lineHeight: "18px",
  },

  topForm: {
    width: "100%",

    maxWidth: "760px",
  },

  field: {
    marginBottom: "12px",
    display: "grid",
    gridTemplateColumns: "150px max-content",
    gap: "10px",
    // flexDirection: "row",
  },

  refInput: {
    // width: "250px",

    "@media (max-width: 700px)": {
      width: "100%",
    },
  },

  periodDropdown: {
    // width: "375px",
    // maxWidth: "100%",

    "@media (max-width: 700px)": {
      width: "100%",
    },
  },

  journalDropdown: {
    // width: "375px",
    // maxWidth: "100%",

    "@media (max-width: 700px)": {
      width: "100%",
    },
  },

  description: {
    minWidth: "60vw",
  },

  attachment: {
    width: "100%",
    minHeight: "60px",
    border: "2px dashed #eeeeee",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxSizing: "border-box",
    cursor: "pointer",
    color: "#333333",
    fontSize: "14px",
    marginTop: "4px",
  },

  attachmentInput: {
    display: "none", 
  },

  accountButtonContainer: {
    display: "flex",
    justifyContent: "flex-end",
    marginBottom: "12px",
  },

  accountButton: {
    backgroundColor: "#3f82e8",
    color: "#ffffff",

    ":hover": {
      backgroundColor: "#3475d4",
    },
  },

  tableWrapper: {
    width: "100%",
    marginTop: "12px",
    overflowX: "auto",
  },

  table: {
    width: "100%",
    minWidth: "680px",
    borderCollapse: "collapse",
  },

  headerCells: {
    fontWeight: 700,
    fontSize: "14px",
    color: "#171717",
    padding: "8px 10px",
    borderBottom: "2px solid #dddddd",
  },

  tableCell: {
    padding: "8px 10px",
    borderBottom: "1px solid #eeeeee",
    verticalAlign: "middle",
  },

  lineNo: {
    width: "70px",
    textAlign: "center",
  },

  accountCell: {
    minWidth: "330px",
  },

  accountDropdown: {
    width: "100%",
  },

  amountCell: {
    width: "140px",
  },

  amountInput: {
    width: "100%",
  },

  addCell: {
    width: "45px",
    textAlign: "center",
  },

  totals: {
    width: "300px",
    marginLeft: "auto",
    marginTop: "10px",

    "@media (max-width: 700px)": {
      width: "100%",
      maxWidth: "350px",
    },
  },

  totalRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: "12px",
    minHeight: "42px",
  },

  totalLabel: {
    minWidth: "70px",
    textAlign: "right",
    fontSize: "14px",
    color: "#171717",
  },

  totalInput: {
    width: "155px",
  },

  statusInput: {
    width: "225px",
  },

  profitLabel: {
    minWidth: "225px",
    textAlign: "left",
    fontSize: "14px",
  },

  footer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "30px",
    paddingBottom: "10px",

    "@media (max-width: 700px)": {
      flexDirection: "row",
      gap: "12px",
    },
  },

  saveButton: {
    backgroundColor: "#3f82e8",
    color: "#ffffff",

    ":hover": {
      backgroundColor: "#3475d4",
    },
  },
});

const JOURNAL_TYPES = [
  { value: "0", label: "General" },
  { value: "1", label: "Opening" },
  { value: "2", label: "Adjustment" },
];

const CreateTrialBalance = () => {
  const styles = useStyles();
  const navigate = useNavigate();
  const location = useLocation();
  const { trialBalanceId, journalId } = useParams();

  const csvImportMode = location.state?.importMode === "csv";

  const importedCsvRows = React.useMemo(() => location.state?.csvRows || [], [location.state?.csvRows]);

  const { showSuccess, showError } = useToast();

  const { getTrialBalanceById, updateTrialBalance, importTrialBalance, createOrUpdateJournal, getJournalById } = useTrialBalance();

  const { chartAccounts, getChartAccounts } = useChartAccount();

  const {
    accountingPeriods,
    loading: accountingPeriodLoading,
    getAccountingPeriods,
  } = useAccountingPeriod();

  const [trialBalanceData, setTrialBalanceData] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [importing, setImporting] = React.useState(false);
  const [importCompleted, setImportCompleted] = React.useState(false);

  const isReadOnlyCsvMode = csvImportMode && !importCompleted;

  const [formData, setFormData] = React.useState({
    refNo: "",
    journalType: 0,
    accountingPeriodId: "",
    periodStart: "",
    periodEnd: "",
    accountingPeriodId: "",
    journalId: "",
    description: "Trial balance",
    file: null,
  });

  // const [lines, setLines] = React.useState([
  //   {
  //     lineNo: 1,
  //     accountId: "",
  //     debit: "",
  //     credit: "",
  //     accountNature: null,
  //   },
  // ]);

  const [lines, setLines] = React.useState([]);

  const debitRefs = React.useRef([]);
  const creditRefs = React.useRef([]);

  /* ---------------------------------------------------------
   * LOAD TRIAL BALANCE + SUPPORTING DATA
   * --------------------------------------------------------- */
  useEffect(() => {
    let mounted = true;

    const loadData = async () => {
      try {
        if (!trialBalanceId) {
          return;
        }

        const [trialBalanceRes, chartAccountsRes] = await Promise.all([
          getJournalById(trialBalanceId, journalId),
          getChartAccounts(),
          getAccountingPeriods(),
        ]);

        if (!mounted) return;

        const trialBalance = trialBalanceRes?.result || trialBalanceRes;
        const availableAccounts = chartAccountsRes || [];
        console.log("trialBalance", trialBalance)
        setTrialBalanceData(trialBalance);

        const periodIdVal =
          trialBalance?.period?.id ||
          trialBalance?.periodId ||
          trialBalance?.accountingPeriodId ||
          "";

        setFormData({
          refNo:
            trialBalance?.trialBalance?.name ||
            trialBalance?.trialBalance?.refNo ||
            trialBalance?.refNo ||
            "",
          journalType: Number(
            trialBalance?.type ??
            trialBalance?.trialBalanceType ??
            trialBalance?.journalType ??
            0
          ),
          periodStart: trialBalance?.periodStart ?? "",
          periodEnd: trialBalance?.periodEnd ?? "",
          accountingPeriodId: periodIdVal,
          journalId: trialBalance?.journalId || "",
          journalIds: trialBalance?.journalIds || [],
          description: trialBalance?.journals?.[0]?.description || "",
          file: trialBalance?.attachments
            ? {
              name: trialBalance.attachments.name,
              path: trialBalance.attachments.path,
            }
            : null,
        });

        if (
          trialBalance?.items &&
          Array.isArray(trialBalance.items) &&
          trialBalance.items.length > 0
        ) {
          const mappedLines = trialBalance.items.map((item, index) => {
            let accountId = item.account?.id || item.accountId || "";
            let account = availableAccounts.find((a) => a.id === accountId);

            if (!account && item.account?.code) {
              account = availableAccounts.find(
                (a) => String(a.code).trim() === String(item.account.code).trim()
              );
              if (account) accountId = account.id;
            }

            if (!account && item.accountCode) {
              account = availableAccounts.find(
                (a) => String(a.code).trim() === String(item.accountCode).trim()
              );
              if (account) accountId = account.id;
            }

            const codeVal = account?.code || item.account?.code || item.accountCode || "";
            const nameVal = account?.accountName || item.account?.name || item.accountName || codeVal || "";

            return {
              lineNo: index + 1,
              accountId: accountId,
              accountCode: codeVal,
              accountName: nameVal,
              debit:
                item.debit !== undefined && item.debit !== null && item.debit !== 0
                  ? String(item.debit)
                  : "",
              credit:
                item.credit !== undefined && item.credit !== null && item.credit !== 0
                  ? String(item.credit)
                  : "",
              note: item.note || "",
              accountNature: getAccountNature(account),
            };
          });

          setLines(mappedLines);
        }
      } catch (error) {
        console.error("Failed to load Trial Balance:", error);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };
    loadData();

    return () => {
      mounted = false;
    };
  }, [trialBalanceId]);
  console.log("formData", formData)

  const hasInitializedLines = React.useRef(false);

  useEffect(() => {
    if (loading) return;

    // CSV import mode — map imported rows to lines (runs once)
    if (csvImportMode && importedCsvRows.length > 0 && !hasInitializedLines.current) {
      const mappedLines = importedCsvRows.map((row, index) => {
        const account = (chartAccounts || []).find(
          (item) =>
            String(item.code || "").trim() === String(row.accountCode || "").trim() ||
            String(item.accountName || "").trim().toLowerCase() === String(row.accountName || "").trim().toLowerCase()
        );

        const accountNature = getAccountNature(account);
        const codeVal = account?.code || row.accountCode || "";
        const nameVal = account?.accountName || row.accountName || (row.accountCode ? `Account ${row.accountCode}` : "");

        return {
          lineNo: index + 1,
          accountId: account?.id || "",
          accountCode: codeVal,
          accountName: nameVal,
          debit: row.debit || "",
          credit: row.credit || "",
          accountNature,
        };
      });

      setLines(mappedLines);
      hasInitializedLines.current = true;
      return;
    }

    // Enrich existing lines with account info (runs once after chartAccounts load)
    if (!hasInitializedLines.current && lines.length > 0) {
      setLines((prevLines) =>
        prevLines.map((line) => {
          const account = getAccountById(line.accountId);
          return {
            ...line,
            accountCode: line.accountCode || account?.code || "",
            accountName: line.accountName || account?.accountName || "",
            accountNature: getAccountNature(account) || line.accountNature,
          };
        })
      );
      hasInitializedLines.current = true;
      return;
    }

    // Manual mode starts with one empty row
    if (!csvImportMode && lines.length === 0 && !hasInitializedLines.current) {
      setLines([
        {
          lineNo: 1,
          accountId: "",
          accountCode: "",
          accountName: "",
          debit: "",
          credit: "",
          accountNature: null,
        },
      ]);
      hasInitializedLines.current = true;
    }
  }, [loading, csvImportMode, importedCsvRows, chartAccounts]);
  /* ---------------------------------------------------------
   * HELPERS
   * --------------------------------------------------------- */
  const formatDate = (date) => {
    if (!date) return "";

    return new Date(date).toLocaleDateString("en-GB");
  };

  const formatCurrency = (value) => {
    return `£${Number(value || 0).toLocaleString("en-GB", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const getAccountNature = (account) => {
    if (!account) return null;

    const nature = account.accountType?.nature ?? account.nature;

    if (
      nature === 1 ||
      nature === "1" ||
      String(nature).toLowerCase() === "debit" ||
      String(nature).toLowerCase() === "dr"
    ) {
      return "debit";
    }

    if (
      nature === 0 ||
      nature === "0" ||
      String(nature).toLowerCase() === "credit" ||
      String(nature).toLowerCase() === "cr"
    ) {
      return "credit";
    }

    return null;
  };

  const getAccountById = (accountId) => {
    return (chartAccounts || []).find((account) => account.id === accountId);
  };

  const getPeriodLabel = (period) => {
    if (!period) return "";

    return `${formatDate(period.periodFrom)} - ${formatDate(period.periodTo)}`;
  };

  const selectedPeriod = (accountingPeriods || []).find(
    (period) => period.id === formData.accountingPeriodId,
  );

  const selectedPeriodLabel = selectedPeriod
    ? getPeriodLabel(selectedPeriod)
    : trialBalanceData?.accountingPeriod
      ? getPeriodLabel(trialBalanceData.accountingPeriod)
      : trialBalanceData?.period
        ? getPeriodLabel(trialBalanceData.period)
        : trialBalanceData?.periodStart ? `${formatDate(trialBalanceData.periodStart)} - ${formatDate(trialBalanceData.periodEnd)}` : "";

  /* ---------------------------------------------------------
   * FORM CHANGE
   * --------------------------------------------------------- */
  const handleFormChange = (name, value) => {
    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  /* ---------------------------------------------------------
   * ACCOUNT SELECTION
   * --------------------------------------------------------- */
  /* ---------------------------------------------------------
   * ACCOUNT SELECTION & NAME EDIT
   * --------------------------------------------------------- */
  const handleAccountChange = (index, accountId) => {
    const account = getAccountById(accountId);
    const nature = getAccountNature(account);

    setLines((previous) => {
      const updated = previous.map((line, lineIndex) => {
        if (lineIndex !== index) return line;

        return {
          ...line,
          accountId: accountId || "",
          accountCode: account?.code || "",
          accountName: account?.accountName || "",
          accountNature: nature,
        };
      });

      // If this was the last empty row,
      // create a new empty row.
      if (index === updated.length - 1 && accountId) {
        return ensureLastEmptyRow(updated);
      }

      return updated;
    });

    setTimeout(() => {
      if (nature === "debit") {
        debitRefs.current[index]?.focus();
      } else if (nature === "credit") {
        creditRefs.current[index]?.focus();
      }
    }, 50);
  };

  const handleAccountNameChange = (index, value) => {
    const matchingAccount = (chartAccounts || []).find(
      (a) =>
        String(a.accountName || "").toLowerCase() === value.toLowerCase() ||
        String(a.code || "").toLowerCase() === value.toLowerCase()
    );

    const nature = getAccountNature(matchingAccount);

    setLines((previous) => {
      const updated = previous.map((line, lineIndex) => {
        if (lineIndex !== index) return line;

        return {
          ...line,
          accountId: matchingAccount?.id || line.accountId || "",
          accountCode: matchingAccount?.code || line.accountCode || "",
          accountName: value,
          accountNature: nature || line.accountNature,
        };
      });

      if (index === updated.length - 1 && value.trim() !== "") {
        return ensureLastEmptyRow(updated);
      }

      return updated;
    });
  };


  const handleAmountChange = (index, field, value) => {
    if (value !== "" && !/^\d*\.?\d*$/.test(value)) {
      return;
    }

    setLines((previous) => {
      const updated = previous.map((line, lineIndex) => {
        if (lineIndex !== index) {
          return line;
        }

        return {
          ...line,
          [field]: value,

          ...(field === "debit"
            ? { credit: "0" }
            : { debit: "0" }),
        };
      });

      // If user entered an amount in the last row,
      // create a new empty row.
      if (
        index === updated.length - 1 &&
        value !== ""
      ) {
        return ensureLastEmptyRow(updated);
      }

      return updated;
    });
  };


  /* ---------------------------------------------------------
   * ADD JOURNAL LINE
   * --------------------------------------------------------- */
  const addLine = () => {
    setLines((previous) => [
      ...previous,
      {
        lineNo: previous.length + 1,
        accountId: "",
        accountCode: "",
        accountName: "",
        debit: "",
        credit: "",
        accountNature: null,
      },
    ]);
  };

  const ensureLastEmptyRow = (lines) => {
    if (!lines || lines.length === 0) return lines;
    const lastLine = lines[lines.length - 1];

    const lastLineHasValue =
      lastLine.accountId ||
      lastLine.accountName ||
      lastLine.accountCode ||
      lastLine.debit ||
      lastLine.credit;

    if (lastLineHasValue) {
      return [
        ...lines,
        {
          lineNo: lines.length + 1,
          accountId: "",
          accountCode: "",
          accountName: "",
          debit: "",
          credit: "",
          accountNature: null,
        },
      ];
    }

    return lines;
  };

  const deleteLine = (index) => {
    setLines((previous) => {
      if (previous.length <= 1) {
        return previous;
      }

      return previous
        .filter((_, lineIndex) => lineIndex !== index)
        .map((line, lineIndex) => ({
          ...line,
          lineNo: lineIndex + 1,
        }));
    });
  };

  /* ---------------------------------------------------------
   * TOTALS
   * --------------------------------------------------------- */

  const totalDebit = React.useMemo(() => {
    return lines.reduce(
      (total, line) => total + (parseFloat(line.debit) || 0),
      0,
    );
  }, [lines]);

  const totalCredit = React.useMemo(() => {
    return lines.reduce(
      (total, line) => total + (parseFloat(line.credit) || 0),
      0,
    );
  }, [lines]);

  const balanceAmount = Math.abs(totalDebit - totalCredit);

  const balanceSide =
    totalDebit > totalCredit
      ? "Debit"
      : totalCredit > totalDebit
        ? "Credit"
        : "";

  const isBalanced = Math.abs(totalDebit - totalCredit) < 0.000001;

  // Profit/Loss
  const profitLossAmount = balanceAmount;

  const profitLossLabel =
    totalCredit > totalDebit
      ? "Profit"
      : totalDebit > totalCredit
        ? "Loss"
        : "Profit / Loss";

  const turnover = Math.max(totalDebit, totalCredit);


  const handleImportCsv = async () => {
    try {
      setImporting(true);

      // ============================================================
      // VALIDATE TRIAL BALANCE REF NO
      // ============================================================

      if (!formData.refNo) {
        showError(
          "Trial Balance reference number is missing."
        );
        return;
      }


      // ============================================================
      // BUILD RAW IMPORT ROWS
      //
      // IMPORTANT:
      // Do NOT resolve Chart Accounts here.
      //
      // The imported CSV can contain invalid account codes.
      // We store the values exactly as imported.
      // ============================================================

      const importRows = lines
        .filter((line) => {
          return (
            line.accountCode ||
            line.accountName ||
            line.debit ||
            line.credit
          );
        })
        .map((line) => ({
          code:
            line.accountCode || "",

          name:
            line.accountName || "",

          // AccountNature is required by the backend model.
          // 1 = Debit
          // 0 = Credit
          nature:
            parseFloat(line.debit) > 0
              ? 1
              : 0,

          debit:
            parseFloat(line.debit) || 0,

          credit:
            parseFloat(line.credit) || 0,

          note:
            line.note || "",
        }));


      // ============================================================
      // VALIDATE ROWS
      // ============================================================

      if (importRows.length === 0) {
        showError(
          "CSV does not contain any valid rows."
        );
        return;
      }


      // ============================================================
      // CSV HEADERS
      // ============================================================
      //
      // These are the headers of the CSV being imported.
      // They are not Chart Account values.
      // ============================================================

      const headers = [
        "Account Code",
        "Account Name",
        "Debit",
        "Credit",
      ];


      // ============================================================
      // CSV COLUMN CONFIGURATION
      // ============================================================

      const columns = [
        {
          type: 0,
          index: 0,
          name: "Account Code",
        },
        {
          type: 0,
          index: 1,
          name: "Account Name",
        },
        {
          type: 0,
          index: 2,
          name: "Debit",
        },
        {
          type: 0,
          index: 3,
          name: "Credit",
        },
      ];


      // ============================================================
      // BUILD IMPORT PAYLOAD
      // ============================================================

      const payload = {
        columns,

        headers,

        rows: importRows,

        csvImportType:
          Number(
            formData.csvImportType ?? 0
          ),
      };


      console.log(
        "CSV Import Payload:",
        payload
      );


      // ============================================================
      // CALL IMPORT API
      //
      // POST:
      // /api/TrialBalances/{RefNo}/imports
      //
      // Example:
      // /api/TrialBalances/TB-34/imports
      // ============================================================

      const response =
        await importTrialBalance(
          formData.refNo,
          payload
        );


      console.log(
        "CSV Import Response:",
        response
      );


      // ============================================================
      // SUCCESS
      // ============================================================

      showSuccess(
        "CSV imported successfully."
      );

      setImportCompleted(true);

    } catch (err) {
      console.error(
        "Failed to import CSV:",
        err
      );

      showError(
        err?.response?.data?.message ||
        "Failed to import CSV."
      );

    } finally {
      setImporting(false);
    }
  };

  // const handleSave = async () => {
  //   if (!trialBalanceId) {
  //     showError("Trial Balance ID is missing.");
  //     return;
  //   }

  //   // Prevent saving an unbalanced trial balance
  //   if (!isBalanced) {
  //     showError(
  //       `Amount is not balanced. Debit and Credit must be equal (Debit: ${formatCurrency(
  //         totalDebit
  //       )}, Credit: ${formatCurrency(totalCredit)}).`
  //     );

  //     return;
  //   }

  //   try {
  //     setSaving(true);

  //     const mappedItems = lines
  //       .filter(
  //         (line) =>
  //           (line.accountId || line.accountName || line.accountCode) &&
  //           (parseFloat(line.debit) || parseFloat(line.credit))
  //       )
  //       .map((line) => {
  //         const account = getAccountById(line.accountId);
  //         return {
  //           accountCode: line.accountCode || account?.code || "",
  //           accountName: line.accountName || account?.accountName || "",
  //           debit: parseFloat(line.debit) || 0,
  //           credit: parseFloat(line.credit) || 0,
  //           note: line.note || "",
  //         };
  //       });

  //     const payload = {
  //       type: Number(formData.journalType ?? 0),
  //       journalType: Number(formData.journalType ?? 0),
  //       periodStart: formData.periodStart || null,
  //       periodEnd: formData.periodEnd || null,
  //       journalId: formData?.journalIds?.[0] !== "0" ?  formData?.journalIds?.[0] : null,
  //       periodId: formData.accountingPeriodId || null,
  //       accountingPeriodId: formData.accountingPeriodId || null,
  //       description: formData.description || "",
  //       turnover,
  //       totalProfitLoss: profitLossAmount,
  //       status: isBalanced ? 1 : 0,
  //       items: mappedItems,
  //     };

  //     console.log("PATCH Trial Balance payload:", payload);

  //     const res = await updateTrialBalance(trialBalanceId, payload);

  //     const message = res?.message || "Trial balance updated successfully.";

  //     showSuccess(message);
  //     navigate("/trial-balances");
  //   } catch (error) {
  //     console.error("Failed to update Trial Balance:", error);
  //     showError(error);
  //   } finally {
  //     setSaving(false);
  //   }
  // };


  const handleSave = async () => {
    if (!trialBalanceId) {
      showError("Trial Balance ID is missing.");
      return;
    }

    // Prevent saving an unbalanced trial balance
    if (!isBalanced) {
      showError(
        `Amount is not balanced. Debit and Credit must be equal (Debit: ${formatCurrency(
          totalDebit
        )}, Credit: ${formatCurrency(totalCredit)}).`
      );

      return;
    }

    try {
      setSaving(true);

      // ==========================================================
      // MAP JOURNAL ITEMS
      // ==========================================================

      const mappedItems = lines
        .filter(
          (line) =>
            (line.accountId ||
              line.accountName ||
              line.accountCode) &&
            (parseFloat(line.debit) ||
              parseFloat(line.credit))
        )
        .map((line) => {
          const account =
            getAccountById(line.accountId);

          return {
            accountCode:
              line.accountCode ||
              account?.code ||
              "",

            accountName:
              line.accountName ||
              account?.accountName ||
              "",

            debit:
              parseFloat(line.debit) || 0,

            credit:
              parseFloat(line.credit) || 0,

            note:
              line.note || "",

            // If your backend expects Nature
            nature:
              (parseFloat(line.debit) || 0) > 0
                ? 1
                : 0,
          };
        });


      // ==========================================================
      // GET JOURNAL ID
      //
      // "0" = CREATE NEW JOURNAL
      // MongoDB ID = UPDATE EXISTING JOURNAL
      // ==========================================================

      const journalId =
        formData?.journalIds?.[0] || "0";


      // ==========================================================
      // JOURNAL PAYLOAD
      // ==========================================================

      const journalPayload = {
        type:
          Number(formData.journalType ?? 0),

        journalType:
          Number(formData.journalType ?? 0),

        periodStart:
          formData.periodStart || null,

        periodEnd:
          formData.periodEnd || null,

        periodId:
          formData.accountingPeriodId || null,

        description:
          formData.description || "",

        journalStatus:
          0,

        importType:
          1,

        csvImportType:
          0,

        isActive:
          true,

        items:
          mappedItems,

        itemsCount:
          mappedItems.length,

        totalDebit:
          totalDebit,

        totalCredit:
          totalCredit,

        status:
          isBalanced ? 1 : 0,
      };


      console.log(
        "Journal ID:",
        journalId
      );

      console.log(
        "Journal Payload:",
        journalPayload
      );


      // ==========================================================
      // CREATE / UPDATE JOURNAL
      // ==========================================================

      const response =
        await createOrUpdateJournal(
          formData.refNo || formData.number,
          journalId,
          journalPayload, formData.file

        );


      // ==========================================================
      // SUCCESS
      // ==========================================================

      const message =
        response?.message ||
        (
          journalId === "0"
            ? "Journal created successfully."
            : "Journal updated successfully."
        );

      showSuccess(message);

      navigate("/trial-balances");

    } catch (error) {
      console.error(
        "Failed to save Journal:",
        error
      );

      showError(
        error?.response?.data?.message ||
        error?.message ||
        "Failed to save Journal."
      );

    } finally {
      setSaving(false);
    }
  };


  // const handleSave = async () => {
  //   if (!trialBalanceId) {
  //     showError("Trial Balance ID is missing.");
  //     return;
  //   }

  //   if (!isBalanced) {
  //     showError(
  //       `Amount is not balanced. Debit and Credit must be equal 
  //       (Debit: ${formatCurrency(totalDebit)}, 
  //        Credit: ${formatCurrency(totalCredit)}).`
  //     );
  //     return;
  //   }

  //   try {
  //     setSaving(true);

  //     const mappedItems = lines
  //       .filter(
  //         (line) =>
  //           (line.accountId ||
  //             line.accountName ||
  //             line.accountCode) &&
  //           (parseFloat(line.debit) ||
  //             parseFloat(line.credit))
  //       )
  //       .map((line) => {
  //         const account = getAccountById(line.accountId);

  //         return {
  //           accountCode:
  //             line.accountCode ||
  //             account?.code ||
  //             "",

  //           accountName:
  //             line.accountName ||
  //             account?.accountName ||
  //             "",

  //           debit: parseFloat(line.debit) || 0,
  //           credit: parseFloat(line.credit) || 0,
  //           note: line.note || "",
  //         };
  //       });

  //     // IMPORTANT
  //     const journalId =
  //       formData?.journalId &&
  //       formData.journalId !== "0"
  //         ? formData.journalId
  //         : "0";

  //     const journalPayload = {
  //       type: Number(formData.journalType ?? 0),

  //       journalType:
  //         Number(formData.journalType ?? 0),

  //       journalStatus:
  //         Number(formData.journalStatus ?? 0),

  //       importType: 1,

  //       csvImportType: 0,

  //       periodStart:
  //         formData.periodStart || null,

  //       periodEnd:
  //         formData.periodEnd || null,

  //       description:
  //         formData.description || "",

  //       isActive: true,

  //       items: mappedItems,

  //       itemsCount: mappedItems.length,

  //       totalDebit: totalDebit,

  //       totalCredit: totalCredit,

  //       status: isBalanced ? 1 : 0,
  //     };

  //     console.log("Journal ID:", journalId);
  //     console.log("Journal Payload:", journalPayload);

  //     const response =
  //       await createOrUpdateJournal(
  //         formData.refNo,
  //         journalId,
  //         journalPayload,
  //         formData.file || null
  //       );

  //     showSuccess(
  //       response?.message ||
  //         "Journal saved successfully."
  //     );

  //     navigate("/trial-balances");

  //   } catch (error) {
  //     console.error(
  //       "Failed to save journal:",
  //       error
  //     );

  //     showError(
  //       error?.response?.data?.message ||
  //       "Failed to save journal."
  //     );

  //   } finally {
  //     setSaving(false);
  //   }
  // };
  /* ---------------------------------------------------------
   * LOADING
   * --------------------------------------------------------- */
  if (loading) {
    return (
      <div className={styles.page}>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            padding: "60px",
          }}
        >
          <Spinner label="Loading trial balance..." />
        </div>
      </div>
    );
  }

  /* ---------------------------------------------------------
   * UI
   * --------------------------------------------------------- */
  return (
    <div className={styles.page}>
      {/* <BreadCrumbs /> */}

      <div className={styles.content}>
        {/* HEADER */}
        <div className={styles.header}>
          <span className={styles.title}>
            Add Journal
            {formData.refNo ? ` (${formData.refNo}-J01)` : ""}
          </span>

          <span className={styles.draft}>Draft</span>
        </div>

        {/* TOP FORM */}
        <div className={styles.topForm}>
          <Field className={styles.field} label="Ref. No.">
            <Input
              className={styles.refInput}
              value={formData.refNo}
              disabled
            />
          </Field>

          {/* ACCOUNTING PERIOD LIST */}
          <Field className={styles.field} label="Period">
            <Dropdown
              className={styles.periodDropdown}
              placeholder={
                accountingPeriodLoading ? "Loading periods..." : "Select period"
              }
              value={selectedPeriodLabel}
              onOptionSelect={(_, data) => {
                handleFormChange("accountingPeriodId", data.optionValue);
              }}
            >
              {(accountingPeriods || []).map((period) => (
                <Option key={period.id} value={period.id}>
                  {getPeriodLabel(period)}
                </Option>
              ))}
            </Dropdown>
          </Field>

          {/* JOURNAL TYPE */}
          <Field className={styles.field} label="Journal type">
            <Dropdown
              className={styles.journalDropdown}
              value={
                JOURNAL_TYPES.find(
                  (type) => Number(type.value) === Number(formData.journalType),
                )?.label || ""
              }
              onOptionSelect={(_, data) => {
                handleFormChange("journalType", Number(data.optionValue));
              }}
            >
              {JOURNAL_TYPES.map((type) => (
                <Option key={type.value} value={type.value}>
                  {type.label}
                </Option>
              ))}
            </Dropdown>
          </Field>

          {/* DESCRIPTION */}
          <Field className={styles.field} label="Description">
            <Textarea
              className={styles.description}
              value={formData.description}
              onChange={(event) =>
                handleFormChange("description", event.target.value)
              }
            />
          </Field>

          {/* ATTACHMENT */}
          <Field className={styles.field} label="Attachments">
            <label className={styles.attachment}>
              <span>
                {formData.file ? formData.file.name : "Select or drop files"}
              </span>

              <input
                className={styles.attachmentInput}
                type="file"
                onChange={(event) =>
                  handleFormChange("file", event.target.files?.[0] || null)
                }
              />
            </label>
          </Field>
        </div>

        {/* JOURNAL TABLE & TOTALS SECTION */}
        {isReadOnlyCsvMode ? (
          <div className={styles.tableWrapper}>
            <h4 style={{ marginBottom: "12px", fontSize: "15px", fontWeight: 600 }}>CSV Mapped Preview</h4>
            <Table className={styles.table}>
              <TableHeader>
                <TableRow>
                  <TableHeaderCell className={styles.headerCell}>Line no</TableHeaderCell>
                  <TableHeaderCell className={styles.headerCell}>Account</TableHeaderCell>
                  <TableHeaderCell className={styles.headerCell}>Debit (£)</TableHeaderCell>
                  <TableHeaderCell className={styles.headerCell}>Credit (£)</TableHeaderCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {lines.map((line) => (
                  <TableRow key={line.lineNo}>
                    <TableCell className={styles.tableCells}>
                      <div className={styles.lineNo}>{line.lineNo}</div>
                    </TableCell>
                    <TableCell className={`${styles.tableCells} ${styles.accountCell}`}>
                      <span>
                        {line.accountCode && line.accountName
                          ? `${line.accountCode} - ${line.accountName}`
                          : line.accountName || line.accountCode || "-"}
                      </span>
                    </TableCell>
                    <TableCell className={styles.tableCells}>
                      <span>{line.debit ? formatCurrency(line.debit) : "-"}</span>
                    </TableCell>
                    <TableCell className={styles.tableCells}>
                      <span>{line.credit ? formatCurrency(line.credit) : "-"}</span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <>
            {/* ACCOUNT BUTTON */}
            {!csvImportMode && (
              <div className={styles.accountButtonContainer}>
                <Button
                  className={styles.accountButton}
                  icon={<AddRegular />}
                  onClick={addLine}
                >
                  Account
                </Button>
              </div>
            )}

            {/* JOURNAL TABLE (EDITABLE) */}
            <div className={styles.tableWrapper}>
              <Table className={styles.table}>
                <TableHeader>
                  <TableRow>
                    <TableHeaderCell className={styles.headerCell}>Line no</TableHeaderCell>
                    <TableHeaderCell className={styles.headerCell}>Account</TableHeaderCell>
                    <TableHeaderCell className={styles.headerCell}>Debit (£)</TableHeaderCell>
                    <TableHeaderCell className={styles.headerCell}>Credit (£)</TableHeaderCell>
                    <TableHeaderCell className={styles.headerCell}>Actions</TableHeaderCell>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {lines.map((line, index) => (
                    <TableRow key={line.lineNo}>
                      <TableCell className={styles.tableCells}>
                        <div className={styles.lineNo}>{line.lineNo}</div>
                      </TableCell>
                      <TableCell className={`${styles.tableCells} ${styles.accountCell}`}>
                        <Combobox
                          className={styles.accountDropdown}
                          placeholder="Select or type account"
                          freeform={true}
                          value={
                            line.accountName ||
                            (line.accountCode ? `${line.accountCode} - ${line.accountName || ""}` : "") ||
                            getAccountById(line.accountId)?.accountName ||
                            ""
                          }
                          onChange={(event) =>
                            handleAccountNameChange(index, event.target.value)
                          }
                          onOptionSelect={(_, data) =>
                            handleAccountChange(index, data.optionValue)
                          }
                        >
                          {(chartAccounts || []).map((account) => (
                            <Option key={account.id} value={account.id} text={account.accountName}>
                              {account.code ? `${account.code} - ` : ""}
                              {account.accountName}
                            </Option>
                          ))}
                        </Combobox>
                      </TableCell>
                      <TableCell className={styles.tableCells}>
                        <Input
                          ref={(element) => {
                            debitRefs.current[index] = element;
                          }}
                          className={styles.amountInput}
                          value={line.debit}
                          placeholder="£0.00"
                          onChange={(event) =>
                            handleAmountChange(index, "debit", event.target.value)
                          }
                        />
                      </TableCell>
                      <TableCell className={styles.tableCells}>
                        <Input
                          ref={(element) => {
                            creditRefs.current[index] = element;
                          }}
                          className={styles.amountInput}
                          value={line.credit}
                          placeholder="£0.00"
                          onChange={(event) =>
                            handleAmountChange(index, "credit", event.target.value)
                          }
                        />
                      </TableCell>
                      <TableCell className={`${styles.tableCells} ${styles.addCell}`}>
                        {index === lines.length - 1 ? (
                          <Button
                            appearance="subtle"
                            icon={<AddRegular />}
                            onClick={addLine}
                            aria-label="Add journal line"
                            title="Add journal line"
                            disabled={!line.accountId && !line.debit && !line.credit}
                          />
                        ) : (
                          <Button
                            appearance="subtle"
                            icon={<Delete16Regular />}
                            onClick={() => deleteLine(index)}
                            aria-label="Delete journal line"
                            title="Delete journal line"
                          />
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* TOTALS SECTION */}
            <div className={styles.totals}>
              <div className={styles.totalRow}>
                <span className={styles.totalLabel}>Total Dr.</span>
                <Input className={styles.totalInput} value={formatCurrency(totalDebit)} readOnly />
              </div>

              <div className={styles.totalRow}>
                <span className={styles.totalLabel}>Total Cr.</span>
                <Input className={styles.totalInput} value={formatCurrency(totalCredit)} readOnly />
              </div>

              <div className={styles.totalRow}>
                <span className={styles.totalLabel}>Status</span>
                <Input
                  className={styles.statusInput}
                  value={
                    isBalanced
                      ? "Balanced"
                      : `${balanceSide} ${formatCurrency(balanceAmount)}`
                  }
                  readOnly
                  style={{
                    color: isBalanced ? "#107c10" : "#d13438",
                  }}
                />
              </div>

              <div className={styles.totalRow}>
                <span className={styles.totalLabel}>{profitLossLabel}</span>
                <span className={styles.profitLabel}>{formatCurrency(profitLossAmount)}</span>
              </div>
            </div>
          </>
        )}


        {/* FOOTER */}
        <div className={styles.footer}>
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <Button
              appearance="secondary"
              icon={<ArrowLeftRegular />}
              onClick={() => navigate(-1)}
            >
              Back
            </Button>

            {isReadOnlyCsvMode && (
              <Button
                className={styles.saveButton}
                onClick={handleImportCsv}
                disabled={importing}
              >
                {importing ? "Importing..." : "Import"}
              </Button>
            )}
          </div>

          {!isReadOnlyCsvMode && (
            <Menu>
              <MenuTrigger disableButtonEnhancement>
                <Button
                  className={styles.saveButton}
                  icon={<Save20Regular />}
                  disabled={saving}
                >
                  {saving ? "Saving..." : "Save"}
                  <ChevronDown20Regular />
                </Button>
              </MenuTrigger>

              <MenuPopover>
                <MenuList>
                  <MenuItem onClick={handleSave} disabled={saving}>
                    Save Draft
                  </MenuItem>

                  <MenuItem onClick={handleSave} disabled={saving}>
                    Post
                  </MenuItem>

                  <MenuItem onClick={handleSave} disabled={saving}>
                    Post & Add Accounts
                  </MenuItem>
                </MenuList>
              </MenuPopover>
            </Menu>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateTrialBalance;
