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
    padding: "0 28px 28px",

    "@media (max-width: 700px)": {
      padding: "0 16px 20px",
    },
  },

  content: {
    width: "100%",
    maxWidth: "820px",
    margin: "0 auto",

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
  },

  refInput: {
    width: "250px",

    "@media (max-width: 700px)": {
      width: "100%",
    },
  },

  periodDropdown: {
    width: "375px",
    maxWidth: "100%",

    "@media (max-width: 700px)": {
      width: "100%",
    },
  },

  journalDropdown: {
    width: "375px",
    maxWidth: "100%",

    "@media (max-width: 700px)": {
      width: "100%",
    },
  },

  description: {
    width: "100%",
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
  const { trialBalanceId } = useParams();

  const csvImportMode = location.state?.importMode === "csv";
  const importedCsvRows = location.state?.csvRows || [];

  const { showSuccess, showError } = useToast();

  const { getTrialBalanceById, updateTrialBalance } = useTrialBalance();

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
          getTrialBalanceById(trialBalanceId),
          getChartAccounts(),
          getAccountingPeriods(),
        ]);

        if (!mounted) return;

        const trialBalance = trialBalanceRes?.result || trialBalanceRes;
        const availableAccounts = chartAccountsRes || [];

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
          accountingPeriodId: periodIdVal,
          journalId: trialBalance?.journalId || "",
          description: trialBalance?.description || "",
          file: null,
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

  useEffect(() => {
    if (loading) return;

    if (csvImportMode && importedCsvRows.length > 0) {
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
      return;
    }

    if (lines.length > 0) {
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
      return;
    }

    // Manual mode starts with one empty row
    if (!csvImportMode && lines.length === 0) {
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
      nature === 2 ||
      nature === "2" ||
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
        : "";

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

  // const totalCredit = React.useMemo(() => {
  //   return lines.reduce(
  //     (total, line) =>
  //       total + (parseFloat(line.credit) || 0),
  //     0
  //   );
  // }, [lines]);
  /* ---------------------------------------------------------
   * SAVE / PATCH
   * --------------------------------------------------------- */
  // const handleSave = async () => {
  //   if (!trialBalanceId) {
  //     alert("Trial Balance ID is missing.");
  //     return;
  //   }

  //   if (!formData.accountingPeriodId) {
  //     alert("Please select an accounting period.");
  //     return;
  //   }

  //   try {
  //     setSaving(true);

  //     const payload = {
  //       journalType: Number(formData.journalType ?? 0),
  //       accountingPeriodId: formData.accountingPeriodId || null,
  //       description: formData.description || null,
  //       turnover,
  //       status: isBalanced ? 1 : 0,
  //     };

  //     console.log("PATCH Trial Balance payload:", payload);

  //     /*
  //      * PATCH returns 204 No Content.
  //      * That is a successful response and does not need response.data.
  //      */
  //     await updateTrialBalance(trialBalanceId, payload);

  //     navigate(-1);
  //   } catch (error) {
  //     console.error("Failed to update Trial Balance:", error);

  //     alert("Failed to save Trial Balance. Please check the API response.");
  //   } finally {
  //     setSaving(false);
  //   }
  // };

  const handleImportCsv = async () => {
    try {
      setImporting(true);

      const mappedItems = lines
        .filter(
          (line) =>
            (line.accountId || line.accountName || line.accountCode) &&
            (parseFloat(line.debit) || parseFloat(line.credit))
        )
        .map((line) => {
          const account = getAccountById(line.accountId);
          return {
            accountCode: line.accountCode || account?.code || "",
            accountName: line.accountName || account?.accountName || "",
            debit: parseFloat(line.debit) || 0,
            credit: parseFloat(line.credit) || 0,
            note: line.note || "",
          };
        });

      if (trialBalanceId) {
        const payload = {
          type: Number(formData.journalType ?? 0),
          journalType: Number(formData.journalType ?? 0),
          periodId: formData.accountingPeriodId || null,
          accountingPeriodId: formData.accountingPeriodId || null,
          description: formData.description || null,
          turnover,
          totalProfitLoss: profitLossAmount,
          status: isBalanced ? 1 : 0,
          items: mappedItems,
        };

        await updateTrialBalance(trialBalanceId, payload);
      }

      showSuccess("CSV imported successfully.");
      setImportCompleted(true);
    } catch (err) {
      console.error("Failed to import CSV:", err);
      showError(err);
    } finally {
      setImporting(false);
    }
  };

  const handleSave = async () => {
    if (!trialBalanceId) {
      showError("Trial Balance ID is missing.");
      return;
    }

    if (!formData.accountingPeriodId) {
      showError("Please select an accounting period.");
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

      const mappedItems = lines
        .filter(
          (line) =>
            (line.accountId || line.accountName || line.accountCode) &&
            (parseFloat(line.debit) || parseFloat(line.credit))
        )
        .map((line) => {
          const account = getAccountById(line.accountId);
          return {
            accountCode: line.accountCode || account?.code || "",
            accountName: line.accountName || account?.accountName || "",
            debit: parseFloat(line.debit) || 0,
            credit: parseFloat(line.credit) || 0,
            note: line.note || "",
          };
        });

      const payload = {
        type: Number(formData.journalType ?? 0),
        journalType: Number(formData.journalType ?? 0),
        periodId: formData.accountingPeriodId || null,
        accountingPeriodId: formData.accountingPeriodId || null,
        description: formData.description || null,
        turnover,
        totalProfitLoss: profitLossAmount,
        status: isBalanced ? 1 : 0,
        items: mappedItems,
      };

      console.log("PATCH Trial Balance payload:", payload);

      const res = await updateTrialBalance(trialBalanceId, payload);
      const message = res?.message || "Trial balance updated successfully.";

      showSuccess(message);
      navigate("/trial-balances");
    } catch (error) {
      console.error("Failed to update Trial Balance:", error);
      showError(error);
    } finally {
      setSaving(false);
    }
  };

  /* ---------------------------------------------------------
   * LOADING
   * --------------------------------------------------------- */
  if (loading) {
    return (
      <div className={styles.page}>
        <BreadCrumbs />

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
      <BreadCrumbs />

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
