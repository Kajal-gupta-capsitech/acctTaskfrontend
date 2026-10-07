import * as React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbDivider,
  BreadcrumbButton,
  makeStyles,
} from "@fluentui/react-components";
import { useLocation, useNavigate } from "react-router-dom";

const useStyles = makeStyles({
  breadcrumbContainer: {
    margin: "0px",
    borderBottom: "2px solid #D4D4D4",
    // padding: "2px",
    width: "100%",
    boxSizing: "border-box",
  },
  breadcrumbButton: {
    color: "#4286F3",
  },
});


export const BreadCrumbs = () => {
  const styles = useStyles();
  const location = useLocation();
  const navigate = useNavigate();

  const pathParts = location.pathname
    .split("/")
    .filter(Boolean);

  const getLabel = (part) => {
    const labels = {
      "chart-accounts": "Chart of Accounts",
      "accounting-period": "Accounting Period",
      "trial-balances": "Trial Balance",
      journal: "Journal",
    };

    return labels[part] || part;
  };

  return (
    <Breadcrumb aria-label="Breadcrumb" className={styles.breadcrumbContainer}>

      {/* Home */}
      <BreadcrumbItem>
        <BreadcrumbButton className={styles.breadcrumbButton} onClick={() => navigate("/")}>
          Home
        </BreadcrumbButton>
      </BreadcrumbItem>

      {pathParts.map((part, index) => {
        const path = "/" + pathParts.slice(0, index + 1).join("/");
        const isLast = index === pathParts.length - 1;

        return (
          <React.Fragment key={path}>
            <BreadcrumbDivider />

            <BreadcrumbItem>
              <BreadcrumbButton
                className={styles.breadcrumbButton}
                current={isLast}
                onClick={() => {
                  if (!isLast) {
                    navigate(path);
                  }
                }}
              >
                {getLabel(part)}
              </BreadcrumbButton>
            </BreadcrumbItem>
          </React.Fragment>
        );
      })}

    </Breadcrumb>
  );
};

