// Modules
import React, { useState, useEffect, useContext } from "react";
import { db } from "../../../logic/firebase.js";
import { Card, Form } from "semantic-ui-react";
import { withRouter } from "react-router-dom";
import fuzzySearch from "../../../components/globalComponents/fuzzySearch";
import { UserContext, BuildWeekContext } from "../../../context/allContexts";

// Components
import DashBoardHeader from "../../globalComponents/DashBoardHeader";
import StudentProjectView from "./StudentProjectView/StudentProjectView";
import LoginAnimation from "../../Auth/LoginAnimation";
import styles from "../../globalComponents/ProjectFuzzySearch/ProjectFuzzySearch.module.scss";
import ProjectViewModal from "../../globalComponents/ProjectViewModal/ProjectViewModal";
import MapLegend from "../../globalComponents/MapLegend/MapLegend";

const StudentBuildWeekView = props => {
  // state from context
  const { email, user } = useContext(UserContext);
  const { projectsContext, fetchBuildWeekProjects } = useContext(
    BuildWeekContext
  );

  // Local state
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [projectModalData, setProjectModalData] = useState(null);

  const fetchProjects = async () => {
    const { buildWeek } = props.match.params;
    fetchBuildWeekProjects(buildWeek, projectsContext);
  };

  const getStudentRole = async () => {
    const userRef = db.collection("students").doc(email);
    await userRef.get();
  };

  useEffect((buildWeek, projectsContext) => {
    if (user) {
      fetchProjects(buildWeek, projectsContext);
      getStudentRole();
    } else {
      props.history.push("/");
    }
  }, []);

  useEffect(() => {
    // when projects on the backend update, update all project cards
    setFilteredProjects(projectsContext);

    // update the project modal with new data only if it's open
    if (projectModalData) {
      projectsContext.map(contextProject => {
        if (contextProject.project.uid === projectModalData.uid) {
          setProjectModalData(contextProject.project);
        }
        return null;
      });
    }
  }, [projectsContext]);

  function handleFuzzySearch(e) {
    // Fuzzy search for students involved, title, description, productType(ios, web, etc)
    let searchResults = fuzzySearch(
      projectsContext,
      [
        "project.title",
        "project.description",
        "project.productType",
        "project.availableRoles.androidDeveloper.names.name",
        "project.availableRoles.iosDeveloper.names.name",
        "project.availableRoles.dataEngineer.names.name",
        "project.availableRoles.frontEndDeveloper.names.name",
        "project.availableRoles.frontEndFrameWorkDeveloper.names.name",
        "project.availableRoles.machineLearningEngineer.names.name",
        "project.availableRoles.projectLead.names.name",
        "project.availableRoles.uXDesigner.names.name",
        "project.availableRoles.webBackEndDeveloper.names.name",
        "project.availableRoles.webUiDeveloper.names.name"
      ],
      e
    );
    if (e.target.value === "") {
      setFilteredProjects(projectsContext);
    } else {
      setFilteredProjects(searchResults);
    }
  }

  return (
    <div style={{ textAlign: "center" }}>
      {projectModalData && (
        <ProjectViewModal
          setProjectModalData={setProjectModalData}
          projectModalData={projectModalData}
        />
      )}
      <DashBoardHeader />
      <MapLegend />
      <div className={styles.displayContainer}>
        {/* <LoginAnimation /> */}
        <Form.Input
          type="text"
          onChange={e => handleFuzzySearch(e)}
          focus
          size="big"
          icon="filter"
          iconPosition="left"
          placeholder="Search by Project title, type or student name"
        />
      </div>
      <Card.Group>
        {filteredProjects &&
          filteredProjects.map(project => {
            return (
              <StudentProjectView
                key={project.project.uid}
                project={project}
                setProjectModalData={setProjectModalData}
              />
            );
          })}
      </Card.Group>
    </div>
  );
};

export default withRouter(StudentBuildWeekView);
