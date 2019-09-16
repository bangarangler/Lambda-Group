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
import "../../../Dashboard/Dashboard.css";
import ProjectViewModal from "../../globalComponents/ProjectViewModal/ProjectViewModal";
 import MapLegend from "../../../components/students/StudentDashBoard/StudentProjectView/MapLegend/MapLegend.js";

const StudentBuildWeekView = props => {
  // state from context
  const { email, currentBuildWeekURL, user } = useContext(UserContext);

  const { projectsContext, fetchBuildWeekProjects } = useContext(
    BuildWeekContext
  );
  const [filteredProjects, setFilteredProjects] = useState([]);
  // Local state
  const [projectModalData, setProjectModalData] = useState(null);

  const fetchProjects = async () => {
    const { buildWeek } = props.match.params;
    fetchBuildWeekProjects(buildWeek, projectsContext);
  };

  const getStudentRole = async () => {
    console.log("EMAIL: ", email);
    const userRef = db.collection("students").doc(email);
    let data = await userRef.get();
    console.log(data.data());
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
      ["project.title", "project.description", "project.productType"],
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
      <div className="displayContainer">
        <LoginAnimation />
        <div>
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
      </div>
      <MapLegend />
      <Card.Group>
        {filteredProjects &&
          filteredProjects.map(project => {
            return (
              <div key={project.project.uid}>
                <StudentProjectView
                  project={project}
                  setProjectModalData={setProjectModalData}
                />
              </div>
            );
          })}
      </Card.Group>
    </div>
  );
};

export default withRouter(StudentBuildWeekView);
