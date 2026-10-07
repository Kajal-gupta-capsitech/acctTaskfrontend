import React from "react";

import {
    makeStyles,
} from "@fluentui/react-components";

import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

const useStyles = makeStyles({
    nav: {
        minWidth: "260px",
    },
    header: {
        background:"#4286F3",
        width: "100%",
        height: "40px",
    },
    title:{
        color:"white",
        marginTop:"10px",
        paddingLeft: "10px",
        fontSize: "14px",
        fontWeight: "bold",
    }
});

const Header = () => {
    const styles = useStyles();

    const location = useLocation();
    const navigate = useNavigate();

    const [isOpen, setIsOpen] = useState(true);

    return (
        <>
            <div className={styles.header}>
                <p className={styles.title}> Acting Office 2</p>
            </div>
        </>
    );
};


export default Header;