import React, { useState } from "react";
import { Form, Button, Input } from "semantic-ui-react";
import { db } from "../../../../logic/firebase";
import CSVReader from "react-csv-reader";
import { toast } from "react-toastify";

import styles from "./AddBuildWeeks.module.scss";

const AddBuildWeek = props => {
  // ============================== Creating a Build Week ========================= //

  const [buildWeekName, SetBuildWeekName] = useState("");

  const handleChange = e => {
    let spaceLessInput = e.target.value.replace(/ /g, "_");
    SetBuildWeekName(spaceLessInput);
  };

  const addBuildWeek = async e => {
    e.preventDefault();
    if (buildWeekName === undefined || buildWeekName === "") {
      toast("Must Provide A Name!");
      return;
    } else if (CSVData.length === 0) {
      toast("Must Provide A CSV File!");
      return;
    }
    props.setCurrentLoadingBuildWeek(buildWeekName);
    const check = db.collection("build_weeks").doc(`${buildWeekName}`);
    const giveMe = await check.get();
    const exist = giveMe.data();
    if (!exist) {
      db.collection("build_weeks")
        .doc(`${buildWeekName}`)
        .set({
          buildWeekName
        })
        .then(async () => {
          const buildWeek = db
            .collection("build_weeks")
            .doc(`${buildWeekName}`);
          const response = await buildWeek.get();
          response.data();
          SetBuildWeekName("");
          // Add projects to database
          convertedProjects();
        })
        .catch(err => {
          console.log(err);
          toast(err);
        });
    } else {
      props.setCurrentLoadingBuildWeek(null);
      toast("That name is Already in the database!");
    }
  };

  // ========================= Populate Build Week with projects ========================= //

  const [CSVData, setCSVData] = useState([]);

  const convertedProjects = async () => {
    await CSVData.map((item, index) => {
      const project = {
        title: item[0],
        pitch: item[1],
        mvp: item[2],
        stretch: item[3],
        designLinks_dataSets: item[4],
        productType: item[5],
        iosDeveloper: item[6],
        webUiDeveloper: item[7],
        frontEndDeveloper: item[8],
        frontEndFrameWorkDeveloper: item[9],
        webBackEndDeveloper: item[10],
        uXDesigner: item[11],
        projectLead: item[12],
        androidDeveloper: item[13],
        dataEngineer: item[14],
        machineLearningEngineer: item[15]
      };
      if (index > 0 && project.title !== "") {
        db.collection("build_weeks")
          .doc(`${buildWeekName}`)
          .collection("projects")
          .add({ project })
          .then(async ref => {
            project.uid = ref.id;
            ref
              .set(
                {
                  project: {
                    ...ref.project,
                    uid: ref.id,
                    availableRoles: {
                      androidDeveloper: { names: [] },
                      iosDeveloper: { names: [] },
                      dataEngineer: { names: [] },
                      frontEndDeveloper: { names: [] },
                      frontEndFrameWorkDeveloper: { names: [] },
                      machineLearningEngineer: { names: [] },
                      projectLead: { names: [] },
                      uXDesigner: { names: [] },
                      webBackEndDeveloper: { names: [] },
                      webUiDeveloper: { names: [] }
                    }
                  }
                },
                { merge: true }
              )
              .then(() => {
                console.log("IF COMPARISON: ", index, CSVData.length);
                // -3 is used because the CSV reader sends through a blank line at the end, we are also compensating for the first line that is the headers for the csv and the index starting at 0 instead of 1
                if (index === CSVData.length - 3) {
                  // *** important, don't change the -3, see above *** //
                  props.setCurrentLoadingBuildWeek(null);
                }
              });
          });
      }
      if (project.title !== "") {
        return project;
      } else {
        return null;
      }
    });
    props.setUpdate(!props.update);
  };

  return (
    <>
      <Form className={styles.csvForm} onSubmit={e => addBuildWeek(e)}>
        <h4>Upload CSV to add projects</h4>
        <Form.Field className={styles.formFields}>
          <CSVReader
            cssClass={`csv-reader-input ${styles.csvReaderInput}`}
            // label="Add projects with CSV"
            onFileLoaded={data => setCSVData(data)}
            inputId="ObiWan"
          />
          <Input
            label="name"
            value={buildWeekName}
            onChange={handleChange}
            placeholder="build week ... ?"
          />
        </Form.Field>
        <Button type="submit" color="green" className={styles.button}>
          Create Build Week
        </Button>
      </Form>
    </>
  );
};

export default AddBuildWeek;
