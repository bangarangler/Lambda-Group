import React from "react";
import styles from "./LocalSpinner.module.scss";

const LocalSpinner = props => {
  return (
    <div className={styles.loaderContainer}>
      <div className={styles.loader}> </div>
    </div>
  );
};

export default LocalSpinner;
