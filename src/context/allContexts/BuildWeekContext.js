import React, { useState, createContext, useRef } from "react";
import { db } from "../../logic/firebase";

export const BuildWeekContext = createContext();

export function BuildWeekProvider(props) {
  const [projectsContext, setProjectsContext] = useState([]);
  const refTo_ProjContext = useRef();
  refTo_ProjContext.current = projectsContext;

  const fetchBuildWeekProjects = async (buildWeek, projectsContext) => {
    let changeType = "";
    let collection = await db
      .collection("build_weeks")
      .doc(`${buildWeek}`)
      .collection("projects");
    await collection.onSnapshot(querySnapshot => {
      let data = querySnapshot.docChanges().map(change => {
        changeType = change.type;
        return change.doc.data();
      });
      if (changeType === "modified") {
        const updatedProj = [...refTo_ProjContext.current];
        let newProjects = updatedProj.map(tempProject => {
          if (data[0].project.uid === tempProject.project.uid) {
            return data[0];
          } else {
            return tempProject;
          }
        });
        setProjectsContext(newProjects);
        return null;
      } else {
        setProjectsContext(data);
        return null;
      }
    });
  };

  return (
    <BuildWeekContext.Provider
      value={{
        projectsContext,
        setProjectsContext,
        fetchBuildWeekProjects
      }}
    >
      {props.children}
    </BuildWeekContext.Provider>
  );
}
