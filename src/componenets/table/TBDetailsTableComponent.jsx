// import React, { useEffect, useState } from "react";
// import { Formik, Form } from "formik";

// import {
//   Button,
//   Field,
//   Input,
//   Textarea,
//   Dropdown,
//   Option,
//   Spinner,
//   makeStyles,
//   tokens,
//   Table,
//   TableHeader,
//   TableHeaderCell,
//   TableBody,
//   TableRow,
//   TableCell,
//   TableCellLayout,
//   Badge,
//   Tooltip,
// } from "@fluentui/react-components";

// import {
//   EditRegular,
//   DeleteRegular,
//   ArrowUndoRegular,
//   ArrowDownloadRegular,
//   AttachRegular,
//   CheckmarkRegular,
// } from "@fluentui/react-icons";

// import { getTrialBalanceDetails } from "../../api/trialBalanceDetailsApi";

// const useStyles = makeStyles({
//   page: {
//     width: "100%",
//     minHeight: "100vh",
//     backgroundColor: "#ffffff",
//     padding: "16px 24px",
//     boxSizing: "border-box",
//   },

//   title: {
//     fontSize: "16px",
//     fontWeight: 600,
//     color: "#242424",
//     marginBottom: "16px",
//   },

//   breadcrumb: {
//     display: "flex",
//     alignItems: "center",
//     gap: "8px",
//     fontSize: "13px",
//     color: "#666666",
//     marginBottom: "14px",
//   },

//   breadcrumbActive: {
//     color: "#242424",
//     fontWeight: 500,
//   },

//   topForm: {
//     width: "100%",
//     display: "grid",
//     gridTemplateColumns: "150px 1fr",
//     rowGap: "10px",
//     columnGap: "12px",
//     marginBottom: "18px",
//   },

//   label: {
//     display: "flex",
//     alignItems: "center",
//     fontSize: "13px",
//     color: "#444444",
//   },

//   input: {
//     width: "100%",
//   },

//   sectionTitle: {
//     fontSize: "14px",
//     fontWeight: 600,
//     color: "#242424",
//     padding: "8px 0",
//     borderBottom: "1px solid #d1d1d1",
//   },

//   tableWrapper: {
//     width: "100%",
//     overflowX: "auto",
//     marginBottom: "24px",
//   },

//   table: {
//     width: "100%",
//     minWidth: "950px",
//     borderCollapse: "collapse",
//   },

//   header: {
//     backgroundColor: "#ffffff",
//     color: "#242424",
//     fontWeight: 600,
//     fontSize: "13px",
//     borderBottom: "1px solid #d1d1d1",
//     whiteSpace: "nowrap",
//   },

//   cell: {
//     fontSize: "13px",
//     color: "#333333",
//     verticalAlign: "top",
//     borderBottom: "1px solid #e1e1e1",
//     paddingTop: "9px",
//     paddingBottom: "9px",
//   },

//   refNo: {
//     color: "#0067c5",
//     cursor: "pointer",
//     whiteSpace: "nowrap",
//   },

//   description: {
//     maxWidth: "220px",
//     whiteSpace: "normal",
//     lineHeight: "18px",
//   },

//   actionCell: {
//     display: "flex",
//     alignItems: "center",
//     gap: "2px",
//     whiteSpace: "nowrap",
//   },

//   actionButton: {
//     minWidth: "28px",
//     width: "28px",
//     height: "28px",
//     padding: 0,
//     color: "#555555",

//     ":hover": {
//       backgroundColor: "#f0f0f0",
//     },
//   },

//   deleteButton: {
//     minWidth: "28px",
//     width: "28px",
//     height: "28px",
//     padding: 0,
//     color: "#d13438",

//     ":hover": {
//       backgroundColor: "#fde7e9",
//     },
//   },

//   posted: {
//     backgroundColor: "#dff6dd",
//     color: "#107c10",
//   },

//   draft: {
//     backgroundColor: "#e8e8e8",
//     color: "#444444",
//   },

//   pending: {
//     backgroundColor: "#fff4ce",
//     color: "#7a5900",
//   },

