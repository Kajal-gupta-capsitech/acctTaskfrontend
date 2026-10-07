import * as React from "react";

import {
  Button,
  TabList,
  Tab,
  makeStyles,
  Dialog,
  DialogSurface,
  DialogTitle,
  DialogBody,
  DialogContent,
  DialogActions,
  Table,
  TableHeader,
  TableRow,
  TableHeaderCell,
  TableBody,
  TableCell,
  Spinner,
} from "@fluentui/react-components";

import { Add20Regular, Dismiss24Regular } from "@fluentui/react-icons";

import { useNavigate } from "react-router-dom";

import TableComponent from "../../componenets/table/table";
import AddDrawer from "../../componenets/addDrawer/AddDrawer";
import { BreadCrumbs } from "../../componenets/breadCrumbs/BreadCrumbs";

import {
  useTrialBalance,
} from "../../context/TrialBalanceContext/TrialBalanceContext";

import {
  useAccountingPeriod,
} from "../../context/AccountingPeriodContext/AccountingPeriodContext";

import { useToast } from "../../context/ToastContext/ToastContext";


const useStyles = makeStyles({
  buttonContainer: {
    marginTop: "8px",
    display: "flex",
    alignItems: "center",
    gap: "4px",
  },

  tabsContainer: {
    marginTop: "8px",
  },

  addButton: {
    color: "#888888",
    backgroundColor: "transparent",
    border: "none",
    minWidth: "50px",
    marginLeft: "12px",

    ":hover": {
      backgroundColor: "#f0f0f0",
      color: "#919090",
    },
  },
});


/*
|--------------------------------------------------------------------------
| Trial Balance Table Columns
|--------------------------------------------------------------------------
*/

const trialBalanceColumns = [
  {
    columnKey: "sNo",
    label: "S.No.",
  },
  {
    columnKey: "refNo",
    label: "Ref. No.",
  },
  {
    columnKey: "period",
    label: "Period",
  },
  {
    columnKey: "turnover",
    label: "Turnover",
  },
  {
    columnKey: "description",
    label: "Description",
  },
  {
    columnKey: "type",
    label: "Type",
  },
  {
    columnKey: "accountReports",
    label: "Account Reports",
  },
  {
    columnKey: "importType",
    label: "Import Type",
  },
  {
    columnKey: "status",
    label: "Status",
  },
  {
    columnKey: "action",
    label: "",
    type: "action",
  },
];

/*
|--------------------------------------------------------------------------
| Accounting Period Table Columns
|--------------------------------------------------------------------------
*/

const accountingPeriodColumns = [
  {
    columnKey: "sNo",
    label: "S.No.",
  },
  {
    columnKey: "period",
    label: "Period",
  },
  {
    columnKey: "status",
    label: "Status",
  },
  {
    columnKey: "action",
    label: "",
    type: "action",
  },
];


