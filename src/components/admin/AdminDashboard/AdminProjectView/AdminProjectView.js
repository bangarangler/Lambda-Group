import React from "react";
import { Card, Header } from "semantic-ui-react";

import styles from "../../../students/StudentDashBoard/StudentProjectView/StudentProjectView.module.scss";
import dotStyles from "./AdminProjectView.module.scss";

import projectRoleOptions, {
  findProjectRoleOption
} from "../../../../utils/projectRoleOptions";

const AdminProjectView = ({ project: { project }, setProjectModalData }) => {
  return (
    <Card
      key={project.uid}
      raised={true}
      centered={true}
      onClick={() => setProjectModalData(project)}
    >
      <Card.Content style={{ backgroundColor: "#ba112e", color: "white" }}>
        <Header
          as="h3"
          className={styles.cardHeader}
          style={{ color: "white" }}
        >
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
      <Card.Content>
        {/* TODO: CHANGE TO DOTS WITH FIRST AND LAST INITIAL*/}
        Team:
        <div className={dotStyles.dotContainer}>
          {Object.keys(project.availableRoles).map(projectRole => {
            return project.availableRoles[projectRole].names.map(student => {
              return (
                <div
                  key={student.email}
                  className={dotStyles.teamMemberDiv}
                  style={{
                    backgroundColor: `${
                      findProjectRoleOption(projectRole)[0].bgColor
                    }`
                  }}
                >
                  <span className={dotStyles.span} key={student.email}>
                    {/* TODO: Fix to be dots with two initials */}
                    {student.name[0]}
                  </span>
                </div>
              );
            });
          })}
        </div>
      </Card.Content>
    </Card>
  );
};

export default AdminProjectView;