//   successIcon: {
//     color: "#107c10",
//     fontSize: "18px",
//   },

//   summary: {
//     display: "flex",
//     gap: "30px",
//     padding: "12px 0",
//     borderTop: "1px solid #d1d1d1",
//   },

//   summaryItem: {
//     display: "flex",
//     flexDirection: "column",
//     gap: "3px",
//   },

//   summaryLabel: {
//     fontSize: "12px",
//     color: "#666666",
//   },

//   summaryValue: {
//     fontSize: "14px",
//     fontWeight: 600,
//     color: "#242424",
//   },

//   empty: {
//     padding: "20px",
//     textAlign: "center",
//     color: "#666666",
//     fontSize: "13px",
//     borderBottom: "1px solid #e1e1e1",
//   },

//   error: {
//     padding: "12px",
//     marginBottom: "15px",
//     backgroundColor: "#fde7e9",
//     color: "#a4262c",
//     border: "1px solid #f1b7bb",
//   },
// });

// const formatDate = (value) => {
//   if (!value) return "";

//   const date = new Date(value);

//   if (Number.isNaN(date.getTime())) {
//     return value;
//   }

//   return date.toLocaleDateString("en-GB");
// };

// const getStatusBadge = (status, styles) => {
//   const value = String(status || "").toLowerCase();

//   if (value === "posted") {
//     return (
//       <Badge className={styles.posted} appearance="tint">
//         Posted
//       </Badge>
//     );
//   }

//   if (value === "draft") {
//     return (
//       <Badge className={styles.draft} appearance="tint">
//         Draft
//       </Badge>
//     );
//   }

//   if (value === "pending") {
//     return (
//       <Badge className={styles.pending} appearance="tint">
//         Pending
//       </Badge>
//     );
//   }

//   return status || "";
// };

// export const TbDetails = ({ trialBalanceId }) => {
//   const styles = useStyles();

//   const [data, setData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   /** 
//    * ============================================================
//    * GET TRIAL BALANCE DETAILS
//    * ============================================================
//    */
//   const loadTrialBalanceDetails = async () => {
//     try {
//       setLoading(true);
//       setError(null);

//       const response = await getTrialBalanceDetails(trialBalanceId);

//       if (!response?.status) {
//         throw new Error(
//           response?.message || "Unable to load trial balance details."
//         );
//       }

//       setData(response.result);
//     } catch (err) {
//       console.error("Failed to load Trial Balance details:", err);

//       setError(
//         err?.response?.data?.message ||
//           err?.message ||
//           "Failed to load trial balance details."
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (!trialBalanceId) return;

//     loadTrialBalanceDetails();
//   }, [trialBalanceId]);

//   /**
//    * ============================================================
//    * IMPORT ACTIONS
//    * ============================================================
//    *
//    */
//   const handleEditImport = (item) => {
//     console.log("Edit Import:", item);
//   };

//   const handleDeleteImport = (item) => {
//     console.log("Delete Import:", item);
//   };

//   /**
//    * ============================================================
//    * JOURNAL ACTIONS
//    * ============================================================
//    */
//   const handleEditJournal = (journal) => {
//     console.log("Edit Journal:", journal);
//   };

//   const handleDeleteJournal = (journal) => {
//     console.log("Delete Journal:", journal);
//   };

//   const handleUnpostJournal = (journal) => {
//     console.log("Unpost Journal:", journal);
//   };

//   const handleDownloadJournal = (journal) => {
//     console.log("Download Journal:", journal);
//   };

//   const handleAttachment = (journal) => {
//     console.log("Add Attachment:", journal);
//   };

//   if (loading) {
//     return (
//       <div className={styles.page}>
//         <Spinner label="Loading Trial Balance..." />
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className={styles.page}>
//         <div className={styles.error}>{error}</div>

//         <Button onClick={loadTrialBalanceDetails}>
//           Retry
//         </Button>
//       </div>
//     );
//   }

//   if (!data) {
//     return (
//       <div className={styles.page}>
//         No Trial Balance data found.
//       </div>
//     );
//   }

