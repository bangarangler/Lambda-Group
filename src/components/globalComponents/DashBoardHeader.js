import React, { useContext } from "react";
import { Button, Icon, Header } from "semantic-ui-react";
import firebase from "../../logic/firebase.js";
import { UserContext } from "../../context/allContexts";
import { withRouter } from "react-router-dom";
import Spinner from "../globalComponents/Spinner/Spinner.js";

const DashBoardHeader = props => {
  const {
    setUser,
    setPassword,
    setRole,
    setCurrentBuildWeekURL,
    loading
  } = useContext(UserContext);

  const signOut = () => {
    setRole(null);
    setUser(null);
    setPassword("");
    setCurrentBuildWeekURL(null);
    firebase.auth().signOut();
    props.history.push("/");
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        backgroundColor: "#ba112e",
        marginBottom: "40px"
      }}
    >
      {loading && <Spinner />}
      <Header as="h1" inverted style={{ marginTop: "25px" }}>
        {/* <Icon color="white" name="chevron up"/> */}
        <Icon name="chevron up" style={{ color: "white" }} />
        Lambda Group Organizer
      </Header>
      <Button
        inverted
        size="mini"
        onClick={signOut}
        style={{ marginLeft: "1%", alignSelf: "center", color: "white" }}
      >
        <i className="icon sign-out" />
        Logout
      </Button>
    </div>
  );
};

export default withRouter(DashBoardHeader);