const TrialBalance = () => {
  const styles = useStyles();

  const navigate = useNavigate();


  /*
  |--------------------------------------------------------------------------
  | Tabs
  |--------------------------------------------------------------------------
  */

  const [selectedValue, setSelectedValue] =
    React.useState("tab1");


  /*
  |--------------------------------------------------------------------------
  | Drawer
  |--------------------------------------------------------------------------
  */

  const [isDrawerOpen, setIsDrawerOpen] =
    React.useState(false);


  /*
  |--------------------------------------------------------------------------
  | Trial Balance Context
  |--------------------------------------------------------------------------
  */

  const { showSuccess, showError } = useToast();

  const {
    trialBalances,
    loading,
    error,
    getTrialBalances,
    getTrialBalanceById,
    createTrialBalance,
    deleteTrialBalance,
  } = useTrialBalance();

  const [selectedTbForModal, setSelectedTbForModal] = React.useState(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [modalLoading, setModalLoading] = React.useState(false);

  const handleOpenTbModal = React.useCallback(
    async (id) => {
      try {
        setModalLoading(true);
        setIsModalOpen(true);
        const res = await getTrialBalanceById(id);
        setSelectedTbForModal(res?.result || res);
      } catch (err) {
        console.error("Failed to load trial balance details:", err);
        showError(err);
      } finally {
        setModalLoading(false);
      }
    },
    [getTrialBalanceById, showError]
  );


  /*
  |--------------------------------------------------------------------------
  | Accounting Period Context
  |--------------------------------------------------------------------------
  */

  const {
    accountingPeriods,
    loading: accountingPeriodLoading,
    getAccountingPeriods,
    createAccountingPeriod,
    updateAccountingPeriod,
    deleteAccountingPeriod,
  } = useAccountingPeriod();


  /*
  |--------------------------------------------------------------------------
  | Load Trial Balances
  |--------------------------------------------------------------------------
  */

  React.useEffect(() => {
    getTrialBalances();
  }, []);


  /*
  |--------------------------------------------------------------------------
  | Load Accounting Periods
  |--------------------------------------------------------------------------
  */

  React.useEffect(() => {
    getAccountingPeriods();
  }, []);


  React.useEffect(() => {
    if (isDrawerOpen) {
      console.log("Drawer opened, fetching accounting periods...");
      getAccountingPeriods();
      // getAccountTypes();
    }
  }, [isDrawerOpen]);

  /*
  |--------------------------------------------------------------------------
  | Tab Change
  |--------------------------------------------------------------------------
  */

  const onTabSelect = (event, data) => {
    setSelectedValue(data.value);
  };


  /*
  |--------------------------------------------------------------------------
  | Format Date
  |--------------------------------------------------------------------------
  */

  const formatDate = (date) => {
    if (!date) {
      return "";
    }

    return new Date(date).toLocaleDateString("en-GB");
  };

  const handleEditItem = React.useCallback(
    (item) => {
      console.log("item", item);
      // navigate(`/trial-balances/${item.name}/journal/${item.JournalIds?.[0] || 0}`);
      navigate(`/trial-balances/${item.name}`);
    },
    [navigate]
  );

  const handleDeleteItem = React.useCallback(
    async (item) => {
      if (
        window.confirm(
          `Are you sure you want to delete Trial Balance "${item.refNo || item.id
          }"?`
        )
      ) {
        try {
          const res = await deleteTrialBalance(item.id);
          console.log("Trial Balance:", res);
          const message = res?.message || "Trial balance deleted successfully.";
          showSuccess(message);
        } catch (err) {
          console.error("Failed to delete trial balance:", err);
          showError(err);
        }
      }
    },
    [deleteTrialBalance, showSuccess, showError]
  );

  /*
  |--------------------------------------------------------------------------
  | Trial Balance Table Data
  |--------------------------------------------------------------------------
  */

  const trialBalanceItems = React.useMemo(() => {


    return trialBalances.map((trialBalance, index) => {
        
      const periodFrom =
        trialBalance.accountingPeriod?.periodFrom
        || trialBalance?.periodStart
        ;

      const periodTo =
        trialBalance.accountingPeriod?.periodTo
        || trialBalance?.periodEnd
        ;

      const period =
        periodFrom && periodTo
          ? `${formatDate(periodFrom)} - ${formatDate(periodTo)}`
          : "";


      /*
      |--------------------------------------------------------------------------
      | Trial Balance Type
      |--------------------------------------------------------------------------
      */

      let type = "";

      if (trialBalance.type === 0) {
        type = "Statutory";
      } else if (trialBalance.type === 1) {
        type = "Management";
      }


      /*
      |--------------------------------------------------------------------------
      | Import Type
      |--------------------------------------------------------------------------
      */

      let importType = "";

      if (trialBalance.importType === 0) {
        importType = "CSV";
      } else if (trialBalance.importType === 1) {
        importType = "Manual";
      }


      /*
      |--------------------------------------------------------------------------
      | Status
      |--------------------------------------------------------------------------
      */

      let status = "";

      if (trialBalance.status === 0) {
        status = "-";
      } else if (trialBalance.status === 1) {
        status = "Balanced";
      }


      return {
        sNo: index + 1,
        name : trialBalance.refNo,
        refNo: (
          <span
            style={{
              color: "#0078d4",
              cursor: "pointer",
              fontWeight: 600,
              textDecoration: "underline",
            }}
            onClick={() => handleOpenTbModal(trialBalance.refNo)}
          >
            {trialBalance.refNo}
          </span>
        ),

        period,

        turnover:
          trialBalance.turnover ?? 0,

        description:
          trialBalance.description || "",

        type,
        JournalIds: trialBalance?.journalIds,
        accountReports:
          trialBalance.accountReports || "",

        importType,

        status,
        id:
          trialBalance.id,

        onEdit: handleEditItem,
        onDelete: handleDeleteItem,
      };
    });
  }, [trialBalances, handleEditItem, handleDeleteItem]);


  const [isPeriodDrawerOpen, setIsPeriodDrawerOpen] = React.useState(false);
  const [editingPeriod, setEditingPeriod] = React.useState(null);

  const accountingPeriodFields = [
    {
      name: "periodFrom",
      label: "Period From",
      type: "date",
      required: true,
    },
    {
      name: "periodTo",
      label: "To",
      type: "date",
      required: true,
    },
  ];

  const handleEditPeriod = React.useCallback((period) => {
    setEditingPeriod(period);
    setIsPeriodDrawerOpen(true);
  }, []);

  const handleDeletePeriod = React.useCallback(
    async (period) => {
      if (
        window.confirm(
          `Are you sure you want to delete accounting period (${formatDate(
            period.periodFrom
          )} - ${formatDate(period.periodTo)})?`
        )
      ) {
        try {
          const res = await deleteAccountingPeriod(period.id);
          const msg = res?.message || "Accounting period deleted successfully.";
          showSuccess(msg);
        } catch (err) {
          console.error("Failed to delete accounting period:", err);
          showError(err);
        }
      }
    },
    [deleteAccountingPeriod, showSuccess, showError]
  );

  const handleAccountingPeriodSubmit = async (data) => {
    try {
      const fromDate = data.periodFrom ? new Date(data.periodFrom).toISOString() : null;
      const toDate = data.periodTo ? new Date(data.periodTo).toISOString() : null;

      if (!fromDate || !toDate) {
        showError("Please select both Period From and To dates.");
        return;
      }

      if (editingPeriod) {
        const res = await updateAccountingPeriod(editingPeriod.id, {
          periodFrom: fromDate,
          periodTo: toDate,
        });
        showSuccess(res?.message || "Accounting period updated successfully.");
      } else {
        const res = await createAccountingPeriod({
          periodFrom: fromDate,
          periodTo: toDate,
          isActive: true,
          isClosed: false,
        });
        showSuccess(res?.message || "Accounting period created successfully.");
      }
      setIsPeriodDrawerOpen(false);
      setEditingPeriod(null);
    } catch (err) {
      console.error("Failed to save accounting period:", err);
      showError(err);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Accounting Period Table Data
  |--------------------------------------------------------------------------
  */

  const accountingPeriodItems = React.useMemo(() => {
    return accountingPeriods.map((period, index) => {

      let status = "-";

      if (period.isActive) {
        status = "Active";
      } else if (period.isClosed) {
        status = "Completed";
      }

      return {
        sNo: index + 1,

        period: `${formatDate(
          period.periodFrom
        )}  - ${formatDate(
          period.periodTo
        )}`,

        status,

        id: period.id,
        onEdit: () => handleEditPeriod(period),
        onDelete: () => handleDeletePeriod(period),
      };
    });
  }, [accountingPeriods, handleEditPeriod, handleDeletePeriod]);


  /*
  |--------------------------------------------------------------------------
  | Trial Balance Drawer Fields
  |--------------------------------------------------------------------------
  */

  const downloadCsvTemplate = () => {
    const csvContent =
      '"Account Code","Account Name","Debit","Credit"\n';

    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "trial-balance-template.csv";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };


  const trialBalanceFields = [
    /*
    |--------------------------------------------------------------------------
    | Type
    |--------------------------------------------------------------------------
    */

    {
      name: "trialBalanceType",

      label: "Type",

      type: "radio",

      required: true,

      options: [
        {
          value: "statutory",
          label: "Statutory",
        },
        {
          value: "management",
          label: "Management",
        },
      ],

      // When Type changes, clear fields
      // belonging to the previous type.
      clearFieldsOnChange: [
        "accountingPeriodId",
        "periodFrom",
        "periodTo",
      ],
    },


    /*
    |--------------------------------------------------------------------------
    | Statutory -> Accounting Period
    |--------------------------------------------------------------------------
    */

    {
      name: "accountingPeriodId",

      label: "Period",

      type: "select",

      required: true,

      showWhen: {
        field: "trialBalanceType",
        value: "statutory",
      },

      placeholder: accountingPeriodLoading
        ? "Loading periods..."
        : "Select period",

      options: accountingPeriods.map(
        (period) => ({
          value: period.id,

          label: `${formatDate(
            period.periodFrom
          )} - ${formatDate(
            period.periodTo
          )}`,
        })
      ),
    },


    /*
    |--------------------------------------------------------------------------
    | Management -> From
    |--------------------------------------------------------------------------
    */

    {
      name: "periodFrom",

      label: "From",

      type: "date",

      required: true,

      showWhen: {
        field: "trialBalanceType",
        value: "management",
      },

      placeholder: "Select from date",
    },


    /*
    |--------------------------------------------------------------------------
    | Management -> To
    |--------------------------------------------------------------------------
    */

    {
      name: "periodTo",

      label: "To",

      type: "date",

      required: true,

      showWhen: {
        field: "trialBalanceType",
        value: "management",
      },

      placeholder: "Select to date",
    },


    /*
    |--------------------------------------------------------------------------
    | Import Mode
    |--------------------------------------------------------------------------
    */

    {
      name: "importMode",

      label: "Mode of Import",

      type: "radio",

      required: true,

      options: [
        {
          value: "csv",
          label: "CSV",
        },
        {
          value: "manual",
          label: "Manual",
        },
      ],

      // If user changes CSV -> Manual,
      // clear the selected CSV file.
      clearFieldsOnChange: [
        "file",
      ],
    },


    /*
    |--------------------------------------------------------------------------
    | Import Format
    |--------------------------------------------------------------------------
    */

    {
      name: "importFormat",

      label: "Import Format",

      type: "select",

      options: [
        {
          value: "default",
          label: "Default",
        },
      ],
      showWhen: {
        field: "importMode",
        value: "csv",
      },
    },


    /*
    |--------------------------------------------------------------------------
    | CSV File
    |--------------------------------------------------------------------------
    */



    {
      name: "file",

      label: "CSV File",

      type: "file",

      accept: ".csv",

      // ONLY visible when CSV is selected.
      showWhen: {
        field: "importMode",
        value: "csv",
      },
    },
    {
      name: "csvTemplate",
      label: "",
      type: "link",
      buttonLabel: "Download CSV Template",
      onClick: downloadCsvTemplate,
      showWhen: {
        field: "importMode",
        value: "csv",
      },
    },
  ];



  /*
  |--------------------------------------------------------------------------
  | Initial Values
  |--------------------------------------------------------------------------
  */

  const initialValues = {
    trialBalanceType: "statutory",

    accountingPeriodId: "",

    importMode: "manual",

    importFormat: "default",

    file: null,
  };


  /*
  |--------------------------------------------------------------------------
  | Create Trial Balance
  |--------------------------------------------------------------------------
  */


  const parseCsv = (text) => {
    const lines = text
      .split(/\r?\n/)
      .filter((line) => line.trim() !== "");

    if (lines.length < 2) {
      return [];
    }

    const parseRow = (row) => {
      const values = [];
      let current = "";
      let insideQuotes = false;

      for (let i = 0; i < row.length; i++) {
        const char = row[i];

        if (char === '"') {
          insideQuotes = !insideQuotes;
        } else if (char === "," && !insideQuotes) {
          values.push(current.trim());
          current = "";
        } else {
          current += char;
        }
      }

      values.push(current.trim());
      console.log("Parsed CSV Row:", values);
      return values;
    };

    const headers = parseRow(lines[0]).map((header) =>
      header.replace(/^"|"$/g, "").trim()
    );

    return lines.slice(1).map((line) => {
      const values = parseRow(line);

      const row = {};

      headers.forEach((header, index) => {
        row[header] = (values[index] || "")
          .replace(/^"|"$/g, "")
          .trim();
      });

      return {
        accountCode: row["Account Code"] || "",
        accountName: row["Account Name"] || "",
        debit: row["Debit"] || "",
        credit: row["Credit"] || "",
      };
    });
  };

  const handleSubmit = async (data) => {
    try {
      console.log("handleSubmit Data:", data);

      let csvRows = [];

      if (data.importMode === "csv" && data.file) {
        const csvText = await data.file.text();
        csvRows = parseCsv(csvText);
      }

      const payload = new FormData();

      payload.append(
        "trialBalanceType",
        data.trialBalanceType === "statutory" ? "0" : "1"
      );

      if (data.accountingPeriodId) {
        payload.append("accountingPeriodId", data.accountingPeriodId);
      }

      if (data.chartAccountId) {
        payload.append("chartAccountId", data.chartAccountId);
      }

      payload.append("importMode", data.importMode === "csv" ? "0" : "1");

      if (data.periodFrom) {
        const periodStartVal =
          data.periodFrom instanceof Date
            ? data.periodFrom.toISOString()
            : new Date(data.periodFrom).toISOString();
        payload.append("periodStart", periodStartVal);
      }

      if (data.periodTo) {
        const periodEndVal =
          data.periodTo instanceof Date
            ? data.periodTo.toISOString()
            : new Date(data.periodTo).toISOString();
        payload.append("periodEnd", periodEndVal);
      }

      if (data.importFormat) {
        payload.append("importFormat", data.importFormat);
      }

      if (data.importMode === "csv" && data.file) {
        payload.append("csvFile", data.file, data.file.name);
        payload.append("file", data.file, data.file.name);
      }

      const createdRes = await createTrialBalance(payload);
      const successMessage =
        createdRes?.message || "Trial balance created successfully.";
      showSuccess(successMessage);

      const createdTrialBalance = createdRes?.result || createdRes;
      const trialBalanceId = createdTrialBalance?.refNo;
      console.log("createdTrialBalance", createdTrialBalance)
      if (!trialBalanceId) {
        throw new Error("Trial Balance ID was not returned by the API.");
      }

      setIsDrawerOpen(false);

      navigate(`/trial-balances/${trialBalanceId}/journal/0`, {
        state: {
          trialBalanceData: createdTrialBalance,
          importMode: data.importMode,
          csvRows: data.importMode === "csv" ? csvRows : [],
          drawerFormData: data,
          file: data.file,
        },
      });

    } catch (err) {
      console.error(
        "Failed to create trial balance:",
        err
      );

      showError(err);
    }
  };

  if (loading) {
    return (
      <div>

        {/* <BreadCrumbs /> */}

        <p>
          Loading trial balances...
        </p>

      </div>
    );
  }



  if (error) {
    return (
      <div>

        {/* <BreadCrumbs /> */}

        <p>
          Failed to load trial balances.
        </p>

        <Button
          onClick={getTrialBalances}
        >
          Retry
        </Button>

      </div>
    );
  }


  /*
  |--------------------------------------------------------------------------
  | UI
  |--------------------------------------------------------------------------
  */

  return (
    <div>

      {/* <BreadCrumbs /> */}


      {/* ========================================================= */}
      {/* TABS */}
      {/* ========================================================= */}

      <div className={styles.tabsContainer}>

        <TabList
          selectedValue={selectedValue}
          onTabSelect={onTabSelect}
        >

          <Tab
            id="tab1"
            value="tab1"
            aria-controls="panel1"
          >
            Trial Balance
          </Tab>


          <Tab
            id="tab2"
            value="tab2"
            aria-controls="panel2"
          >
            Accounting Periods
          </Tab>

        </TabList>

      </div>


      {/* ========================================================= */}
      {/* TRIAL BALANCE TAB */}
      {/* ========================================================= */}

      {selectedValue === "tab1" && (

        <div
          id="panel1"
          role="tabpanel"
          aria-labelledby="tab1"
        >

          {/* Add Button */}

          <div className={styles.buttonContainer}>

            <Button
              appearance="subtle"
              icon={<Add20Regular />}
              onClick={() => {
                console.log("Add Trial Balance clicked");
                setIsDrawerOpen(true)
              }

              }
            >
              Trial Balance
            </Button>


            {/* Drawer */}

            <AddDrawer
              open={isDrawerOpen}

              onClose={() =>
                setIsDrawerOpen(false)
              }

              title="New Trial Balance"

              fields={trialBalanceFields}

              initialValues={initialValues}

              onSubmit={handleSubmit}
            />

          </div>

          {/* Trial Balance Table */}

          <TableComponent
            items={trialBalanceItems}
            columns={trialBalanceColumns}
          />
        </div>
      )}


      {/* ========================================================= */}
      {/* ACCOUNTING PERIOD TAB */}
      {/* ========================================================= */}

      {selectedValue === "tab2" && (

        <div
          id="panel2"
          role="tabpanel"
          aria-labelledby="tab2"
        >

          {/* Add Accounting Period */}

          <div className={styles.buttonContainer}>

            <Button
              appearance="subtle"
              icon={<Add20Regular />}
              onClick={() => {
                setEditingPeriod(null);
                setIsPeriodDrawerOpen(true);
              }}
            >
              Add
            </Button>

            <AddDrawer
              open={isPeriodDrawerOpen}
              onClose={() => {
                setIsPeriodDrawerOpen(false);
                setEditingPeriod(null);
              }}
              title={
                editingPeriod
                  ? "Edit Accounting Period"
                  : "Add Accounting Period"
              }
              fields={accountingPeriodFields}
              initialValues={
                editingPeriod
                  ? {
                    periodFrom: editingPeriod.periodFrom
                      ? new Date(editingPeriod.periodFrom)
                      : null,
                    periodTo: editingPeriod.periodTo
                      ? new Date(editingPeriod.periodTo)
                      : null,
                  }
                  : {
                    periodFrom: null,
                    periodTo: null,
                  }
              }
              onSubmit={handleAccountingPeriodSubmit}
            />

          </div>


          {/* Accounting Period Table */}

          <TableComponent
            items={accountingPeriodItems}
            columns={accountingPeriodColumns}
          />

        </div>

      )}

      {/* Trial Balance Details Modal */}
      <Dialog
        open={isModalOpen}
        onOpenChange={(_, data) => {
          if (!data.open) {
            setIsModalOpen(false);
            setSelectedTbForModal(null);
          }
        }}
      >
        <DialogSurface style={{ maxWidth: "720px", width: "100%" }}>
          <DialogBody>
            <DialogTitle
              action={
                <Button
                  appearance="subtle"
                  aria-label="Close"
                  icon={<Dismiss24Regular />}
                  onClick={() => setIsModalOpen(false)}
                />
              }
            >
              Trial Balance Details - {selectedTbForModal?.trialBalance?.name}
            </DialogTitle>

            <DialogContent style={{ marginTop: "12px" }}>
              {modalLoading ? (
                <div style={{ display: "flex", justifyContent: "center", padding: "40px" }}>
                  <Spinner label="Loading details..." />
                </div>
              ) : selectedTbForModal ? (
                <div>
                  {/* Summary Grid */}
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "12px",
                      backgroundColor: "#f9f9f9",
                      padding: "16px",
                      borderRadius: "6px",
                      marginBottom: "20px",
                      fontSize: "14px",
                    }}
                  >
                    <div><strong>Ref No:</strong> {selectedTbForModal.trialBalance?.name || "-"}</div>
                    <div><strong>Type:</strong> {selectedTbForModal.type === 0 || selectedTbForModal.trialBalanceType === 0 ? "Statutory" : "Management"}</div>
                    <div>
                      <strong>Period:</strong>{" "}
                      {selectedTbForModal.period
                        ? `${formatDate(selectedTbForModal.period.periodFrom)} - ${formatDate(selectedTbForModal.period.periodTo)}`
                        : selectedTbForModal.periodStart ? `${formatDate(selectedTbForModal.periodStart)} - ${formatDate(selectedTbForModal.periodEnd)}` : "-"}
                    </div>
                    <div><strong>Import Mode:</strong> {selectedTbForModal.importMode === 0 ? "CSV" : "Manual"}</div>
                    <div><strong>Status:</strong> {selectedTbForModal.status === 1 ? "Balanced" : "Draft"}</div>
                    <div>
                      <strong>Turnover:</strong> £{Number(selectedTbForModal.turnover || 0).toLocaleString("en-GB", { minimumFractionDigits: 2 })}
                    </div>
                    {selectedTbForModal.description && (
                      <div style={{ gridColumn: "span 2" }}><strong>Description:</strong> {selectedTbForModal.description}</div>
                    )}
                  </div>

                  {/* Items Table */}
                  <h4 style={{ marginBottom: "10px", color: "#171717" }}>Imported / Journal Items</h4>
                  {selectedTbForModal.items && selectedTbForModal.items.length > 0 ? (
                    <div style={{ maxHeight: "300px", overflowY: "auto" }}>
                      <Table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <TableHeader>
                          <TableRow style={{ backgroundColor: "#f3f3f3" }}>
                            <TableHeaderCell style={{ fontWeight: 600, padding: "8px" }}>Line No</TableHeaderCell>
                            <TableHeaderCell style={{ fontWeight: 600, padding: "8px" }}>Account Code</TableHeaderCell>
                            <TableHeaderCell style={{ fontWeight: 600, padding: "8px" }}>Account Name</TableHeaderCell>
                            <TableHeaderCell style={{ fontWeight: 600, padding: "8px", textAlign: "right" }}>Debit (£)</TableHeaderCell>
                            <TableHeaderCell style={{ fontWeight: 600, padding: "8px", textAlign: "right" }}>Credit (£)</TableHeaderCell>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {selectedTbForModal.items.map((item, idx) => (
                            <TableRow key={idx}>
                              <TableCell style={{ padding: "8px" }}>{idx + 1}</TableCell>
                              <TableCell style={{ padding: "8px" }}>{item.accountCode || item.account?.code || "-"}</TableCell>
                              <TableCell style={{ padding: "8px" }}>{item.accountName || item.account?.name || item.account?.accountName || "-"}</TableCell>
                              <TableCell style={{ padding: "8px", textAlign: "right" }}>
                                {item.debit ? `£${Number(item.debit).toLocaleString("en-GB", { minimumFractionDigits: 2 })}` : "-"}
                              </TableCell>
                              <TableCell style={{ padding: "8px", textAlign: "right" }}>
                                {item.credit ? `£${Number(item.credit).toLocaleString("en-GB", { minimumFractionDigits: 2 })}` : "-"}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <p style={{ color: "#666" }}>No line items found for this trial balance.</p>
                  )}
                </div>
              ) : null}
            </DialogContent>

            <DialogActions style={{ marginTop: "20px" }}>
              <Button appearance="secondary" onClick={() => setIsModalOpen(false)}>
                Close
              </Button>
            </DialogActions>
          </DialogBody>
        </DialogSurface>
      </Dialog>
    </div>
  );
};

export default TrialBalance;