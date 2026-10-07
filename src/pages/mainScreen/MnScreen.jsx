import React from "react";
import { makeStyles } from "@fluentui/react-components";
import { Outlet } from "react-router-dom";
import Navbar from "../../componenets/nav/Navbar";
import Header from "../../componenets/Header";

const useStyles = makeStyles({
  root: {
    display: "flex",
    height: "100vh",
    overflow: "hidden",
  },

  content: {
    flex: 1,
    minWidth: 0,
    // padding: "24px",
    overflow: "auto",
  },
  mainContainer:{
    // border: "1px solid blue",
    // width: "80%%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
  }
});

const MainScreen = () => {
  const styles = useStyles();

  return (
    <div className={styles.root}>
      {/* Sidebar remains mounted for all child routes */}
      <Navbar />
<div className={styles.mainContainer}>
  <Header/>
      {/* Only this section changes when the route changes */}
      <main className={styles.content}>
        <Outlet />
      </main>
</div>
    </div>
  );
};

export default MainScreen;