import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import { db } from "../../../logic/firebase";
import { Card, Button } from "semantic-ui-react";

import CopyLink from "./CopyLink";

const BuildWeeksList = props => {
  const [listOfBuildWeeks, setListOfBuildWeeks] = useState([]);

  //  ===================================== Populates list of build weeks ===================================== //
  //TODO: needs to run each time a build week is created
  // I've lifted the state up and tried multiple ways of dealing with this.
  // the problem is right here. as it stands this is creating multiple cards
  // when a new build week is added.  however I don't have another way to do
  // this currently. freaking firebase.  going to have to bug fix this later.
  // moving on for now.
  const fetchBuildWeeks = async () => {
    setListOfBuildWeeks([]);
    let buildWeeksCollection = await db.collection("build_weeks").get();
    buildWeeksCollection.forEach(function(doc) {
      setListOfBuildWeeks(prevSetOfBuildWeeks => {
        return [...prevSetOfBuildWeeks, `${doc.id}`];
      });
      //console.log(doc.id, '=>', doc.data());
    });
  };
  useEffect(() => {
    fetchBuildWeeks();
  }, [props.update]);
  // }, []);

  //  ===================================== Push to Individual Build Week View ===================================== //

  function BuildWeekView(buildWeek) {
    console.log(props);
    props.history.push(`/Admin/${buildWeek}`);
  }

  return (
    <div>
      <Card.Group>
        {listOfBuildWeeks &&
          listOfBuildWeeks.map(buildWeek => (
            <Card key={`${buildWeek}`}>
              <Card.Content onClick={() => BuildWeekView(buildWeek)}>
                <Card.Header>{buildWeek}</Card.Header>
              </Card.Content>
              <Card.Content extra>
                <div className="ui buttons">
                  <Button basic color="red">
                    Delete
                  </Button>
                </div>
              </Card.Content>
              <CopyLink buildWeek={buildWeek} />
            </Card>
          ))}
      </Card.Group>
    </div>
  );
};

export default withRouter(BuildWeeksList);
