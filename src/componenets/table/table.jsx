import * as React from "react";

import {
  EditRegular,
  DeleteRegular,
} from "@fluentui/react-icons";

import {
  Table,
  TableBody,
  TableCell,
  TableRow,
  TableHeader,
  TableHeaderCell,
  TableCellLayout,
  Button,
  makeStyles,
  Checkbox,
} from "@fluentui/react-components";

const useStyles = makeStyles({
  table: {
    width: "100%",
    minWidth: "700px",
     overflow: "visible",
  },
  startColumn: {
    textAlign: "start",
  },
  TableCell: {
    textAlign: "start",
  },

  header: {
    backgroundColor: "#f3f3f3",
    color: "#245a9c",
    fontWeight: 600,
  },

  actionCell: {
    display: "flex",
    alignItems: "center",
    gap: "4px",
  },

  actionButton: {
    color: "#555555",

    ":hover": {
      backgroundColor: "#eeeeee",
    },
  },

  status: {
    fontWeight: 500,
  },
});

// const items = [
//   {
//     refNo: "REF-001",
//     taxYear: "2024-25",
//     description: "Income Tax Return",
//     taxLiability: "₹25,000",
//     status: "Pending",
//   },
//   {
//     refNo: "REF-002",
//     taxYear: "2023-24",
//     description: "Advance Tax",
//     taxLiability: "₹18,500",
//     status: "Paid",
//   },
//   {
//     refNo: "REF-003",
//     taxYear: "2024-25",
//     description: "Self Assessment Tax",
//     taxLiability: "₹32,750",
//     status: "Pending",
//   },
//   {
//     refNo: "REF-004",
//     taxYear: "2022-23",
//     description: "Income Tax Return",
//     taxLiability: "₹12,000",
//     status: "Paid",
//   },
// ];

// const columns = [
//   {
//     columnKey: "refNo",
//     label: "Ref No.",
//   },
//   {
//     columnKey: "taxYear",
//     label: "Tax Year",
//   },
//   {
//     columnKey: "description",
//     label: "Description",
//   },
//   {
//     columnKey: "taxLiability",
//     label: "Tax Liability",
//   },
//   {
//     columnKey: "status",
//     label: "Status",
//   },
//   {
//     columnKey: "action",
//     label: "Action",
//   },
// ];

export const TableComponent = ({ items = [], columns = [], onEdit, onDelete }) => {
  const styles = useStyles();

  return (
    <Table className={styles.table} >
      {/* Header */}
      <TableHeader>
        <TableRow>
          {columns.map((column) => (
            <TableHeaderCell key={column.columnKey} className={styles.header}>
              {column.label}
            </TableHeaderCell>
          ))}
        </TableRow>
      </TableHeader>

      {/* Body */}
    <TableBody>
  {items.map((item, index) => (
    <TableRow key={item.sNo ?? item.refNo ?? index}>

      {columns.map((column) => {

        // CHECKBOX COLUMN
        if (column.type === "checkbox") {
          return (
            <TableCell key={column.columnKey}>
              <Checkbox
                checked={Boolean(item[column.columnKey])}
                onChange={(e, data) => {
                  console.log(
                    column.columnKey,
                    data.checked
                  );
                }}
              />
            </TableCell>
          );
        }

        // ACTION COLUMN
        if (column.type === "action") {
          return (
            <TableCell key={column.columnKey}>
              <div className={styles.actionCell}>

                <Button
                  className={styles.actionButton}
                  appearance="subtle"
                  icon={<EditRegular />}
                  aria-label={`Edit ${
                    item.accountName ?? item.refNo ?? "item"
                  }`}
                  onClick={() => {
                    if (item.onEdit) {
                      item.onEdit(item);
                    } else if (column.onEdit) {
                      column.onEdit(item);
                    } else if (onEdit) {
                      onEdit(item);
                    }
                  }}
                />

                <Button
                  className={styles.actionButton}
                  appearance="subtle"
                  icon={<DeleteRegular />}
                  aria-label={`Delete ${
                    item.accountName ?? item.refNo ?? "item"
                  }`}
                  onClick={() => {
                    if (item.onDelete) {
                      item.onDelete(item);
                    } else if (column.onDelete) {
                      column.onDelete(item);
                    } else if (onDelete) {
                      onDelete(item);
                    }
                  }}
                />

              </div>
            </TableCell>
          );
        }

        // NORMAL COLUMN
        return (
          <TableCell key={column.columnKey}>
            <TableCellLayout>
              {item[column.columnKey]}
            </TableCellLayout>
          </TableCell>
        );
      })}

    </TableRow>
  ))}
</TableBody>
    </Table>
  );
};

export default TableComponent;
