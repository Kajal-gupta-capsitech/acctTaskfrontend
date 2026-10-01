import * as React from "react";

import {
  TabList,
  Tab,
  Button,
  makeStyles,
} from "@fluentui/react-components";

import { Add20Regular } from "@fluentui/react-icons";

import TableComponent from "../../componenets/table/table";
import AddDrawer from "../../componenets/addDrawer/AddDrawer";
import { BreadCrumbs } from "../../componenets/breadCrumbs/BreadCrumbs";
import { useChartAccount } from "../../context/ChartAccountContext/ChartAccountContext";
import { useEffect } from "react";
import { useMemo } from "react";
import { useState } from "react";
import { useAccountType } from "../../context/AccountTypeContext/AccountTypeContext";

const useStyles = makeStyles({
  buttonContainer: {
    marginTop: "8px",
    display: "flex",
    alignItems: "center",
    gap: "4px",
  },

  addButton: {
    color: "#666",
    backgroundColor: "transparent",
    border: "none",
    minWidth: "50px",
  },
});

// ------------------------------------------
// TEMPORARY DATA
// Later this will come from your API
// ------------------------------------------

// const items = [
//   {
//     sNo: 1,
//     code: "1/1",
//     accountName: "Sales",
//     accountType: "Turnover",
//     accountGroup: "Turnover",
//     forClients: true,
//     archive: false,
//   },
//   {
//     sNo: 2,
//     code: "1/2",
//     accountName: "Contracts",
//     accountType: "Turnover",
//     accountGroup: "Turnover",
//     forClients: true,
//     archive: false,
//   },
//   {
//     sNo: 3,
//     code: "1/3",
//     accountName: "Contracts with customers",
//     accountType: "Turnover",
//     accountGroup: "Turnover",
//     forClients: true,
//     archive: false,
//   },
//   {
//     sNo: 4,
//     code: "1/4",
//     accountName: "Domestic sales",
//     accountType: "Turnover",
//     accountGroup: "Turnover",
//     forClients: true,
//     archive: false,
//   },
//   {
//     sNo: 5,
//     code: "1/5",
//     accountName: "Export sales",
//     accountType: "Turnover",
//     accountGroup: "Turnover",
//     forClients: true,
//     archive: false,
//   },
//   {
//     sNo: 6,
//     code: "1/6",
//     accountName: "EU sales",
//     accountType: "Turnover",
//     accountGroup: "Turnover",
//     forClients: true,
//     archive: false,
//   },
//   {
//     sNo: 7,
//     code: "1/7",
//     accountName: "EU services",
//     accountType: "Turnover",
//     accountGroup: "Turnover",
//     forClients: true,
//     archive: false,
//   },
//   {
//     sNo: 8,
//     code: "1/8",
//     accountName: "Rental income",
//     accountType: "Turnover",
//     accountGroup: "Turnover",
//     forClients: true,
//     archive: false,
//   },
//   {
//     sNo: 9,
//     code: "1/9",
//     accountName: "VAT flat rate adjustment",
//     accountType: "Turnover",
//     accountGroup: "Turnover",
//     forClients: true,
//     archive: false,
//   },
//   {
//     sNo: 10,
//     code: "1/10",
//     accountName: "Testing chandra",
//     accountType: "Turnover",
//     accountGroup: "Turnover",
//     forClients: true,
//     archive: false,
//   },
// ];


// // ------------------------------------------
// // TABLE COLUMNS
// // ------------------------------------------

const columns = [
  {
    columnKey: "sNo",
    label: "S.No",
  },
  {
    columnKey: "code",
    label: "Code",
  },
  {
    columnKey: "accountName",
    label: "Account Name",
  },
  {
    columnKey: "accountType",
    label: "Account Type",
  },
  {
    columnKey: "accountGroup",
    label: "Account Group",
  },
  {
    columnKey: "forClients",
    label: "For Clients",
    type: "checkbox",
  },
  {
    columnKey: "archive",
    label: "Archive",
    type: "checkbox",
  },
  {
    columnKey: "action",
    label: "Action",
    type: "action",
  },
];

