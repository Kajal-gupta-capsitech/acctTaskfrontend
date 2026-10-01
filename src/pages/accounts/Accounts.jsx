import React from "react";
//  import * as React from "react";
// import type { JSXElement } from "@fluentui/react-components";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbDivider,
  BreadcrumbButton,
  TabList,
  Tab,
  Button,
  Label,
  makeStyles,
} from "@fluentui/react-components";
import {
  CalendarMonthFilled,
  CalendarMonthRegular,
  bundleIcon,
} from "@fluentui/react-icons";
import { Pivot, PivotItem } from "@fluentui/react";
// import { PivotItem } from "@fluentui/react/lib-commonjs/Pivot";
import { Add20Regular } from "@fluentui/react-icons";
import TableComponent from "../../componenets/table/table";
import AddDrawer from "../../componenets/addDrawer/AddDrawer";
import { BreadCrumbs } from "../../componenets/breadCrumbs/BreadCrumbs";
const useStyles = makeStyles({
  buttonContainer: {
    marginTop: "2px",
    display: "flex",
    alignItems: "center",
    gap: "4px",
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

    ":hover::after": {
      display: "none",
    },
  },
  //   addIcon: {
  //     color: "#0078D4",
  //   },
  addButtonContent: {
    display: "flex",
    alignItems: "center",
    gap: "4px",
  },
});

const CalendarMonth = bundleIcon(CalendarMonthFilled, CalendarMonthRegular);
const path = "https://www.bing.com/";


const columns = [
    {
      columnKey: "sno",
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
      columnKey: "",
      label: "",
    },
  ];

  const items = [
    {
      sno: 1,
      period: "2024-25",
      status: "Active",
    },
    {
      sno: 2,
      period: "2023-24",
      status: "Completed",
    },
    {
      sno: 3,
      period: "2022-23",
      status: "Completed",
    },
  ];

const AccountingPeriod = () => {
  const [selectedValue, setSelectedValue] = React.useState("tab1");
  const [isAddDrawerOpen, setIsAddDrawerOpen] = React.useState(false);

  const styles = useStyles();

    const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);

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

  const handleSave = (formData) => {
    console.log("Form Data:", formData);

    // API call can go here
    // Example:
    // createAccountingPeriod(formData);

    setIsDrawerOpen(false);
  };

  const onTabSelect = (event, data) => {
    setSelectedValue(data.value);
  };

  return (
    <div>
        <BreadCrumbs />
      <TabList selectedValue={selectedValue} onTabSelect={onTabSelect}>
        <Tab id="tab1" value="tab1" aria-controls="panel1">
          Trial Balance
        </Tab>

        <Tab id="tab2" value="tab2" aria-controls="panel2">
          Accounting Tab
        </Tab>
      </TabList>

      <div className={styles.buttonContainer}>
         <Button
        appearance="subtle"
        icon={<Add20Regular />}
        onClick={() => setIsDrawerOpen(true)}
      >
        Add
      </Button>

    <AddDrawer
  open={isDrawerOpen}
  onClose={() => setIsDrawerOpen(false)}
  title="Add Accounting Period"
  fields={accountingPeriodFields}
  initialValues={{
    periodFrom: new Date(2026, 3, 2),
    periodTo: new Date(2027, 3, 1),
  }}
  onSubmit={handleSave}
/>
        {/* <Button
          className={styles.addButton}
          appearance="subtle"
          onClick={() => setIsAddDrawerOpen(true)}
        >
         <span className={styles.addButtonContent}>
            <Add20Regular className={styles.addIcon} />
            Add
          </span>
        </Button>
        <AddDrawer
          open={isAddDrawerOpen}
          onClose={() => setIsAddDrawerOpen(false)}
        />  */}
      </div>

      <TableComponent 
        items={items}
  columns={columns}
      />

      {/* <div>
        <div
          id="panel1"
          role="tabpanel"
          aria-labelledby="tab1"
          hidden={selectedValue !== "tab1"}
        >
          Content 1
        </div>

        <div
          id="panel2"
          role="tabpanel"
          aria-labelledby="tab2"
          hidden={selectedValue !== "tab2"}
        >
          Content 2
        </div>

     
      </div>
   */}
      {/* <h1>Accounting Period</h1>

      <p>
        This is the Accounting Period screen.
      </p> */}
    </div>
  );
};

export default AccountingPeriod;
