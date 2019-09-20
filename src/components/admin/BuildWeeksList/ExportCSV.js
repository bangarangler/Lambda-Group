import React, { useContext, useEffect } from "react";
import { CSVLink, CSVDownload } from "react-csv";
import { BuildWeekContext, UserContext } from "../../../context/allContexts";

//headers = [
//{ label: "", key: '' }
//]

const ExportCSV = ({ buildWeek }) => {
  const { fetchBuildWeekProjects, projectsContext } = useContext(
    BuildWeekContext
  );
  const { currentBuildWeekURL } = useContext(UserContext);
  //const exportCSV = () => {
  console.log(projectsContext);
  //fetchBuildWeekProjects(currentBuildWeekURL, projectsContext)
  const data = projectsContext.map(p => {
    function arrNamesToString(arr) {
      let convertedNames = "";
      arr.forEach(n => {
        convertedNames += `name: ${n.name} email: ${n.email}\r`;
      });
      return convertedNames;
    }
    let project = {
      "Project Name": p.project.title.replace(/\"/g, `'`).toString(),
      Pitch: p.project.pitch.replace(/\"/g, `'`).toString(),
      MVP: p.project.mvp.replace(/\"/g, `'`).toString(),
      //"Stretch": p.project.stretch,
      "Design Links / Data Sets": p.project.designLinks_dataSets
        .replace(/\"/g, `'`)
        .toString(),
      "Product Type": p.project.productType.replace(/\"/g, `'`).toString(),
      "iOS Developer": arrNamesToString([
        ...p.project.availableRoles.iosDeveloper.names
      ]),
      "Web UI Developer": arrNamesToString([
        ...p.project.availableRoles.webUiDeveloper.names
      ]),
      "Front End Developer": arrNamesToString([
        ...p.project.availableRoles.frontEndDeveloper.names
      ]),
      "Front End Framework Developer": arrNamesToString([
        ...p.project.availableRoles.frontEndFrameWorkDeveloper.names
      ]),
      "Web Backend Developer": arrNamesToString([
        ...p.project.availableRoles.webBackEndDeveloper.names
      ]),
      "UX Designer": arrNamesToString([
        ...p.project.availableRoles.uXDesigner.names
      ]),
      "Project Lead": arrNamesToString([
        ...p.project.availableRoles.projectLead.names
      ]),
      "Android Developer": arrNamesToString([
        ...p.project.availableRoles.androidDeveloper.names
      ]),
      "Data Engineer": arrNamesToString([
        ...p.project.availableRoles.dataEngineer.names
      ]),
      "Machine Learning Engineer": arrNamesToString([
        ...p.project.availableRoles.machineLearningEngineer.names
      ])
    };
    return project;
  });
  //const data = projectsContext.map(p => {
  //return [`${p.project.title},${p.project.pitch},${p.project.mvp},${p.project.stretch},${p.project.designLinks_dataSets},${p.project.productType}`
  //]})

  //};

  return (
    <CSVLink
      style={{
        position: "fixed",
        bottom: "10px",
        right: "10px",
        zIndex: "100"
      }}
      className="ui button primary"
      data={data}
      //onClick={() => exportCSV()}
      filename={`${currentBuildWeekURL}.csv`}
      //headers={}
      color="blue"
      target="_blank"
    >
      Export CSV
    </CSVLink>
  );
};

//useEffect(() => {
//fetchBuildWeeks()
//})

export default ExportCSV;
