import React, { useContext } from "react";
import { Card, Button, Header } from "semantic-ui-react";
import { UserContext } from "../../../../context/allContexts";
import { db } from "../../../../logic/firebase";
import projectRoleOptions, {
  findProjectRoleOption
} from "../../../../utils/projectRoleOptions";
import { toast } from "react-toastify";

import styles from "./StudentProjectView.module.scss";

const StudentProjectView = ({ project: { project }, setProjectModalData }) => {
  const {
    user,
    email,
    currentBuildWeekURL,
    userBuildWeeks,
    setLoading
  } = useContext(UserContext);

  const handleJoinProject = async (project, e) => {
    e.stopPropagation();
    setLoading(true);
    if (
      userBuildWeeks[currentBuildWeekURL] &&
      userBuildWeeks[currentBuildWeekURL].project !== ""
    ) {
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
        `Sorry no more ${userBuildWeeks[currentBuildWeekURL].projectRole}s slots left.  Please pick another project.`
      );
    }
    setLoading(false);
  };

  let allowJoin =
    project.availableRoles[userBuildWeeks[currentBuildWeekURL].projectRole]
      .names.length >= project[userBuildWeeks[currentBuildWeekURL].projectRole];

  return (
    <Card
      key={project.uid}
      raised={true}
      centered={true}
      onClick={() => setProjectModalData(project)}
    >
      <Card.Content
        className={styles.cardHeader}
        style={{ backgroundColor: "#ba112e", color: "white" }}
      >
        <Header as="h3" style={{ color: "white" }}>
          {project.title.length > 25
            ? project.title.slice(0, 25) + "..."
            : project.title}
        </Header>
      </Card.Content>
      <Card.Content style={{ color: "#323232" }}>
        {project.pitch.length > 200
          ? project.pitch.slice(0, 200) + "..."
          : project.pitch}
      </Card.Content>
      <Card.Content className={styles.team}>
        Team:
        <div className={styles.dotContainer}>
          {Object.keys(project.availableRoles).map(projectRole => {
            return project.availableRoles[projectRole].names.map(student => {
              return (
                <div
                  key={student.email}
                  className={styles.teamMemberDiv}
                  style={{
                    backgroundColor: `${
                      findProjectRoleOption(projectRole)[0].bgColor
                    }`
                  }}
                >
                  <span className={styles.span} key={student.email}>
                    {/* TODO: Fix to be dots with two initials */}
                    {student.name[0]}
                  </span>
                </div>
              );
            });
          })}
        </div>
      </Card.Content>
      {userBuildWeeks[currentBuildWeekURL].project !== project.title && (
        <Card.Content
          extra
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}
        >
          <p className={styles.productType}>{project.productType}</p>

          {allowJoin ? (
            <Button
              disabled
              id={StyleSheetList.joinButton}
              onClick={e => handleJoinProject(project, e)}
            >
              +Join
            </Button>
          ) : (
            <Button
              positive
              id={StyleSheetList.joinButton}
              onClick={e => handleJoinProject(project, e)}
            >
              +Join
            </Button>
          )}
        </Card.Content>
      )}
      {userBuildWeeks[currentBuildWeekURL].project === project.title && (
        <Card.Content
          style={{
            backgroundColor: "rgb(32, 185, 68)",
            color: "white",
            flexGrow: "0"
          }}
        >
          Signed up!
        </Card.Content>
      )}
    </Card>
  );
};

export default StudentProjectView;
