import React, { useContext, useEffect } from "react";
import { Card, Button, Header, Icon } from "semantic-ui-react";
import { UserContext } from "../../../context/allContexts";
import { db } from "../../../logic/firebase";
import { FaPlusSquare } from "react-icons/fa";

import styles from "./ProjectViewModal.module.scss";

const StudentProjectViewModal = ({ projectModalData, setProjectModalData }) => {
  const {
    user,
    setUser,
    email,
    setEmail,
    password,
    setPassword,
    role,
    setRole,
    currentBuildWeekURL,
    setCurrentBuildWeekURL,
    projectRole,
    setProjectRole,
    currentSelectedProject,
    setCurrentSelectedProject,
    setLoading,
    currentSelectedProjectUid,
    setCurrentSelectedProjectUid
  } = useContext(UserContext);

  //function showStudents() {
  //console.log(user)
  //TODO: Hook this up to show signed up
  //}

  const handleJoinProject = async project => {
    console.log(project);
    setLoading(true);
    if (currentSelectedProject !== "") {
      let oldProjRef = await db
        .collection("build_weeks")
        .doc(currentBuildWeekURL)
        .collection("projects")
        .doc(currentSelectedProjectUid);
      let oldProjectData = await oldProjRef.get();
      oldProjectData = oldProjectData.data();
      if (oldProjectData.project.availableRoles[projectRole].names.length > 0) {
        let newOldProjectData = oldProjectData.project.availableRoles[
          projectRole
        ].names.filter(n => n.email !== email);

        oldProjectData.project.availableRoles[
          projectRole
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
      projectRole
    ];
    // check if there is room in that project for user
    if (projectRoleData.names.length < project[projectRole]) {
      // Add user to project's data on DB
      await projectRef.set(
        {
          project: {
            availableRoles: {
              [projectRole]: {
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
      const userRef = db.collection("students").doc(user.uid);
      let data = await userRef.set(
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
      setCurrentSelectedProject(project.title);
      setCurrentSelectedProjectUid(project.uid);
      //showStudents()
    } else {
      alert(
        `SORRY NO MORE ${projectRole}S SLOTS LEFT. PICK ANOTHER PROJECT PLEASE!`
      );
    }
    setLoading(false);
  };

  const handleAddRole = async roleToAdd => {
    //console.log(roleToAdd);
    //console.log(projectModalData.uid)
    //console.log(currentBuildWeekURL)
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

  return (
    <div
      className={styles.modalContainer}
      onClick={() => setProjectModalData(null)}
    >
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <div className={styles.modalTitle}>
          <h3>{projectModalData.title}</h3>
        </div>
        <div className={styles.modalMainBody}>
          <p>{projectModalData.pitch}</p>
          <p>{projectModalData.mvp}</p>
          <p>{projectModalData.stretch}</p>
        </div>
        <div className={styles.modalTeamMembers}>
          <h3>Team Members</h3>
          <ul>
            {Object.keys(projectModalData.availableRoles).map(allRoles => {
              return (
                <li key={allRoles}>
                  {allRoles} (max - {projectModalData[allRoles]}){" "}
                  {role !== "student" ? (
                    <FaPlusSquare
                      className={styles.icon}
                      // TODO: Fix handle add role
                      // TODO: Add loading state for adding roles
                      onClick={() => handleAddRole(allRoles)}
                    />
                  ) : null}
                  {projectModalData.availableRoles[allRoles].names.map(r => {
                    return (
                      <>
                        {/*ADD FUNCTION TO REMOVE STUDENT FROM PROJECT*/}
                        {role !== "student" ? (
                          <Button color="red" animated="vertical">
                            <Button.Content visible key={r.email}>
                              {r.name}
                            </Button.Content>
                            <Button.Content hidden>
                              <Icon name="remove user" />
                            </Button.Content>
                          </Button>
                        ) : (
                          <p key={r.email}>{r.name}</p>
                        )}
                      </>
                    );
                  })}
                </li>
              );
            })}
          </ul>
        </div>
        <div className={styles.modalSignup}>
          <Button
            color="green"
            onClick={() => handleJoinProject(projectModalData)}
          >
            Sign up
          </Button>
          <Button onClick={() => setProjectModalData(null)} color="red">
            Exit
          </Button>
        </div>
      </div>
    </div>
  );
};

export default StudentProjectViewModal;
