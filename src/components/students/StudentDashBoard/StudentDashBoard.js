import React, { useContext } from "react";
import DashBoardHeader from "../../globalComponents/DashBoardHeader.js";
import BuildWeekSelection from "./BuildWeekSelection/BuildWeekSelection.js";
import SelectProjectRole from "../SelectProjectRole/SelectProjectRole.js";
import { UserContext } from "../../../context/allContexts";

const StudentDashBoard = props => {
  const { currentBuildWeekURL } = useContext(UserContext);

  return (
    <>
      <DashBoardHeader />
      {!currentBuildWeekURL && <BuildWeekSelection />}
      {currentBuildWeekURL && <SelectProjectRole />}
    </>
  );
};

export default StudentDashBoard;
