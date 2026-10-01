import * as React from "react";

import {
  OverlayDrawer,
  DrawerHeader,
  DrawerHeaderTitle,
  DrawerBody,
  DrawerFooter,
  Button,
  Field,
  Input,
  Radio,
  RadioGroup,
  Dropdown,
  Option,
  Checkbox,
  makeStyles,
} from "@fluentui/react-components";

import { DatePicker } from "@fluentui/react-datepicker-compat";

import {
  Dismiss24Regular,
  ArrowDownload16Regular,
  Delete16Regular,
} from "@fluentui/react-icons";

import { useNavigate } from "react-router-dom";


const useStyles = makeStyles({
  body: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    padding: "20px 24px",
  },

  field: {
    width: "100%",
  },

  input: {
    width: "100%",
  },

  dropdown: {
    width: "100%",
  },

  datePicker: {
    width: "100%",
  },

  checkboxGroup: {
    display: "flex",
    alignItems: "center",
    gap: "18px",
    flexWrap: "wrap",
  },

  fileContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },

  selectedFile: {
    fontSize: "13px",
    color: "#666",
  },

  fileRow: {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "8px",
  width: "100%",
},

fileName: {
  fontSize: "13px",
  color: "#666",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
},
  footer: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "10px",
    padding: "14px 24px",
    borderTop: "1px solid #e5e5e5",
  },
});


