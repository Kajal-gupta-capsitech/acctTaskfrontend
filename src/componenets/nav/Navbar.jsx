import React from "react";

import {
  AppItem,
  Hamburger,
  NavDrawer,
  NavDrawerBody,
  NavDrawerHeader,
  NavItem,
  Tooltip,
  makeStyles,
} from "@fluentui/react-components";

import {
  Board20Filled,
  Board20Regular,
  DocumentBulletListMultiple20Filled,
  DocumentBulletListMultiple20Regular,
  People20Filled,
  People20Regular,
  bundleIcon,
} from "@fluentui/react-icons";

import { NavLink, useLocation, useNavigate } from "react-router-dom";

const useStyles = makeStyles({
  nav: {
    minWidth: "260px",
  },

  collapsedNav: {
    width: "60px",
    minWidth: "60px",
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    borderRight: "1px solid #e0e0e0",
    backgroundColor: "#ffffff",
  },

  collapsedHeader: {
    height: "52px",
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  collapsedItems: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "8px",
    marginTop: "12px",
  },

  collapsedItem: {
    width: "44px",
    height: "44px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    border: "none",
    backgroundColor: "transparent",
    borderRadius: "4px",
  },
});

const DashboardIcon = bundleIcon(
  Board20Filled,
  Board20Regular
);

const AccountsIcon = bundleIcon(
  People20Filled,
  People20Regular
);

const ReportsIcon = bundleIcon(
  DocumentBulletListMultiple20Filled,
  DocumentBulletListMultiple20Regular
);

const Navbar = () => {
  const styles = useStyles();

  const location = useLocation();
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = React.useState(true);

  return (
    <>
      {isOpen && (
        <NavDrawer
          open={true}
          type="inline"
          selectedValue={location.pathname}
          className={styles.nav}
        >
          <NavDrawerHeader>
            <Tooltip
              content="Collapse Navigation"
              relationship="label"
            >
              <Hamburger
                onClick={() => setIsOpen(false)}
              />
            </Tooltip>
          </NavDrawerHeader>

          <NavDrawerBody>

            <AppItem>
              ACCOUNTS
            </AppItem>

            <NavItem
              value="/chart-accounts"
              icon={<DashboardIcon />}
              onClick={() => navigate("/chart-accounts")}
            >
              Chart of Accounts
            </NavItem>

            <NavItem
              value="/accounting-period"
              icon={<AccountsIcon />}
              onClick={() => navigate("/accounting-period")}
            >
              Accounting Period
            </NavItem>

            <NavItem
              value="/trial-balances"
              icon={<ReportsIcon />}
              onClick={() => navigate("/trial-balances")}
            >
              Trial Balance
            </NavItem>

          </NavDrawerBody>
        </NavDrawer>
      )}

      {!isOpen && (
        <div className={styles.collapsedNav}>

          <div className={styles.collapsedHeader}>
            <Tooltip
              content="Expand Navigation"
              relationship="label"
            >
              <Hamburger
                onClick={() => setIsOpen(true)}
              />
            </Tooltip>
          </div>

          <div className={styles.collapsedItems}>

            <Tooltip
              content="Chart of Accounts"
              relationship="label"
            >
              <button
                className={styles.collapsedItem}
                onClick={() => navigate("/chart-accounts")}
              >
                <DashboardIcon />
              </button>
            </Tooltip>

            <Tooltip
              content="Accounting Period"
              relationship="label"
            >
              <button
                className={styles.collapsedItem}
                onClick={() => navigate("/accounting-period")}
              >
                <AccountsIcon />
              </button>
            </Tooltip>

            <Tooltip
              content="Trial Balance"
              relationship="label"
            >
              <button
                className={styles.collapsedItem}
                onClick={() => navigate("/trial-balances")}
              >
                <ReportsIcon />
              </button>
            </Tooltip>

          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;