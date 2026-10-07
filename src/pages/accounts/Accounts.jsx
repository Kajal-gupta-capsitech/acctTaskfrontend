import React, { useEffect, useState, useMemo, useCallback } from "react";
import {
  Button,
  makeStyles,
} from "@fluentui/react-components";
import { Add20Regular } from "@fluentui/react-icons";
import TableComponent from "../../componenets/table/table";
import AddDrawer from "../../componenets/addDrawer/AddDrawer";
import { BreadCrumbs } from "../../componenets/breadCrumbs/BreadCrumbs";
import { useAccountingPeriod } from "../../context/AccountingPeriodContext/AccountingPeriodContext";
import { useToast } from "../../context/ToastContext/ToastContext";

const useStyles = makeStyles({
  buttonContainer: {
    // marginTop: "8px",
    marginBottom: "12px",
    display: "flex",
    alignItems: "center",
    gap: "4px",
  },
});

const columns = [
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

const AccountingPeriod = () => {
  const styles = useStyles();
  const { showSuccess, showError } = useToast();

  const {
    accountingPeriods,
    loading,
    getAccountingPeriods,
    createAccountingPeriod,
    updateAccountingPeriod,
    deleteAccountingPeriod,
  } = useAccountingPeriod();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingPeriod, setEditingPeriod] = useState(null);

  useEffect(() => {
    getAccountingPeriods();
  }, []);

  const formatDate = (date) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString("en-GB");
  };

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

  const handleEdit = useCallback((period) => {
    setEditingPeriod(period);
    setIsDrawerOpen(true);
  }, []);

  const handleDelete = useCallback(
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

  const handleSave = async (formData) => {
    try {
      const fromDate = formData.periodFrom ? new Date(formData.periodFrom).toISOString() : null;
      const toDate = formData.periodTo ? new Date(formData.periodTo).toISOString() : null;

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
      setIsDrawerOpen(false);
      setEditingPeriod(null);
    } catch (err) {
      console.error("Failed to save accounting period:", err);
      showError(err);
    }
  };

  const items = useMemo(() => {
    return (accountingPeriods || []).map((period, index) => {
      let status = "-";
      if (period.isActive) {
        status = "Active";
      } else if (period.isClosed) {
        status = "Completed";
      }

      return {
        sNo: index + 1,
        period: `${formatDate(period.periodFrom)} - ${formatDate(
          period.periodTo
        )}`,
        status,
        id: period.id,
        onEdit: () => handleEdit(period),
        onDelete: () => handleDelete(period),
      };
    });
  }, [accountingPeriods, handleEdit, handleDelete]);

  return (
    <div>
      <BreadCrumbs />

      <div className={styles.buttonContainer}>
        <Button
          appearance="subtle"
          icon={<Add20Regular />}
          onClick={() => {
            setEditingPeriod(null);
            setIsDrawerOpen(true);
          }}
        >
          Add
        </Button>
      </div>

      <AddDrawer
        open={isDrawerOpen}
        onClose={() => {
          setIsDrawerOpen(false);
          setEditingPeriod(null);
        }}
        title={editingPeriod ? "Edit Accounting Period" : "Add Accounting Period"}
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
        onSubmit={handleSave}
      />

      <TableComponent items={items} columns={columns} />
    </div>
  );
};

export default AccountingPeriod;
