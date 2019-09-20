import React, { useState, useEffect, useContext } from "react";
import { db } from "../../../../logic/firebase.js";
import { Button, Header } from "semantic-ui-react";
import { UserContext } from "../../../../context/allContexts";
import styles from "./BuildWeekSelection.module.scss";

const BuildWeekSelection = props => {
  const { setCurrentBuildWeekURL } = useContext(UserContext);
  const [hackathons, setHackathons] = useState([]);

  useEffect(() => {
    let urls = [];
    db.collection("build_weeks")
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          urls.push(doc.data().buildWeekName);
        });
        setHackathons(urls);
      });
  }, []);

  const handleBuildWeekSelection = nameOfBuildWeek => {
    setCurrentBuildWeekURL(nameOfBuildWeek);
  };

  return (
    <div>
      <Header className={styles.header} as="h2">
        Pick a build week
      </Header>
      <div className={styles.selectContainer}>
        {hackathons &&
          hackathons.map(hack => {
            return (
              <Button
                className={styles.buildWeek}
                key={hack}
                color="blue"
                onClick={() => handleBuildWeekSelection(hack)}
              >
                {hack.replace(/_/g, " ")}
              </Button>
            );
          })}
      </div>
    </div>
  );
};

export default BuildWeekSelection;
