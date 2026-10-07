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
import { useAccountType } from "../../context/AccountTypeContext/AccountTypeContext";
import { useToast } from "../../context/ToastContext/ToastContext";
import { useEffect, useMemo, useState } from "react";

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
// TABLE COLUMNS
// ------------------------------------------

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
  const { showSuccess, showError } = useToast();

  const {
    chartAccounts,
    loading,
    error,
    getChartAccounts,
    createChartAccount,
    updateChartAccount,
    deleteChartAccount,
  } = useChartAccount();

  const {
    accountTypes,
    getAccountTypes,
    loading: accountTypeLoading,
  } = useAccountType();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState(null);

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

  const accountTypeOptions = useMemo(() => {
    return accountTypes.map((accountType) => ({
      value: accountType.id,
      label: accountType.name,
    }));
  }, [accountTypes]);

  // ------------------------------------------
  // CHART ACCOUNT FORM FIELDS
  // ------------------------------------------

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

  const initialValues = useMemo(() => {
    if (editingAccount) {
      return {
        accountTypeId:
          editingAccount.accountTypeId || editingAccount.accountType?.id || "",
        accountName: editingAccount.accountName || "",
        accountGroup: editingAccount.accountGroup || "",
        forClients: Boolean(editingAccount.forClients),
        archive: Boolean(editingAccount.archive),
      };
    }
    return {
      accountTypeId: "",
      accountName: "",
      accountGroup: "",
      forClients: false,
      archive: false,
    };
  }, [editingAccount]);

  // ------------------------------------------
  // EDIT & DELETE HANDLERS
  // ------------------------------------------

  const handleEdit = (item) => {
    const account = chartAccounts.find((a) => a.id === item.id) || item;
    setEditingAccount(account);
    setIsDrawerOpen(true);
  };

  const handleDelete = async (item) => {
    if (
      window.confirm(
        `Are you sure you want to delete chart account "${item.accountName}"?`
      )
    ) {
      try {
        await deleteChartAccount(item.id);
        showSuccess("Chart account deleted successfully.");
      } catch (err) {
        console.error("Failed to delete chart account:", err);
        showError(err);
      }
    }
  };

  // ------------------------------------------
  // SAVE / UPDATE
  // ------------------------------------------

  const handleSave = async (formData) => {
    try {
      if (editingAccount) {
        await updateChartAccount(editingAccount.id, formData);
        showSuccess("Chart account updated successfully.");
      } else {
        await createChartAccount(formData);
        showSuccess("Chart account created successfully.");
      }

      setIsDrawerOpen(false);
      setEditingAccount(null);
    } catch (err) {
      console.error("Failed to save chart account:", err);
      showError(err);
    }
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
      {/* <BreadCrumbs /> */}

      {/* Add button */}
      <div className={styles.buttonContainer}>
        <Button
          className={styles.addButton}
          appearance="subtle"
          icon={<Add20Regular />}
          onClick={() => {
            setEditingAccount(null);
            setIsDrawerOpen(true);
          }}
        >
          Account
        </Button>
      </div>

      {loading && <p>Loading chart of accounts...</p>}

      {error && <p>Failed to load chart of accounts.</p>}

      {/* Table */}
      <TableComponent
        items={items}
        columns={columns}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Add / Edit Chart Account Drawer */}
      <AddDrawer
        open={isDrawerOpen}
        onClose={() => {
          setIsDrawerOpen(false);
          setEditingAccount(null);
        }}
        title={editingAccount ? "Edit Account" : "Add Account"}
        fields={chartAccountFields}
        initialValues={initialValues}
        onSubmit={handleSave}
        submitText="Save"
      />
    </div>
  );
};

export default ChartAccounts;