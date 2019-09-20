// import React, { useState, useContext } from "react";
// import { Statistic, Segment } from "semantic-ui-react";
// import "./DisplayInfo.css";
// import CSVReader from "react-csv-reader";

// const StatisticExampleValueShorthand = ({handleForce, projects}) => {
//     const [tempProjects, setTempProjects] = useState([]);

//     return (
//         <div>
//             <Segment className="DisplayInfo">
//                 <h3>Project Data</h3>
//                 <Statistic.Group tex size="small">
//                     <Statistic label="Projects" value={projects.length} />
//                     <Statistic label="Students" value="600" />
//                 </Statistic.Group>
//             </Segment>
//             <CSVReader
//                 cssClass="csv-reader-input"
//                 label="Select CSV with projects"
//                 onFileLoaded={handleForce}
//                 inputId="ObiWan"
//                 inputStyle={{ color: "red" }}
//             />
//         </div>
//     );
// };

// export default StatisticExampleValueShorthand;

import React, {useState, useContext, useEffect} from 'react';
import {Statistic, Segment, Button} from 'semantic-ui-react';
import UserContext from '../context/UserContext';
// import CurrentProjectContext from "../../context/CurrentProjectContext";
import {db} from '../logic/firebase';
import './DisplayInfo.css';
import CSVReader from 'react-csv-reader';

const StatisticExampleValueShorthand = ({handleForce, user}) => {
  const {tempProjects} = useContext(UserContext);
  const [projects, setProjects] = useState([]);

  const [tempUsers, setTempUsers] = useState([]);

  const deleteCollection = () => {
    let projectRef = db.collection('projects');

    projectRef
      .get()
      .then(snapshot => {
        let count = 1;

        snapshot.forEach(doc => {
          // console.log(doc.data().newProject.uid);

          console.log(doc, `count: ${count++}`);
            console.log(doc.data().newProject, `count: ${count++}`);

          db.collection('projects')

            .doc(doc.data().newProject.uid)

            .delete();
        });
      })

      .catch(err => {
        console.log('Error getting documents', err);
      });

    setProjects([]);
  };

  const getUsers = () => {
    const tempUserData = [];

    let citiesRef = db.collection('students');

    citiesRef
      .get()
      .then(snapshot => {
        if (snapshot.empty) {
          //console.log('No matching documents.');

          return;
        }

        snapshot.forEach(doc => {
          // console.log(doc.id, '=>', doc.data());

          tempUserData.push(doc.data());
        });

        //   console.log(tempUserData, "from snap");
      })

      .catch(err => {
        console.log('Error getting documents', err);
      });

    setTempUsers(tempUserData);
  };

  const getProjects = () => {
    const tempProjectData = [];

    let citiesRef = db.collection('projects');

    citiesRef
      .get()
      .then(snapshot => {
        if (snapshot.empty) {
          console.log('No matching documents.');

          return;
        }

        snapshot.forEach(doc => {
          // console.log(doc.id, '=>', doc.data());

          tempProjectData.push(doc.data());
        });

        //   console.log(tempUserData, "from snap");
      })

      .catch(err => {
        console.log('Error getting documents', err);
      });

    setProjects(tempProjectData);
  };

  useEffect(() => {
    getUsers();
  }, [user]);

  useEffect(() => {
    getProjects();
  }, [tempProjects]);

  return (
    <div>
      {!user && tempUsers ? (
        <div>
          <Segment className="DisplayInfo">
            <h3>Project Data</h3>

            <Statistic.Group size="small">
              {/* <Statistic.Group tex size="small"> */}

              <Statistic label="Projects" value={projects.length} />

              <Statistic label="Students" value={tempUsers.length} />
            </Statistic.Group>

            <Button
              color="black"
              size="mini"
              basic
              onClick={deleteCollection}
              style={{
                marginLeft: '1%',

                alignSelf: 'center',

                marginTop: '5px',
              }}>
              <i className="icon delete" />
              Clear out Projects
            </Button>
          </Segment>

          <CSVReader
            cssClass="csv-reader-input"
            label="Select CSV with projects"
            onFileLoaded={handleForce}
            inputId="ObiWan"
            inputStyle={{color: 'red'}}
          />
        </div>
      ) : (
        <h1>Student View</h1>
      )}
    </div>
  );
};

export default StatisticExampleValueShorthand;