const AddDrawer = ({
  open,
  onClose,
  title = "Add",
  fields = [],
  initialValues = {},
  onSubmit,
  submitText,
  createTrialBalance,
}) => {

  const styles = useStyles();
  const navigate = useNavigate()

  /*
  |--------------------------------------------------------------------------
  | Form Data
  |--------------------------------------------------------------------------
  */

  const [formData, setFormData] =
    React.useState(initialValues);


  React.useEffect(() => {
    if (open) {
      setFormData(initialValues);
    }
  }, [open, initialValues]);


  const handleChange = (name, value) => {

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

  };

  const handleFieldChange = (field, value) => {

    setFormData((prev) => {

      const updatedData = {
        ...prev,
        [field.name]: value,
      };


      if (field.clearFieldsOnChange) {

        field.clearFieldsOnChange.forEach(
          (fieldName) => {
            updatedData[fieldName] = null;
          }
        );

      }

      return updatedData;

    });

  };


  /*
  |--------------------------------------------------------------------------
  | Check if field should be visible
  |--------------------------------------------------------------------------
  */

  const isFieldVisible = (field) => {

    if (!field.showWhen) {
      return true;
    }


    const {
      field: dependentField,
      value,
    } = field.showWhen;


    return formData[dependentField] === value;

  };


  /*
  |--------------------------------------------------------------------------
  | Handle Save
  |--------------------------------------------------------------------------
  */

  const handleSave = () => {
 console.log("Form Data:", formData);
    if (onSubmit) {
      onSubmit(formData);
    }

  };



  const renderField = (field) => {



    if (field.type === "date") {

      return (
        <DatePicker
          className={styles.datePicker}
          placeholder={
            field.placeholder ||
            "Select a date..."
          }
          value={
            formData[field.name] ||
            undefined
          }
          onSelectDate={(date) => {
            handleChange(
              field.name,
              date
            );
          }}
          formatDate={(date) => {

            if (!date) {
              return "";
            }

            const day =
              String(
                date.getDate()
              ).padStart(2, "0");

            const month =
              String(
                date.getMonth() + 1
              ).padStart(2, "0");

            const year =
              date.getFullYear();

            return `${day}/${month}/${year}`;

          }}
        />
      );

    }


    /*
    |--------------------------------------------------------------------------
    | RADIO
    |--------------------------------------------------------------------------
    */

    if (field.type === "radio") {

      return (
        <RadioGroup
          value={
            formData[field.name] || ""
          }
          onChange={(_, data) => {

            handleFieldChange(
              field,
              data.value
            );

          }}
          layout={
            field.layout ||
            "horizontal"
          }
        >

          {field.options?.map(
            (option) => (

              <Radio
                key={option.value}
                value={option.value}
                label={option.label}
              />

            )
          )}

        </RadioGroup>
      );

    }


    /*
    |--------------------------------------------------------------------------
    | CHECKBOX
    |--------------------------------------------------------------------------
    */

    if (field.type === "checkbox") {

      return (
        <Checkbox
          label={
            field.checkboxLabel ||
            field.label
          }
          checked={
            formData[field.name] ||
            false
          }
          onChange={(_, data) => {

            handleChange(
              field.name,
              data.checked
            );

          }}
        />
      );

    }


    /*
    |--------------------------------------------------------------------------
    | CHECKBOX GROUP
    |--------------------------------------------------------------------------
    */

    if (field.type === "checkbox-group") {

      const selectedValues =
        formData[field.name] || [];


      return (
        <div
          className={
            styles.checkboxGroup
          }
        >

          {field.options?.map(
            (option) => (

              <Checkbox
                key={option.value}
                label={option.label}
                checked={
                  selectedValues.includes(
                    option.value
                  )
                }
                onChange={(_, data) => {

                  const checked =
                    data.checked;

                  const newValues =
                    checked
                      ? [
                          ...selectedValues,
                          option.value,
                        ]
                      : selectedValues.filter(
                          (value) =>
                            value !==
                            option.value
                        );

                  handleChange(
                    field.name,
                    newValues
                  );

                }}
              />

            )
          )}

        </div>
      );

    }


    /*
    |--------------------------------------------------------------------------
    | DROPDOWN
    |--------------------------------------------------------------------------
    */

    if (field.type === "select") {

      const selectedOption =
        field.options?.find(
          (option) =>
            option.value ===
            formData[field.name]
        );


      return (
        <Dropdown
          className={
            styles.dropdown
          }
          placeholder={
            field.placeholder ||
            "Select"
          }
          value={
            selectedOption?.label ||
            ""
          }
          selectedOptions={
            formData[field.name]
              ? [
                  formData[
                    field.name
                  ],
                ]
              : []
          }
          onOptionSelect={(_, data) => {

            handleChange(
              field.name,
              data.optionValue
            );

          }}
        >

          {field.options?.map(
            (option) => (

              <Option
                key={option.value}
                value={option.value}
              >
                {option.label}
              </Option>

            )
          )}

        </Dropdown>
      );

    }


    /*
    |--------------------------------------------------------------------------
    | FILE
    |--------------------------------------------------------------------------
    */

    // if (field.type === "file") {

    //   return (
    //     <div
    //       className={
    //         styles.fileContainer
    //       }
    //     >

    //       <input
    //         id={field.name}
    //         type="file"
    //         accept={field.accept}
    //         style={{
    //           display: "none",
    //         }}
    //         onChange={(e) => {

    //           const file =
    //             e.target.files?.[0];

    //           handleChange(
    //             field.name,
    //             file
    //           );

    //         }}
    //       />


if (field.type === "file") {
  const selectedFile = formData[field.name];

  return (
    <div className={styles.fileContainer}>
      <input
        id={field.name}
        type="file"
        accept={field.accept}
        style={{ display: "none" }}
        onChange={(e) => {
          const file = e.target.files?.[0];

          if (file) {
            handleChange(field.name, file);
          }
        }}
      />

      {!selectedFile?.name ? (
        <label htmlFor={field.name}>
          <Button
            as="span"
            // appearance="outline"
          >
            Select or drop file
          </Button>
        </label>
      ) : (
        <div className={styles.fileRow}>
          <span className={styles.fileName}>
            {selectedFile.name}
          </span>

          <Button
            appearance="subtle"
            icon={<Delete16Regular />}
            aria-label="Delete selected CSV"
            title="Delete selected CSV"
            onClick={() => {
              handleChange(field.name, null);
            }}
          />
        </div>
      )}
    </div>
  );
}

    /*
    |--------------------------------------------------------------------------
    | LINK
    |--------------------------------------------------------------------------
    */

    if (field.type === "link") {

      return (
        <Button
          appearance="transparent"
          icon={
            <ArrowDownload16Regular />
          }
          onClick={
            field.onClick
          }
        >
         {field.buttonLabel || "Template"}
        </Button>
      );

    }


    /*
    |--------------------------------------------------------------------------
    | NORMAL INPUT
    |--------------------------------------------------------------------------
    */

    return (
      <Input
        className={styles.input}
        type={
          field.type ||
          "text"
        }
        placeholder={
          field.placeholder ||
          ""
        }
        value={
          formData[field.name] ||
          ""
        }
        onChange={(e) => {

          handleChange(
            field.name,
            e.target.value
          );

        }}
      />
    );

  };


  /*
  |--------------------------------------------------------------------------
  | Button Text
  |--------------------------------------------------------------------------
  */

  const buttonText =
    submitText ||
    (
      formData.importMode === "manual"
        ? "Next"
        : "Next"
    );

  /*
  |--------------------------------------------------------------------------
  | UI
  |--------------------------------------------------------------------------
  */

  return (
    <OverlayDrawer
      position="end"
      open={open}
      onOpenChange={(_, data) => {

        if (!data.open) {
          onClose();
        }

      }}
    >

      <DrawerHeader>

        <DrawerHeaderTitle
          action={

            <Button
              appearance="subtle"
              aria-label="Close"
              icon={
                <Dismiss24Regular />
              }
              onClick={onClose}
            />

          }
        >

          {title}

        </DrawerHeaderTitle>

      </DrawerHeader>


      <DrawerBody
        className={styles.body}
      >

        {fields.map((field) => {

          /*
          |--------------------------------------------------------------------------
          | Conditional Field
          |--------------------------------------------------------------------------
          */

          if (!isFieldVisible(field)) {
            return null;
          }


          return (
            <Field
              key={field.name}
              className={styles.field}
              label={field.label}
              required={field.required}
            >

              {renderField(field)}

            </Field>
          );

        })}

      </DrawerBody>


      <DrawerFooter
        className={styles.footer}
      >

        <Button
          appearance="secondary"
          onClick={onClose}
        >
          Cancel
        </Button>


        <Button
          appearance="primary"
          onClick={handleSave}
        >
          {buttonText}
        </Button>

      </DrawerFooter>

    </OverlayDrawer>
  );
};


export default AddDrawer;