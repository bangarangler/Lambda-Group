let style = {
  width: "40px",
  height: "40px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  borderRadius: "500%"
};

const projectRoleOptions = [
  {
    title: "Android Developer",
    selection: "androidDeveloper",
    bgColor: "#64dd17",
    style
  },
  {
    title: "iOS Developer",
    selection: "iosDeveloper",
    bgColor: "#212121",
    style
  },
  {
    title: "Data Engineer",
    selection: "dataEngineer",
    bgColor: "#2962ff",
    style
  },
  {
    title: "Front End Developer",
    selection: "frontEndDeveloper",
    bgColor: "#c51162",
    style
  },
  {
    title: "Front End Frame Work Developer",
    selection: "frontEndFrameWorkDeveloper",
    bgColor: "#d50000",
    style
  },
  {
    title: "Machine Learning Engineer",
    selection: "machineLearningEngineer",
    bgColor: "#455a64",
    style
  },
  {
    title: "Project Lead",
    selection: "projectLead",
    bgColor: "#aa00ff",
    style
  },
  {
    title: "UX Designer",
    selection: "uXDesigner",
    bgColor: "#00b8d4",
    style
  },
  {
    title: "Web Back End Developer",
    selection: "webBackEndDeveloper",
    bgColor: "#ff6d00",
    style
  },
  {
    title: "Web UI Developer",
    selection: "webUiDeveloper",
    bgColor: "#ffd600",
    style
  }
];

export function findProjectRoleOption(role) {
  const selectedRole = projectRoleOptions.filter(item => {
    return item.selection === role;
  });
  return selectedRole;
}

export default projectRoleOptions;