//   const trialBalance = data.trialBalance || {};
//   const period = trialBalance.period || data.period || {};
//   const imports = data.imports || [];
//   const journals = data.journals || [];
//   const summary = data.summary || {};

//   return (
//     <div className={styles.page}>

//       {/* =====================================================
//           BREADCRUMB
//       ====================================================== */}
//       <div className={styles.breadcrumb}>
//         <span>Tax and Accounts</span>
//         <span>›</span>
//         <span>Ryan LLC</span>
//         <span>›</span>
//         <span>Trial Balances</span>
//         <span>›</span>

//         <span className={styles.breadcrumbActive}>
//           #{trialBalance.refNo}
//         </span>
//       </div>

//       {/* =====================================================
//           TITLE
//       ====================================================== */}
//       <div className={styles.title}>
//         Trial Balance Detail: {trialBalance.refNo}
//       </div>

//       {/* =====================================================
//           TOP DETAILS - FORMIK
//       ====================================================== */}
//       <Formik
//         enableReinitialize
//         initialValues={{
//           refNo: trialBalance.refNo || "",
//           period:
//             period?.name ||
//             `${formatDate(trialBalance.periodStart)} - ${formatDate(
//               trialBalance.periodEnd
//             )}`,
//           description: trialBalance.description || "",
//         }}
//         onSubmit={() => {}}
//       >
//         {({ values }) => (
//           <Form>
//             <div className={styles.topForm}>

//               <div className={styles.label}>
//                 Ref. No.
//               </div>

//               <Field>
//                 <Input
//                   className={styles.input}
//                   value={values.refNo}
//                   readOnly
//                 />
//               </Field>

//               <div className={styles.label}>
//                 Period
//               </div>

//               <Field>
//                 <Input
//                   className={styles.input}
//                   value={values.period}
//                   readOnly
//                 />
//               </Field>

//               <div className={styles.label}>
//                 Description
//               </div>

//               <Field>
//                 <Input
//                   className={styles.input}
//                   value={values.description}
//                   readOnly
//                 />
//               </Field>

//             </div>
//           </Form>
//         )}
//       </Formik>

//       {/* =====================================================
//           IMPORTS
//       ====================================================== */}
//       <div className={styles.sectionTitle}>
//         Import(s) pending
//       </div>

//       <div className={styles.tableWrapper}>
//         <Table className={styles.table}>
//           <TableHeader>
//             <TableRow>

//               <TableHeaderCell className={styles.header}>
//                 Ref No
//               </TableHeaderCell>

//               <TableHeaderCell className={styles.header}>
//                 Description
//               </TableHeaderCell>

//               <TableHeaderCell className={styles.header}>
//                 File Name
//               </TableHeaderCell>

//               <TableHeaderCell className={styles.header}>
//                 Status
//               </TableHeaderCell>

//               <TableHeaderCell className={styles.header}>
//                 Imported On
//               </TableHeaderCell>

//               <TableHeaderCell className={styles.header}>
//                 Action
//               </TableHeaderCell>

//             </TableRow>
//           </TableHeader>

//           <TableBody>
//             {imports.length === 0 ? (
//               <TableRow>
//                 <TableCell
//                   className={styles.empty}
//                   colSpan={6}
//                 >
//                   No pending imports
//                 </TableCell>
//               </TableRow>
//             ) : (
//               imports.map((item) => (
//                 <TableRow key={item.id || item.refNo}>

//                   <TableCell className={styles.cell}>
//                     <TableCellLayout>
//                       <span className={styles.refNo}>
//                         {item.refNo}
//                       </span>
//                     </TableCellLayout>
//                   </TableCell>

//                   <TableCell className={styles.cell}>
//                     <TableCellLayout>
//                       <span className={styles.description}>
//                         {item.description}
//                       </span>
//                     </TableCellLayout>
//                   </TableCell>

//                   <TableCell className={styles.cell}>
//                     <TableCellLayout>
//                       {item.fileName}
//                     </TableCellLayout>
//                   </TableCell>

//                   <TableCell className={styles.cell}>
//                     <TableCellLayout>
//                       {getStatusBadge(item.status, styles)}
//                     </TableCellLayout>
//                   </TableCell>

