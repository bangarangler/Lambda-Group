import React, { useState, useContext, useEffect } from "react";
import { Button, Header, Modal } from "semantic-ui-react";
import { UserContext, BuildWeekContext } from "../../../context/allContexts";
import { db } from "../../../logic/firebase.js";
import { withRouter } from "react-router-dom";
import styles from "./SelectProjectRole.module.scss";
import possibleRoles from "../../../utils/projectRoleOptions";
import { toast } from "react-toastify";

const SelectProjectRole = ({ history }) => {
  const {
    email,
    userBuildWeeks,
    currentBuildWeekURL,
    setCurrentBuildWeekURL
  } = useContext(UserContext);

  const { projectsContext, fetchBuildWeekProjects } = useContext(
    BuildWeekContext
  );

  const [roles] = useState(possibleRoles);

  const [modalOpen, setModalOpen] = useState(false);
  const [roleChoice, setRoleChoice] = useState("");

  const addProjectRoleToFirestore = async (projectRole, confirm) => {
    console.log(confirm);
    let data;

    // If user is signing into a buildweek that they signed up for a project in previously as a different role,
    // remove them from the old project and clear out their project info from database
    if (
      !userBuildWeeks ||
      !userBuildWeeks[currentBuildWeekURL] ||
      userBuildWeeks[currentBuildWeekURL].projectRole === "" ||
      userBuildWeeks[currentBuildWeekURL].projectRole !== projectRole
    ) {
      // Double check they want to delete themselves from the project they previous sign up to with a different role
      if (
        userBuildWeeks &&
        userBuildWeeks[currentBuildWeekURL] &&
        userBuildWeeks[currentBuildWeekURL].projectRole !== ""
      ) {
        if (confirm === false) {
          setModalOpen(true);
          return null;
        }
      }

      // If moving to a different role in the same buildweek
      if (
        userBuildWeeks &&
        userBuildWeeks[currentBuildWeekURL] &&
        userBuildWeeks[currentBuildWeekURL].projectRole !== projectRole &&
        userBuildWeeks[currentBuildWeekURL].project !== ""
      ) {
        // remove user from previous project in the build week

        // filter names from project context
        let projectToChange = projectsContext.filter(project => {
          return (
            project.project.uid ===
            userBuildWeeks[currentBuildWeekURL].projectUid
          );
        });

        projectToChange = projectToChange[0];

        // filter student out of previous project's list of names for his/her role
        let newNames = projectToChange.project.availableRoles[
          userBuildWeeks[currentBuildWeekURL].projectRole
        ].names.filter(n => n.email !== email);

        // remove student's name object from previous build week in DB
        await db
          .doc(
            // build_weeks/current_build_week/projects/<project_uid>
            `build_weeks/${currentBuildWeekURL}/projects/${userBuildWeeks[currentBuildWeekURL].projectUid}`
          )
          .update({
            project: {
              ...projectToChange.project,
              availableRoles: {
                ...projectToChange.project.availableRoles,
                [userBuildWeeks[currentBuildWeekURL].projectRole]: {
                  ...projectToChange.project.availableRoles[
                    userBuildWeeks[currentBuildWeekURL].projectRole
                  ],
                  names: [...newNames]
                }
              }
            }
          })
          .then(() => null)
          .catch(err => console.error("err: ", err));
      }

      // Build data that goes into user side of database
      data = {
        buildWeeks: {
          [currentBuildWeekURL]: {
            projectRole: projectRole,
            project: "",
            projectUid: ""
          }
        }
      };
      db.collection("students")
        .doc(email)
        .set(data, { merge: true })
        .then(history.push(`/student/buildweek/${currentBuildWeekURL}`));
    } else {
      history.push(`/student/buildweek/${currentBuildWeekURL}`);
    }
  };

  useEffect(() => {
    fetchBuildWeekProjects(currentBuildWeekURL, projectsContext);
  }, []);

  return (
    <div>
      {/* Modal for confirmation if switching roles */}
      <Modal open={modalOpen} basic>
        <Modal.Content>
          <h3 className={styles.modalHeader}>
            Are you sure you want to change roles? If you do, you will be
            removed from the project you are currently signed up for.
          </h3>
        </Modal.Content>
        <Modal.Content className={styles.modalButtonDiv}>
          <Button
            negative
            size="big"
            className={styles.nevermind}
            onClick={() => {
              setModalOpen(false);
            }}
          >
            Nevermind
          </Button>
          <Button
            className={styles.confirm}
            positive
            size="big"
            onClick={() => {
              addProjectRoleToFirestore(roleChoice, true);
            }}
          >
            Change roles
          </Button>
        </Modal.Content>
      </Modal>

      {/* everything else */}
      <Header style={{ textAlign: "center" }} as="h2">
        Whats Your Role For {currentBuildWeekURL.replace(/_/g, " ")}?
      </Header>
      <div className={styles.selectContainer}>
        {roles.map(role => {
          return (
            <Button
              onClick={() => {
                addProjectRoleToFirestore(role.selection, false);
                setRoleChoice(role.selection);
              }}
              color="green"
              className={styles.role}
              style={{ backgroundColor: `${role.bgColor}` }}
              key={role.title}
            >
              {role.title}
            </Button>
          );
        })}
      </div>
      <Button
        className={styles.back}
        onClick={() => setCurrentBuildWeekURL(null)}
      >
        Back to select Build Week
      </Button>
    </div>
  );
};

export default withRouter(SelectProjectRole);
