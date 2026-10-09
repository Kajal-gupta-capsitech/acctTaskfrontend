import * as React from "react";

import {
  Button,
  Dropdown,
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
  Combobox,
} from "@fluentui/react-components";

import {
  ArrowLeftRegular,
  Save20Regular,
  ChevronDown20Regular,
} from "@fluentui/react-icons";

import { useNavigate, useParams } from "react-router-dom";

import { useTrialBalance } from "../../context/TrialBalanceContext/TrialBalanceContext";

import { useChartAccount } from "../../context/ChartAccountContext/ChartAccountContext";

import { useAccountingPeriod } from "../../context/AccountingPeriodContext/AccountingPeriodContext";
import { useToast } from "../../context/ToastContext/ToastContext";
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
    minWidth: "40vw",
  },

  attachment: {
    minWidth: "40vw",
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

  // accountButtonContainer: {
  //   display: "flex",
  //   justifyContent: "flex-end",
  //   marginBottom: "12px",
  // },

  accountButton: {
    backgroundColor: "#3f82e8",
    color: "#ffffff",

    ":hover": {
      backgroundColor: "#3475d4",
    },
  },

  // tableWrapper: {
  //   width: "100%",
  //   marginTop: "12px",
  //   overflowX: "auto",
  // },

  // table: {
  //   width: "100%",
  //   minWidth: "680px",
  //   borderCollapse: "collapse",
  // },

  headerCells: {
    fontWeight: 700,
    fontSize: "14px",
    color: "#171717",
    padding: "8px 10px",
    borderBottom: "2px solid #dddddd",
  },

  // tableCell: {
  //   padding: "8px 10px",
  //   borderBottom: "1px solid #eeeeee",
  //   verticalAlign: "middle",
  // },

  // lineNo: {
  //   width: "70px",
  //   textAlign: "center",
  // },

  // accountCell: {
  //   minWidth: "330px",
  // },

  // accountDropdown: {
  //   width: "100%",
  // },

  // amountCell: {
  //   width: "140px",
  // },

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

  // totalRow: {
  //   display: "flex",
  //   alignItems: "center",
  //   justifyContent: "flex-end",
  //   gap: "12px",
  //   minHeight: "42px",
  // },
  missingMappingHint: {
    display: "flex",
    justifyContent: "flex-end",
    marginBottom: "10px",
    color: "#b42318",
    fontSize: "13px",
    fontWeight: 500,
    textAlign: "right",
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

const ImportTablePage = () => {
  const styles = useStyles();
  const navigate = useNavigate();
  const location = useLocation();
  const { trialBalanceId, importsId } = useParams();

  const csvImportMode = location.state?.importMode === "csv";

  const importedCsvRows = React.useMemo(() => location.state?.csvRows || [], [location.state?.csvRows]);

  const { showSuccess, showError } = useToast();

  const { getImportsById, importDataToJournal } = useTrialBalance();

  // const { chartAccounts, getChartAccounts } = useChartAccount();

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
  const [trialBalanceResult, setTrialBalanceResult] = React.useState(null);
  const [columns, setColumns] = React.useState([]);

  const [columnMappings, setColumnMappings] = React.useState([]);

  const [importRows, setImportRows] = React.useState([]);
  const [selectedOption, setSelectedOption] = React.useState([]);
  const [columnOption, setColumnOption] = React.useState([
    { value: "1", label: "Ignore" },
    { value: "2", label: "account code" },
    { value: "3", label: "account name" },
    { value: "4", label: "Amount" },
    { value: "5", label: "debit" },
    { value: "6", label: "credit" },
  ]);
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

  const handleColumnSelect = (index, selectedValue) => {
    const alreadyUsed = columnMappings.some(
      (value, i) =>
        i !== index && value === selectedValue
    );

    if (alreadyUsed) {
      showError("This column option is already selected.");
      return;
    }

    const selectedOption = columnOption.find(
      (option) => option.value === selectedValue
    );

    if (!selectedOption) return;

    setColumnMappings((previous) =>
      previous.map((value, i) =>
        i === index ? selectedValue : value
      )
    );

    // Update the header to match the selected option's label
    setColumns((previous) =>
      previous.map((value, i) =>
        i === index ? selectedOption.label : value
      )
    );
  };

  //validation for imports 
  const hasAccount = columnMappings.some(
    (value) => value === "2" || value === "3"
  );

  const hasAmount = columnMappings.includes("4");

  const hasDebitAndCredit =
    columnMappings.includes("5") &&
    columnMappings.includes("6");

  const missingMappings = [];

  if (!hasAccount) {
    missingMappings.push("Account");
  }

  if (!hasAmount && !hasDebitAndCredit) {
    missingMappings.push("Debit/Credit or Amount");
  }


  const [lines, setLines] = React.useState([]);

  const debitRefs = React.useRef([]);
  const creditRefs = React.useRef([]);
  const formatDate = (date) => {
    if (!date) return "";

    return new Date(date).toLocaleDateString("en-GB");
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


  const getColumnMapping = (header) => {
    const normalize = (value) =>
      String(value ?? "").trim().toLowerCase();

    const matchedOption = columnOption.find(
      (option) => normalize(option.label) === normalize(header)
    );

    // Header match nahi hua toh Ignore
    return matchedOption?.value ?? "1";
  };

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
      // VALIDATE ROWS
      // ============================================================

      if (importRows.length === 0) {
        showError(
          "CSV does not contain any valid rows."
        );
        return;
      }


      const payload = {

        description: formData.description,
        periodStart: formData?.periodStart,
        periodEnd: formData?.periodEnd,
        columns,
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
        await importDataToJournal(
          trialBalanceId, importsId,
          payload
        );


      console.log(
        "CSV Import Response:",
        response
      );

      console.log("response", response);
      // return;
      // ============================================================
      // SUCCESS
      // ============================================================
      if (response) {
        showSuccess(
          "CSV imported successfully."
        );

        navigate(`/trial-balances/${trialBalanceId}/journal/${response?.journal?.id || 0}`, {
          // state: {
          //   trialBalanceData: response?.trialBalance,
          //   importMode: data.importMode,
          //   csvRows: data.importMode === "csv" ? csvRows : [],
          //   drawerFormData: data,
          //   file: data.file,
          // },
        });
      }


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

  useEffect(() => {
    let mounted = true;

    const loadData = async () => {
      try {
        if (!trialBalanceId) {
          return;
        }


        const trialBalanceRes = await getImportsById(trialBalanceId, importsId);
        await getAccountingPeriods();

        if (!mounted) return;

        const importData = trialBalanceRes?.result || trialBalanceRes;

        setTrialBalanceData(importData);

        setFormData((prev) => ({
          ...prev,
          refNo: importData?.number || "",
          description: importData?.description || "",
          periodStart: importData?.periodStart || "",
          periodEnd: importData?.periodEnd || "",
          accountingPeriodId: importData?.period?.id || "",
          file: importData?.attachments
            ? {
              name: importData.attachments.name,
              path: importData.attachments.path,
            }
            : null,
        }));

        // setColumns(importData?.header || []);
        // setImportRows(importData?.rows || []);

        const headers = importData?.header || [];

        setColumns(headers);

        setColumnMappings(
          headers.map((header) => getColumnMapping(header))
        );

        setImportRows(importData?.rows || []);

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

  const handleFormChange = (name, value) => {
    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };


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
            Imports Table
            {formData.refNo ? ` (${formData.refNo})` : ""}
          </span>

          {/* <span className={styles.draft}>Draft</span> */}
        </div>

        <div className={styles.tableWrapper}>
          {/* <Field label="Account Type">
            <Combobox
              placeholder="Search account type..."
              value={
                columnOption.find(
                  (item) => item.value === selectedOption
                )?.name ?? ""
              }
              onOptionSelect={(_, data) =>
                handleColumnSelect(data.optionValue )
                // setColumnOption(data.optionValue)
              }
            >
              {columnOption.map((item) => (
                <Option
                  key={item.value}
                  value={item.value}
                  text={item.label}
                >
                  {item.label}
                </Option>
              ))}
            </Combobox>
          </Field> */}


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
              disabled
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
          {missingMappings.length > 0 && (
            <div className={styles.missingMappingHint}>
              Please map columns for:{" "}
              <strong style={{ marginLeft: "4px" }}>
                {missingMappings.join(", ")}
              </strong>
            </div>
          )}

          <Table className={styles.table}>
            {/* <TableHeader>
              <TableRow>
                {columns.map((header, index) => (
                  <Combobox
                    placeholder="Search account type..."
                    value={
                      columnOption.find(
                        (item) => item.value === selectedOption
                      )?.name ?? ""
                    }
                    onOptionSelect={(_, data) => {
                      const value = data.optionValue !== header ? data.optionValue[0] : header
                      return (
                        setColumnOption(data.optionValue)
                      )
                    }

                    }
                  >
                    {columnOption.map((item) => (
                      <Option
                        key={item.value}
                        value={item.value}
                        text={item.label}
                      >
                        {item.label}
                      </Option>
                    ))}
                  </Combobox>

                  // <TableHeaderCell key={index} className={styles.headerCells}>
                  //   {header}
                  // </TableHeaderCell>
                ))}
              </TableRow>
            </TableHeader> */}

            <TableHeader>
              <TableRow>
                {columns.map((header, index) => {
                  const selectedValue = columnMappings[index] ?? "1";

                  const selectedColumnOption = columnOption.find(
                    (option) => option.value === selectedValue
                  );

                  // Options selected in OTHER columns
                  const usedOptions = columnMappings.filter(
                    (value, i) =>
                      i !== index &&
                      value !== undefined &&
                      value !== null &&
                      value !== ""
                  );

                  return (
                    <TableHeaderCell
                      key={`${header}-${index}`}
                      className={styles.headerCells}
                    >
                      <Combobox
                        placeholder="Select column"
                        value={selectedColumnOption?.label ?? "Ignore"}
                        selectedOptions={[selectedValue]}
                        onOptionSelect={(_, data) => {
                          handleColumnSelect(index, data.optionValue);
                        }}
                      >
                        {columnOption.map((option) => {
                          const isUsed = usedOptions.includes(option.value);

                          return (
                            <Option
                              key={option.value}
                              value={option.value}
                              text={option.label}
                              disabled={isUsed}
                            >
                              {option.label}
                            </Option>
                          );
                        })}
                      </Combobox>
                    </TableHeaderCell>
                  );
                })}
              </TableRow>
            </TableHeader>
            <TableBody>
              {importRows.map((row, rowIndex) => (
                <TableRow key={rowIndex}>
                  {columns.map((_, columnIndex) => (
                    <TableCell key={columnIndex} className={styles.tableCell}>
                      {row[columnIndex] ?? ""}
                    </TableCell>
                  ))}
                </TableRow>
              ))}

              {importRows.length === 0 && (
                <TableRow>
                  <TableCell colSpan={Math.max(columns.length, 1)}>
                    No import data available.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className={styles.footer}>
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <Button
              appearance="secondary"
              icon={<ArrowLeftRegular />}
              onClick={() => navigate(-1)}
            >
              Back
            </Button>

            <Button
              className={styles.saveButton}
              onClick={handleImportCsv}
              disabled={importing}
            >
              {importing ? "Importing..." : "Import"}
            </Button>
          </div>


        </div>
      </div>
    </div>
  );
};

export default ImportTablePage;