//                   <TableCell className={styles.cell}>
//                     <TableCellLayout>
//                       {formatDate(item.importedOn)}
//                     </TableCellLayout>
//                   </TableCell>

//                   <TableCell className={styles.cell}>
//                     <div className={styles.actionCell}>

//                       <Tooltip content="Edit" relationship="label">
//                         <Button
//                           appearance="subtle"
//                           className={styles.actionButton}
//                           icon={<EditRegular />}
//                           onClick={() =>
//                             handleEditImport(item)
//                           }
//                         />
//                       </Tooltip>

//                       <Tooltip content="Delete" relationship="label">
//                         <Button
//                           appearance="subtle"
//                           className={styles.deleteButton}
//                           icon={<DeleteRegular />}
//                           onClick={() =>
//                             handleDeleteImport(item)
//                           }
//                         />
//                       </Tooltip>

//                     </div>
//                   </TableCell>

//                 </TableRow>
//               ))
//             )}
//           </TableBody>
//         </Table>
//       </div>

//       {/* =====================================================
//           JOURNALS
//       ====================================================== */}
//       <div className={styles.sectionTitle}>
//         Journals
//       </div>

//       <div className={styles.tableWrapper}>
//         <Table className={styles.table}>
//           <TableHeader>
//             <TableRow>

//               <TableHeaderCell className={styles.header}>
//                 Ref No
//               </TableHeaderCell>

//               <TableHeaderCell className={styles.header}>
//                 Description
//               </TableHeaderCell>

//               <TableHeaderCell className={styles.header}>
//                 Entries
//               </TableHeaderCell>

//               <TableHeaderCell className={styles.header}>
//                 Journal Type
//               </TableHeaderCell>

//               <TableHeaderCell className={styles.header}>
//                 Journal Status
//               </TableHeaderCell>

//               <TableHeaderCell className={styles.header}>
//                 Import Type
//               </TableHeaderCell>

//               <TableHeaderCell className={styles.header}>
//                 Status
//               </TableHeaderCell>

//               <TableHeaderCell className={styles.header}>
//                 Created On
//               </TableHeaderCell>

//               <TableHeaderCell className={styles.header}>
//                 Action
//               </TableHeaderCell>

//             </TableRow>
//           </TableHeader>

//           <TableBody>
//             {journals.length === 0 ? (
//               <TableRow>
//                 <TableCell
//                   className={styles.empty}
//                   colSpan={9}
//                 >
//                   No journals found
//                 </TableCell>
//               </TableRow>
//             ) : (
//               journals.map((journal) => (
//                 <TableRow key={journal.id || journal.number}>

//                   {/* REF NO */}
//                   <TableCell className={styles.cell}>
//                     <TableCellLayout>
//                       <span
//                         className={styles.refNo}
//                         onClick={() =>
//                           handleEditJournal(journal)
//                         }
//                       >
//                         {journal.number}
//                       </span>
//                     </TableCellLayout>
//                   </TableCell>

//                   {/* DESCRIPTION */}
//                   <TableCell className={styles.cell}>
//                     <TableCellLayout>
//                       <span className={styles.description}>
//                         {journal.description}
//                       </span>
//                     </TableCellLayout>
//                   </TableCell>

//                   {/* ENTRIES */}
//                   <TableCell className={styles.cell}>
//                     <TableCellLayout>
//                       {journal.itemsCount ?? 0}
//                     </TableCellLayout>
//                   </TableCell>

//                   {/* JOURNAL TYPE */}
//                   <TableCell className={styles.cell}>
//                     <TableCellLayout>
//                       {journal.journalType}
//                     </TableCellLayout>
//                   </TableCell>

//                   {/* JOURNAL STATUS */}
//                   <TableCell className={styles.cell}>
//                     <TableCellLayout>
//                       {getStatusBadge(
//                         journal.journalStatus,
//                         styles
//                       )}
//                     </TableCellLayout>
//                   </TableCell>

//                   {/* IMPORT TYPE */}
//                   <TableCell className={styles.cell}>
//                     <TableCellLayout>
//                       {journal.importType}
//                     </TableCellLayout>
//                   </TableCell>