const ChartAccounts = () => {
  const styles = useStyles();

 const {
  chartAccounts,
  loading,
  error,
  getChartAccounts,
    createChartAccount,
} = useChartAccount();

const {
  accountTypes,
  getAccountTypes,
  loading: accountTypeLoading,
} = useAccountType();

  const [selectedValue, setSelectedValue] =
   useState("tab1");

  const [isDrawerOpen, setIsDrawerOpen] =
   useState(false);


  // ------------------------------------------
  // CREATE ACCOUNT TYPE OPTIONS DYNAMICALLY
  // ------------------------------------------

  // const accountTypeOptions = useMemo(() => {
  //   const uniqueAccountTypes = [
  //     ...new Set(
  //       items
  //         .map((item) => item.accountType)
  //         .filter(Boolean)
  //     ),
  //   ];

  //   return uniqueAccountTypes.map((accountType) => ({
  //     value: accountType,
  //     label: accountType,
  //   }));
  // }, []);


  const items = useMemo(() => {
  return chartAccounts.map((account, index) => ({
    sNo: index + 1,
    code: account.code,
    accountName: account.accountName,
    accountType: account.accountType?.name || "",
    accountGroup: account.accountGroup,
    forClients: account.forClients,
    archive: account.archive,
    id: account.id,
  }));
}, [chartAccounts]);



//   const accountTypeOptions = useMemo(() => {
//   const uniqueAccountTypes = [
//     ...new Set(
//       items
//         .map((item) => item.accountType)
//         .filter(Boolean)
//     ),
//   ];

//   return uniqueAccountTypes.map((accountType) => ({
//     value: accountType,
//     label: accountType,
//   }));
// }, []);


const accountTypeOptions = useMemo(() => {
  return accountTypes.map((accountType) => ({
    value: accountType.id,
    label: accountType.name,
  }));
}, [accountTypes]);

  // ------------------------------------------
  // CHART ACCOUNT FORM
  // ------------------------------------------

  // const chartAccountFields = useMemo(
  //   () => [
  //     // {
  //     //   name: "businessTypes",
  //     //   label: "Business Type",
  //     //   type: "checkbox-group",
  //     //   required: true,

  //     //   options: [
  //     //     {
  //     //       value: "limited",
  //     //       label: "Limited",
  //     //     },
  //     //     {
  //     //       value: "llp",
  //     //       label: "LLP",
  //     //     },
  //     //     {
  //     //       value: "individual",
  //     //       label: "Individual",
  //     //     },
  //     //     {
  //     //       value: "partnership",
  //     //       label: "Partnership",
  //     //     },
  //     //   ],
  //     // },

  //     {
  //       name: "accountType",
  //       label: "Account Type",
  //       type: "select",
  //       required: true,
  //       placeholder: "Search account type",
  //       options: accountTypeOptions,
  //     },

  //     {
  //       name: "name",
  //       label: "Name",
  //       type: "text",
  //       required: true,
  //     },

  //     {
  //       name: "tags",
  //       label: "Tags",
  //       type: "text",
  //     },

  //     {
  //       name: "code",
  //       label: "Code",
  //       type: "text",
  //       required: true,
  //     },
  //   ],
  //   [accountTypeOptions]
  // );

const chartAccountFields = useMemo(
  () => [
    {
      name: "accountTypeId",
      label: "Account Type",
      type: "select",
      required: true,
      placeholder: accountTypeLoading
        ? "Loading account types..."
        : "Select account type",
      options: accountTypeOptions,
    },

    {
      name: "accountName",
      label: "Name",
      type: "text",
      required: true,
      placeholder: "Enter account name",
    },

    {
      name: "accountGroup",
      label: "Account Group",
      type: "text",
      placeholder: "Enter account group",
    },

    {
      name: "forClients",
      label: "For Clients",
      type: "checkbox",
    },

    {
      name: "archive",
      label: "Archive",
      type: "checkbox",
    },
  ],
  [accountTypeOptions, accountTypeLoading]
);
  // ------------------------------------------
  // INITIAL VALUES
  // ------------------------------------------

  // const initialValues = {
  //   businessTypes: [
  //     "limited",
  //     "llp",
  //     "individual",
  //     "partnership",
  //   ],

  //   accountType: "",

  //   name: "",

  //   tags: "",

  //   code: "",
  // };

  const initialValues = {
  accountTypeId: "",
  accountName: "",
  accountGroup: "",
  forClients: false,
  archive: false,
};

  // ------------------------------------------
  // SAVE
  // ------------------------------------------

  // const handleSave = (formData) => {
  //   console.log("Chart Account Form Data:");
  //   console.log(formData);

  //   /*
  //     Example result:

  //     {
  //       businessTypes: [
  //         "limited",
  //         "llp",
  //         "individual",
  //         "partnership"
  //       ],
  //       accountType: "Turnover",
  //       name: "Office Sales",
  //       tags: "",
  //       code: "1/11"
  //     }
  //   */

  //   // Later:
  //   // await createChartAccount(formData);

  //   setIsDrawerOpen(false);
  // };


  const handleSave = async (formData) => {
  try {
    console.log("Creating Chart Account:", formData);

    await createChartAccount(formData);

    setIsDrawerOpen(false);
  } catch (err) {
    console.error("Failed to create chart account:", err);

    alert(
      "Failed to create chart account. Please check the data."
    );
  }
};

  // ------------------------------------------
  // TAB
  // ------------------------------------------

  const onTabSelect = (event, data) => {
    setSelectedValue(data.value);
  };

   useEffect(() => {
    getChartAccounts();
  }, []);

  useEffect(() => {
  if (isDrawerOpen) {
    getAccountTypes();
  }
}, [isDrawerOpen]);

  return (
    <div>

      {/* Breadcrumb */}
      <BreadCrumbs />


      {/* Tabs */}
      {/* <TabList
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
          Accounting Period
        </Tab>
      </TabList> */}


      {/* Add button */}
      <div className={styles.buttonContainer}>

        <Button
          className={styles.addButton}
          appearance="subtle"
          icon={<Add20Regular />}
          onClick={() => setIsDrawerOpen(true)}
        >
          Account
        </Button>

      </div>
{loading && <p>Loading chart accounts...</p>}

{error && (
  <p>
    Failed to load chart accounts.
  </p>
)}

      {/* Table */}
      <TableComponent
        items={items}
        columns={columns}
      />


      {/* Add Chart Account Drawer */}
      <AddDrawer
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title="Add Account"
        fields={chartAccountFields}
        initialValues={initialValues}
        onSubmit={handleSave}
        submitText="Save"
      />

    </div>
  );
};

export default ChartAccounts;