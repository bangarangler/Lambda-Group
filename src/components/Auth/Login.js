import React, { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../../context/allContexts";
import firebase from "../../logic/firebase";
import "./Login.css";
import { appName, appIconName } from "../../logic/constants";
import {
  Form,
  Button,
  Icon,
  Header,
  Segment,
  Message
} from "semantic-ui-react";
import LoginAnimation from "./LoginAnimation";
import { db } from "../../logic/firebase.js";
import { toast } from "react-toastify";

const Login = ({ history }) => {
  const {
    setUser,
    email,
    setEmail,
    password,
    setPassword,
    role,
    setRole
  } = useContext(UserContext);

  const login = event => {
    event.preventDefault();
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(loggedInuser => {
        setUser({
          displayName: loggedInuser.user.displayName,
          uid: loggedInuser.user.uid,
          role: role
        });
        checkIfAdmin(loggedInuser.user.email);
      })
      .catch(err => {
        toast("Please enter a valid username and password");
      });
  };
  // CHECK IF USER IS ADMIN
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
            return;
          }
        });
        if (!isAdmin) {
          setRole("student");
        }
      });
    setPassword("");
  };

  useEffect(() => {
    if (role === "overlord") {
      history.push("/overlord");
    } else if (role === "minion") {
      history.push("/student/dashboard");
    } else if (role === "student") {
      // Push to student's pick a build week associated with context
      // else push to /student/dashboard to pick a build week
      history.push(`/student/dashboard`);
    } else {
      history.push("/");
    }
  }, [role]);

  return (
    <div className="Login">
      <LoginAnimation />
      <Segment stacked>
        <Header as="h2">
          <Icon color="red" name={appIconName} />
          {appName}
        </Header>
        <Form onSubmit={e => login(e)}>
          <Form.Input
            icon="mail"
            type="email"
            value={email}
            iconPosition="left"
            placeholder="E-mail address"
            onChange={event => setEmail(event.target.value)}
          />

          <Form.Input
            icon="lock"
            value={password}
            iconPosition="left"
            placeholder="Password"
            type="password"
            onChange={event => setPassword(event.target.value)}
          />

          <Button size="large" fluid color="red" type="submit">
            Login
          </Button>
        </Form>
        <Message id="loginMessage">
          Don't have an account? <Link to="/register">Register</Link>
        </Message>
      </Segment>
    </div>
  );
};

export default Login;