//                   {/* STATUS */}
//                   <TableCell className={styles.cell}>
//                     <TableCellLayout>
//                       {journal.status ? (
//                         <CheckmarkRegular
//                           className={styles.successIcon}
//                         />
//                       ) : (
//                         ""
//                       )}
//                     </TableCellLayout>
//                   </TableCell>

//                   {/* CREATED ON */}
//                   <TableCell className={styles.cell}>
//                     <TableCellLayout>
//                       {formatDate(journal.createdOn)}
//                     </TableCellLayout>
//                   </TableCell>

//                   {/* ACTIONS */}
//                   <TableCell className={styles.cell}>
//                     <div className={styles.actionCell}>

//                       {/* EDIT */}
//                       <Tooltip content="Edit" relationship="label">
//                         <Button
//                           appearance="subtle"
//                           className={styles.actionButton}
//                           icon={<EditRegular />}
//                           disabled={
//                             journal.action?.edit === false
//                           }
//                           onClick={() =>
//                             handleEditJournal(journal)
//                           }
//                         />
//                       </Tooltip>

//                       {/* DELETE */}
//                       <Tooltip content="Delete" relationship="label">
//                         <Button
//                           appearance="subtle"
//                           className={styles.deleteButton}
//                           icon={<DeleteRegular />}
//                           disabled={
//                             journal.action?.delete === false
//                           }
//                           onClick={() =>
//                             handleDeleteJournal(journal)
//                           }
//                         />
//                       </Tooltip>

//                       {/* UNPOST */}
//                       <Tooltip content="Unpost" relationship="label">
//                         <Button
//                           appearance="subtle"
//                           className={styles.actionButton}
//                           icon={<ArrowUndoRegular />}
//                           disabled={
//                             journal.action?.unpost === false
//                           }
//                           onClick={() =>
//                             handleUnpostJournal(journal)
//                           }
//                         />
//                       </Tooltip>

//                       {/* DOWNLOAD */}
//                       <Tooltip content="Download" relationship="label">
//                         <Button
//                           appearance="subtle"
//                           className={styles.actionButton}
//                           icon={<ArrowDownloadRegular />}
//                           disabled={
//                             journal.action?.download === false
//                           }
//                           onClick={() =>
//                             handleDownloadJournal(journal)
//                           }
//                         />
//                       </Tooltip>

//                       {/* ATTACHMENT */}
//                       <Tooltip
//                         content="Add attachment"
//                         relationship="label"
//                       >
//                         <Button
//                           appearance="subtle"
//                           className={styles.actionButton}
//                           icon={<AttachRegular />}
//                           disabled={
//                             journal.action?.addAttachment === false
//                           }
//                           onClick={() =>
//                             handleAttachment(journal)
//                           }
//                         />
//                       </Tooltip>

//                     </div>
//                   </TableCell>

//                 </TableRow>
//               ))
//             )}
//           </TableBody>
//         </Table>
//       </div>

//       {/* =====================================================
//           SUMMARY
//       ====================================================== */}
//       <div className={styles.summary}>

//         <div className={styles.summaryItem}>
//           <span className={styles.summaryLabel}>
//             Total Debit
//           </span>

//           <span className={styles.summaryValue}>
//             {Number(summary.totalDebit || 0).toLocaleString()}
//           </span>
//         </div>

//         <div className={styles.summaryItem}>
//           <span className={styles.summaryLabel}>
//             Total Credit
//           </span>

//           <span className={styles.summaryValue}>
//             {Number(summary.totalCredit || 0).toLocaleString()}
//           </span>
//         </div>

//         <div className={styles.summaryItem}>
//           <span className={styles.summaryLabel}>
//             Difference
//           </span>

//           <span className={styles.summaryValue}>
//             {Number(summary.difference || 0).toLocaleString()}
//           </span>
//         </div>

//         <div className={styles.summaryItem}>
//           <span className={styles.summaryLabel}>
//             Balance Status
//           </span>

//           <span className={styles.summaryValue}>
//             {summary.status || ""}
//           </span>
//         </div>

//       </div>
//     </div>
//   );
// };

// export default TbDetails;