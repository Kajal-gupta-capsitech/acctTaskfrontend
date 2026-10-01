import * as React from "react";
import {
  Drawer,
  DrawerHeader,
  DrawerHeaderTitle,
  DrawerBody,
  DrawerFooter,
  Button,
  Checkbox,
  Input,
  Dropdown,
  Option,
  Label,
  makeStyles,
} from "@fluentui/react-components";

import {
  DismissRegular,
  SaveRegular,
} from "@fluentui/react-icons";

const useStyles = makeStyles({
  drawer: {
    width: "520px",
    maxWidth: "520px",
  },

  body: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    padding: "20px 24px",
  },

  field: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },

  label: {
    fontSize: "14px",
    fontWeight: 500,
  },

  businessTypes: {
    display: "flex",
    alignItems: "center",
    gap: "18px",
    flexWrap: "wrap",
  },

  checkbox: {
    display: "flex",
    alignItems: "center",
  },

  input: {
    width: "100%",
  },

  codeInput: {
    width: "150px",
  },

  footer: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "10px",
    padding: "14px 24px",
    borderTop: "1px solid #e5e5e5",
  },
});

const AddChartAccountDrawer = ({
  open,
  onClose,
  onSave,
}) => {
  const styles = useStyles();

  const [formData, setFormData] = React.useState({
    businessTypes: {
      limited: true,
      llp: true,
      individual: true,
      partnership: true,
    },
    accountType: "",
    name: "",
    tags: "",
    code: "",
  });

  const handleBusinessTypeChange = (type, checked) => {
    setFormData((prev) => ({
      ...prev,
      businessTypes: {
        ...prev.businessTypes,
        [type]: checked,
      },
    }));
  };

  const handleSave = () => {
    console.log("Chart Account:", formData);

    if (onSave) {
      onSave(formData);
    }
  };

  return (
    <Drawer
      open={open}
      onOpenChange={(_, data) => {
        if (!data.open) {
          onClose();
        }
      }}
      position="end"
      className={styles.drawer}
    >
      <DrawerHeader>
        <DrawerHeaderTitle
          action={
            <Button
              appearance="subtle"
              icon={<DismissRegular />}
              onClick={onClose}
              aria-label="Close"
            />
          }
        >
          Add Account
        </DrawerHeaderTitle>
      </DrawerHeader>

      <DrawerBody className={styles.body}>

        {/* Business Type */}
        <div className={styles.field}>
          <Label className={styles.label}>
            Business Type
          </Label>

          <div className={styles.businessTypes}>
            <Checkbox
              className={styles.checkbox}
              label="Limited"
              checked={formData.businessTypes.limited}
              onChange={(_, data) =>
                handleBusinessTypeChange("limited", data.checked)
              }
            />

            <Checkbox
              className={styles.checkbox}
              label="LLP"
              checked={formData.businessTypes.llp}
              onChange={(_, data) =>
                handleBusinessTypeChange("llp", data.checked)
              }
            />

            <Checkbox
              className={styles.checkbox}
              label="Individual"
              checked={formData.businessTypes.individual}
              onChange={(_, data) =>
                handleBusinessTypeChange("individual", data.checked)
              }
            />

            <Checkbox
              className={styles.checkbox}
              label="Partnership"
              checked={formData.businessTypes.partnership}
              onChange={(_, data) =>
                handleBusinessTypeChange("partnership", data.checked)
              }
            />
          </div>
        </div>

        {/* Account Type */}
        <div className={styles.field}>
          <Label className={styles.label}>
            Account Type
          </Label>

          <Dropdown
            className={styles.input}
            placeholder="Search account type"
            value={formData.accountType}
            onOptionSelect={(_, data) => {
              setFormData((prev) => ({
                ...prev,
                accountType: data.optionValue,
              }));
            }}
          >
            <Option value="turnover">
              Turnover
            </Option>

            <Option value="cost-of-sales">
              Cost of Sales
            </Option>

            <Option value="expenses">
              Expenses
            </Option>

            <Option value="assets">
              Assets
            </Option>

            <Option value="liabilities">
              Liabilities
            </Option>

            <Option value="capital">
              Capital
            </Option>
          </Dropdown>
        </div>

        {/* Name */}
        <div className={styles.field}>
          <Label className={styles.label}>
            Name
          </Label>

          <Input
            className={styles.input}
            value={formData.name}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                name: e.target.value,
              }))
            }
          />
        </div>

        {/* Tags */}
        <div className={styles.field}>
          <Label className={styles.label}>
            Tags
          </Label>

          <Input
            className={styles.input}
            value={formData.tags}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                tags: e.target.value,
              }))
            }
          />
        </div>

        {/* Code */}
        <div className={styles.field}>
          <Label className={styles.label}>
            Code
          </Label>

          <Input
            className={styles.codeInput}
            value={formData.code}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                code: e.target.value,
              }))
            }
          />
        </div>

      </DrawerBody>

      <DrawerFooter className={styles.footer}>
        <Button
          appearance="secondary"
          onClick={onClose}
        >
          Cancel
        </Button>

        <Button
          appearance="primary"
          icon={<SaveRegular />}
          onClick={handleSave}
        >
          Save
        </Button>
      </DrawerFooter>
    </Drawer>
  );
};

export default AddChartAccountDrawer;