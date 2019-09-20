import React, { useContext } from "react";
import { Button, Icon, Modal, Grid, List } from "semantic-ui-react";
import {
  UserContext,
  NotificationsContext
} from "../../../context/allContexts";
import { db } from "../../../logic/firebase";
import { FaPlusSquare, FaMinusSquare } from "react-icons/fa";
import { toast } from "react-toastify";

import styles from "./ProjectViewModal.module.scss";

const ProjectViewModal = ({ projectModalData, setProjectModalData }) => {
  const {
    user,
    email,
    role,
    currentBuildWeekURL,
    userBuildWeeks,
    setLoading
  } = useContext(UserContext);

  const handleJoinProject = async project => {
    setLoading(true);
    if (userBuildWeeks[currentBuildWeekURL].project !== "") {
      let oldProjRef = await db
        .collection("build_weeks")
        .doc(currentBuildWeekURL)
        .collection("projects")
        .doc(userBuildWeeks[currentBuildWeekURL].projectUid);
      let oldProjectData = await oldProjRef.get();
      oldProjectData = oldProjectData.data();
      if (
        oldProjectData.project.availableRoles[
          userBuildWeeks[currentBuildWeekURL].projectRole
        ].names.length > 0
      ) {
        let newOldProjectData = oldProjectData.project.availableRoles[
          userBuildWeeks[currentBuildWeekURL].projectRole
        ].names.filter(n => n.email !== email);

        oldProjectData.project.availableRoles[
          userBuildWeeks[currentBuildWeekURL].projectRole
        ].names = newOldProjectData;

        oldProjRef.set(oldProjectData);
      }
    }
    // reference project in DB
    const projectRef = db
      .collection("build_weeks")
      .doc(currentBuildWeekURL)
      .collection("projects")
      .doc(project.uid);
    // Get the data for the user's desired role that project from DB
    const projectData = await projectRef.get();
    let projectRoleData = await projectData.data().project.availableRoles[
      userBuildWeeks[currentBuildWeekURL].projectRole
    ];
    // check if there is room in that project for user
    if (
      projectRoleData.names.length <
      project[userBuildWeeks[currentBuildWeekURL].projectRole]
    ) {
      // Add user to project's data on DB
      await projectRef.set(
        {
          project: {
            availableRoles: {
              [userBuildWeeks[currentBuildWeekURL].projectRole]: {
                names: [
                  ...projectRoleData.names,
                  { name: user.displayName, email: email }
                ]
              }
            }
          }
        },
        { merge: true }
      );

      // Add project to user's data on DB
      const userRef = db.collection("students").doc(email);
      await userRef.set(
        {
          buildWeeks: {
            [currentBuildWeekURL]: {
              project: project.title,
              projectUid: project.uid
            }
          }
        },
        { merge: true }
      );
    } else {
      toast(
        `Sorry no more ${userBuildWeeks[currentBuildWeekURL].projectRole} slots left. Please pick another project!`
      );
    }
    setLoading(false);
  };

  const handleAddRole = async roleToAdd => {
    let limit = parseInt(projectModalData[roleToAdd]);
    limit++;
    await db
      .doc(
        `build_weeks/${currentBuildWeekURL}/projects/${projectModalData.uid}`
      )
      .set(
        {
          project: { [roleToAdd]: limit }
        },
        { merge: true }
      );
  };

  const handleSubtractRole = async roleToSubtract => {
    let limit = parseInt(projectModalData[roleToSubtract]);
    const numSignedUp =
      projectModalData.availableRoles[roleToSubtract].names.length;
    if (numSignedUp < limit && limit > 0) {
      limit--;
      await db
        .doc(
          `build_weeks/${currentBuildWeekURL}/projects/${projectModalData.uid}`
        )
        .set(
          {
            project: { [roleToSubtract]: limit }
          },
          { merge: true }
        );
    } else if (limit === 0) {
      toast("Can't subtract any more");
    } else {
      toast("Please delete a user first");
    }
  };

  const handleRemoveStudent = async (email, studentRole, namesList) => {
    // remove student from project in project database
    const studentRef = db.doc(`students/${email}`);
    let studentToBeRemoved = await studentRef.get();
    studentToBeRemoved = studentToBeRemoved.data();
    studentRef.set({
      ...studentToBeRemoved,
      buildWeeks: {
        ...studentToBeRemoved.buildWeeks,
        [currentBuildWeekURL]: {
          ...studentToBeRemoved.buildWeeks[currentBuildWeekURL],
          project: "",
          projectUid: ""
        }
      }
    });
    let newNames = namesList.filter(n => n.email !== email);

    await db
      .doc(
        `build_weeks/${currentBuildWeekURL}/projects/${projectModalData.uid}`
      )
      .update({
        project: {
          ...projectModalData,
          availableRoles: {
            ...projectModalData.availableRoles,
            [studentRole]: {
              ...projectModalData.availableRoles[studentRole],
              names: [...newNames]
            }
          }
        }
      });
    // remove project from student in student database
  };
  let allowJoin;

  if (
    projectModalData &&
    userBuildWeeks &&
    userBuildWeeks[currentBuildWeekURL]
  ) {
    allowJoin =
      projectModalData.availableRoles[
        userBuildWeeks[currentBuildWeekURL].projectRole
      ].names.length <
      projectModalData[userBuildWeeks[currentBuildWeekURL].projectRole];
  }

  return (
    <Modal
      // className={styles.modalContainer}
      open={projectModalData !== null}
      // close={projectModalData === null}
      onClose={() => setProjectModalData(null)}
    >
      <Modal.Header
        className={styles.modalTitle}
        style={{ textAlign: "center" }}
      >
        <h3>{projectModalData.title}</h3>
      </Modal.Header>

      <Modal.Content>
        <Grid columns={2} relaxed="very">
          <Grid.Column>
            {/* <div className={styles.modalMainBody}> */}
            <p>{projectModalData.pitch}</p>
            <p>{projectModalData.mvp}</p>
            <p>{projectModalData.stretch}</p>
            {/* </div> */}
          </Grid.Column>
          <Grid.Column>
            <div className={styles.modalTeamMembers}>
              <h3>Team Members</h3>
              <List celled>
                {Object.keys(projectModalData.availableRoles).map(allRoles => {
                  if (role === "student" && projectModalData[allRoles] <= 0) {
                    return null;
                  } else {
                    return (
                      <List.Item key={allRoles}>
                        <List.Content
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "flex-start",
                            flexWrap: "wrap"
                          }}
                        >
                          <List.Header>
                            {allRoles} (max - {projectModalData[allRoles]}){" "}
                            {role !== "student" ? (
                              <>
                                <FaMinusSquare
                                  className={styles.icon}
                                  onClick={() => handleSubtractRole(allRoles)}
                                />
                                <FaPlusSquare
                                  className={styles.icon}
                                  onClick={() => handleAddRole(allRoles)}
                                />
                              </>
                            ) : null}
                          </List.Header>
                          {projectModalData.availableRoles[allRoles].names.map(
                            r => {
                              return (
                                <div key={r.email}>
                                  {role === "overlord" ? (
                                    <Button
                                      color="red"
                                      animated="vertical"
                                      onClick={() =>
                                        handleRemoveStudent(
                                          r.email,
                                          allRoles,
                                          projectModalData.availableRoles[
                                            allRoles
                                          ].names
                                        )
                                      }
                                    >
                                      <Button.Content visible>
                                        {r.name}
                                      </Button.Content>
                                      <Button.Content hidden>
                                        <Icon name="remove user" />
                                      </Button.Content>
                                    </Button>
                                  ) : (
                                    <p>{r.name}</p>
                                  )}
                                </div>
                              );
                            }
                          )}
                        </List.Content>
                      </List.Item>
                    );
                  }
                })}
              </List>
            </div>
          </Grid.Column>
        </Grid>
      </Modal.Content>
      <div
        className={styles.modalSignup}
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          marginBottom: "15px"
        }}
      >
        {role !== "overlord" && allowJoin ? (
          <Button
            color="green"
            onClick={e => handleJoinProject(projectModalData, e)}
          >
            +Join
          </Button>
        ) : (
          <Button
            disabled
            onClick={e => handleJoinProject(projectModalData, e)}
          >
            +Join
          </Button>
        )}
        <Button onClick={() => setProjectModalData(null)} color="red">
          Exit
        </Button>
      </div>
    </Modal>
  );
};

export default ProjectViewModal;
