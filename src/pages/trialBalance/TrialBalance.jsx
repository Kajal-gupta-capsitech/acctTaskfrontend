import * as React from "react";

import {
  Button,
  TabList,
  Tab,
  makeStyles,
} from "@fluentui/react-components";

import { Add20Regular } from "@fluentui/react-icons";

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

  const {
    trialBalances,
    loading,
    error,
    getTrialBalances,
    createTrialBalance,
  } = useTrialBalance();


  /*
  |--------------------------------------------------------------------------
  | Accounting Period Context
  |--------------------------------------------------------------------------
  */

  const {
    accountingPeriods,
    loading: accountingPeriodLoading,
    getAccountingPeriods,
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


  /*
  |--------------------------------------------------------------------------
  | Trial Balance Table Data
  |--------------------------------------------------------------------------
  */

  const trialBalanceItems = React.useMemo(() => {
    return trialBalances.map((trialBalance, index) => {

      const periodFrom =
        trialBalance.accountingPeriod?.periodFrom;

      const periodTo =
        trialBalance.accountingPeriod?.periodTo;

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

      if (trialBalance.trialBalanceType === 0) {
        type = "Statutory";
      } else if (trialBalance.trialBalanceType === 1) {
        type = "Management";
      }


      /*
      |--------------------------------------------------------------------------
      | Import Type
      |--------------------------------------------------------------------------
      */

      let importType = "";

      if (trialBalance.importMode === 0) {
        importType = "CSV";
      } else if (trialBalance.importMode === 2) {
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

        refNo:
          trialBalance.refNo || "",

        period,

        turnover:
          trialBalance.turnover ?? 0,

        description:
          trialBalance.description || "",

        type,

        accountReports:
          trialBalance.accountReports || "",

        importType,

        status,

        id:
          trialBalance.id,
      };
    });
  }, [trialBalances]);


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
        )} - ${formatDate(
          period.periodTo
        )}`,

        status,

        id: period.id,
      };
    });
  }, [accountingPeriods]);


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

      console.log("Parsed CSV Rows:", csvRows);

      if (csvRows.length === 0) {
        throw new Error(
          "CSV file is empty or does not contain valid data."
        );
      }
    }

    const payload = new FormData();

 
    payload.append(
      "trialBalanceType",
      data.trialBalanceType === "statutory"
        ? "0"
        : "1"
    );

    /*
     * Accounting Period
     */
    if (data.accountingPeriodId) {
      payload.append(
        "accountingPeriodId",
        data.accountingPeriodId
      );
    }

    /*
     * Chart Account
     */
    if (data.chartAccountId) {
      payload.append(
        "chartAccountId",
        data.chartAccountId
      );
    }

    payload.append(
      "importMode",
      data.importMode === "csv"
        ? "0"
        : "2"
    );

    /*
     * Import Format
     */
    if (data.importFormat) {
      payload.append(
        "importFormat",
        data.importFormat
      );
    }

    if (
      data.importMode === "csv" &&
      data.file
    ) {
      payload.append(
        "file",
        data.file,
        data.file.name
      );
    }

    console.log("Trial Balance FormData:");

    for (const [key, value] of payload.entries()) {
      console.log(
        key,
        value instanceof File
          ? {
              name: value.name,
              size: value.size,
              type: value.type,
            }
          : value
      );
    }

    const createdTrialBalance =
      await createTrialBalance(payload);

    console.log(
      "Created Trial Balance:",
      createdTrialBalance
    );


    const trialBalanceId =
      createdTrialBalance?.id;

    if (!trialBalanceId) {
      throw new Error(
        "Trial Balance ID was not returned by the API."
      );
    }

    setIsDrawerOpen(false);

    navigate(
      `/trial-balances/${trialBalanceId}/journal`,
      {
        state: {
          trialBalanceData:
            createdTrialBalance,
          importMode: data.importMode,
          csvRows:
            data.importMode === "csv"
              ? csvRows
              : [],
        },
      }
    );

  } catch (err) {
    console.error(
      "Failed to create trial balance:",
      err
    );

    alert(
      "Failed to create trial balance. Please check the data."
    );
  }
  };

  if (loading) {
    return (
      <div>

        <BreadCrumbs />

        <p>
          Loading trial balances...
        </p>

      </div>
    );
  }



  if (error) {
    return (
      <div>

        <BreadCrumbs />

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

      <BreadCrumbs />


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
              onClick={() =>{
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
            >
              Add
            </Button>

          </div>


          {/* Accounting Period Table */}

          <TableComponent
            items={accountingPeriodItems}
            columns={accountingPeriodColumns}
          />

        </div>

      )}

    </div>
  );
};


export default TrialBalance;