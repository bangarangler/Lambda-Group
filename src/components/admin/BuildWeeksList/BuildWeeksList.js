import React, { useState, useEffect, useContext } from "react";
import { withRouter } from "react-router-dom";
import { db } from "../../../logic/firebase";
import { Card, Button } from "semantic-ui-react";
import Spinner from "../../globalComponents/Spinner/Spinner.js";
import LocalSpinner from "../../globalComponents/Spinner/LocalSpinner.js";
import { UserContext } from "../../../context/allContexts";

import CopyLink from "./CopyLink";
// import { styles } from "ansi-colors";
import styles from "./BuildWeeksList.module.scss";

const BuildWeeksList = props => {
  const { setCurrentBuildWeekURL } = useContext(UserContext);

  const [listOfBuildWeeks, setListOfBuildWeeks] = useState([]);
  const [triggerDeleteState, setTriggerDeleteState] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  //  ===================================== Populates list of build weeks ===================================== //

  const fetchBuildWeeks = async () => {
    setListOfBuildWeeks([]);
    let buildWeeksCollection = await db.collection("build_weeks").get();
    buildWeeksCollection.forEach(function(doc) {
      setListOfBuildWeeks(prevSetOfBuildWeeks => {
        return [...prevSetOfBuildWeeks, `${doc.id}`];
      });
    });
  };
  useEffect(() => {
    fetchBuildWeeks();
  }, [props.update, triggerDeleteState]);

  //  ===================================== Push to Individual Build Week View ===================================== //

  function goToBuildWeekView(buildWeek) {
    setCurrentBuildWeekURL(buildWeek);
    props.history.push(`/Admin/${buildWeek}`);
  }

  function removeBuildWeek(buildWeek) {
    setIsDeleting(true);
    db.collection("build_weeks")
      .doc(`${buildWeek}`)
      .collection("projects")
      .get()
      .then(snapshot => {
        snapshot.forEach(doc => {
          db.collection("build_weeks")
            .doc(`${buildWeek}`)
            .collection("projects")
            .doc(doc.data().project.uid)
            .delete();
        });
        db.collection("build_weeks")
          .doc(`${buildWeek}`)
          .delete()
          .then(function() {
            setTriggerDeleteState(!triggerDeleteState);
            setIsDeleting(false);
          })
          .catch(err => {
            console.error(err);
          });
      });
  }

  return (
    <div>
      {isDeleting && <Spinner />}
      <Card.Group
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "center"
        }}
      >
        {listOfBuildWeeks &&
          listOfBuildWeeks.map(buildWeek => (
            <Card key={`${buildWeek}`} style={{ width: "max-content" }}>
              {props.currentLoadingBuildWeek === buildWeek ? (
                <LocalSpinner />
              ) : (
                <>
                  <Card.Content
                    style={{ cursor: "pointer" }}
                    onClick={() => goToBuildWeekView(buildWeek)}
                  >
                    <Card.Header>{buildWeek}</Card.Header>
                  </Card.Content>
                  <Card.Content>
                    <div className="ui buttons">
                      <CopyLink buildWeek={buildWeek} />
                      <Button.Or className={styles.or} />
                      <Button
                        onClick={() => goToBuildWeekView(buildWeek)}
                        color="green"
                        // style={{ borderRadius: "6px" }}
                      >
                        View
                      </Button>
                      <Button.Or className={styles.or} />
                      <Button
                        onClick={() => removeBuildWeek(buildWeek)}
                        color="red"
                        // style={{ borderRadius: "6px" }}
                      >
                        Delete
                      </Button>
                    </div>
                  </Card.Content>
                </>
              )}
            </Card>
          ))}
      </Card.Group>
    </div>
  );
};

export default withRouter(BuildWeeksList);
