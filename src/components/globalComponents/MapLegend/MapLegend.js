import React, { useState } from "react";
import styles from "./MapLegend.module.scss";
import projectRoleOptions from "../../../utils/projectRoleOptions";

const MapLegend = () => {
  const [legend] = useState(projectRoleOptions);
  return (
    <div className={styles.legendContainer}>
      <div className={styles.mapTitle}>Role Legend</div>
      <div className={styles.singleContainer}>
        {legend.map(single => (
          <div className={styles.single} key={single.title}>
            <h3 className={styles.role}>{single.title}</h3>
            <div
              className={styles.dot}
              style={{ backgroundColor: `${single.bgColor}` }}
            ></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MapLegend;
