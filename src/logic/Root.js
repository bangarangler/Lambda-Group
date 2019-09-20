import React, { useEffect, useContext } from "react";
import { Switch, Route } from "react-router-dom";
import firebase, { db } from "../logic/firebase";
import { withRouter } from "react-router-dom";
import { UserContext } from "../context/allContexts";
import StudentDashBoard from "../components/students/StudentDashBoard/StudentDashBoard.js";
import Login from "../components/Auth/Login";
import Register from "../components/Auth/Register.js";
import OverLoardMainDashboard from "../components/admin/AdminDashboard/OverloardMainDashBoard.js";
import AdminDashboard from "../components/admin/AdminDashboard/AdminDashboard.js";
import StudentBuildWeekView from "../components/students/StudentDashBoard/StudentBuildWeekView";
import { ToastContainer, toast, Flip } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import styles from "./root.module.scss";

const Root = props => {
  const {
    setUser,
    setEmail,
    role,
    setRole,
    setCurrentBuildWeekURL,
    setUserBuildWeeks
  } = useContext(UserContext);

  function formatLinksName(item) {
    // ALTERNATIVE OPTION BUT WORSE ON PERFORMANCE
    //retun item.split('/').pop(-1);
    return item.toString().match(/\/([^\/]+)\/?$/)[1];
    //   \/ match a slash
    //   (  start of a captured group within the match
    //   [^\/] match a non-slash character
    //   + match one of more of the non-slash characters
    //   )  end of the captured group
    //   \/? allow one optional / at the end of the string
    //   $  match to the end of the string
  }

  useEffect(() => {
    // In case of student clicking on URL from Overlord, this will grab the build week they are accessing
    // and place it in UserContext so that it can be pushed to after they log in
    let buildWeek = `${props.history.location.pathname}`;
    if (buildWeek !== "/") {
      buildWeek = formatLinksName(buildWeek);
    }
    let listOfBuildWeeks = [];
    db.collection("build_weeks")
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          listOfBuildWeeks.push(doc.data().buildWeekName);
        });
        const result = listOfBuildWeeks.filter(item => {
          return item === buildWeek;
        });
        setCurrentBuildWeekURL(result[0]);
      });

    // Checks if student is already logged in
    const unsubscribe = firebase.auth().onAuthStateChanged(user => {
      // If it's a build week (matches one in the DB)
      // add to UserContext
      // Go to Build week in User Context
      console.log("onAuthStateChanged: ", user);
      if (user) {
        checkIfAdmin(user.email);
        const { displayName, uid } = user;
        setUser({ displayName, uid });
      } else {
        props.history.push("/");
      }
    });
    return () => unsubscribe();
  }, []);

  const checkIfAdmin = async userEmail => {
    let adminList = [];
    await db
      .collection("admin")
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          adminList.push({ email: doc.data().email, role: doc.data().role });
        });
        let isAdmin = false;
        adminList.forEach(admin => {
          if (admin.email === userEmail) {
            isAdmin = true;
            setEmail(admin.email);
            setRole(admin.role);
            if (admin.role === "minion") {
              // set all user info to context
              fetchUserInfoFromDatabase(admin.email);
            }
            return;
          }
        });
        if (!isAdmin) {
          setEmail(userEmail);
          setRole("student");
          // set all user info to context
          fetchUserInfoFromDatabase(userEmail);
          // set build week
        }
      });
  };

  // STOP THE MADDNESS function (web socket with user info)
  const fetchUserInfoFromDatabase = async userEmail => {
    await db.doc(`students/${userEmail}`).onSnapshot(
      docSnapshot => {
        // Set user's buildweek info to state
        setUserBuildWeeks(docSnapshot.data().buildWeeks);
      },
      err => {
        console.log(`Encountered error: ${err}`);
      }
    );
  };

  return (
    <>
      <ToastContainer
        transition={Flip}
        className={styles.toastContainer}
        toastClassName={styles.toast}
        bodyClassName={styles.toastBody}
        progressClassName={styles.toastProgress}
      />
      <Switch>
        <Route exact path="/" component={Login} />
        <Route exact path="/register" component={Register} />
        {role === "overlord" ? (
          <>
            <Route exact path="/overlord" component={OverLoardMainDashboard} />
            <Route exact path="/admin/:buildWeek" component={AdminDashboard} />
          </>
        ) : null}
        {role !== "overlord" ? (
          <>
            <Route
              exact
              path="/student/dashboard"
              component={StudentDashBoard}
            />
            <Route
              exact
              path="/student/buildweek/:buildWeek"
              component={StudentBuildWeekView}
            />
          </>
        ) : null}
      </Switch>
    </>
  );
};

export default withRouter(Root);
