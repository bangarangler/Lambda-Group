import React, {useContext, useEffect} from 'react';
import {Card, Button, Header, Icon} from 'semantic-ui-react';
import {UserContext, SpinnerContext} from '../../../../context/allContexts';
import {db} from '../../../../logic/firebase';

import './StudentProjectView.module.scss';

const StudentProjectView = ({project: {project}}) => {
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
  } = useContext(UserContext);

  const { loading, setLoading, showSpinner } = useContext(SpinnerContext)

  const handleJoinProject = async project => {
    setLoading(true)
    // reference project in DB
    const projectRef = db
      .collection('build_weeks')
      .doc(currentBuildWeekURL)
      .collection('projects')
      .doc(project.uid);
    // Get the data for the user's desired role that project from DB
    const projectData = await projectRef.get();
    let projectRoleData = await projectData.data().project.availableRoles[
      projectRole
    ];
    console.log(projectRoleData);
    // check if there is room in that project for user
    if (projectRoleData.names.length < project[projectRole]) {
      console.log(projectRoleData.names);
      // Add user to project's data on DB
      await projectRef.set(
        {
          project: {
            availableRoles: {
              [projectRole]: {
                names: [...projectRoleData.names, user.displayName],
              },
            },
          },
        },
        {merge: true},
      );

      // Add project to user's data on DB
      const userRef = db.collection('students').doc(user.uid);
      let data = await userRef.set(
        {buildWeeks: {[currentBuildWeekURL]: {project: project.title}}},
        {merge: true},
      );
      setCurrentSelectedProject(project.title);
      setLoading(false)
    } else {
      alert(
        `SORRY NO MORE ${projectRole}S SLOTS LEFT. PICK ANOTHER PROJECT PLEASE!`,
      );
    }
    // const projectData = await projectRef.set({availableRoles: {[projectRole]: {names: []}}}, {merge: true})
    // data = data.data(); "Frontend Developer"
    setLoading(false)
  };

  useEffect(() => {
    showSpinner(loading)
  }, [loading])

  return (
    <Card key={project.uid} raised={true} centered={true}>
      <Card.Content
        header={
          project.title.length > 25
            ? project.title.slice(0, 25) + '...'
            : project.title
        }
        className="cardHeader"
      />
      <Card.Content>
        {project.description.length > 200
          ? project.description.slice(0, 200) + '...'
          : project.description}
      </Card.Content>
      {currentSelectedProject !== project.title && (
        <Card.Content>
          {project.productType}{' '}
          <Button onClick={() => handleJoinProject(project)}>+Join</Button>
        </Card.Content>
      )}
    {loading && showSpinner(loading)}
      {currentSelectedProject === project.title && (
        <Card.Content style={{backgroundColor: 'green', color: 'white'}}>
          Signed up!
        </Card.Content>
      )}

      {/* <p>{project.androidDeveloper}</p>
      <p>{project.dataEngineer}</p>
      <p>{project.frontEndDeveloper}</p>
      <p>{project.FrontEndFrameWorkDeveloper}</p>
      <p>{project.machineLearningEngineer}</p>
      <p>{project.projectLead}</p>
      <p>{project.uXDesigner}</p>
      <p>Team members . map</p>
      <p>{project.webBackEndDeveloper}</p>
      <p>{project.WebUiDeveloper}</p> */}
    </Card>
  );
};

export default StudentProjectView;
