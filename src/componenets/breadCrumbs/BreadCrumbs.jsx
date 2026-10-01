import * as React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbDivider,
  BreadcrumbButton,
} from "@fluentui/react-components";
import { useLocation, useNavigate } from "react-router-dom";

export const BreadCrumbs = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const pathParts = location.pathname
    .split("/")
    .filter(Boolean);

  const getLabel = (part) => {
    const labels = {
      "chart-accounts": "Chart Accounts",
      "accounting-period": "Accounting Period",
      "trial-balances": "Trial Balance",
      journal: "Journal",
    };

    return labels[part] || part;
  };

  return (
    <Breadcrumb aria-label="Breadcrumb">

      {/* Home */}
      <BreadcrumbItem>
        <BreadcrumbButton onClick={() => navigate("/")}>
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

