import React, { useContext, useState } from "react";
import UserContext from "../../context/UserContext";
import firebase from "../../logic/firebase";
import "./Login.css";
import { appName, appIconName } from "../../logic/constants";
import {
    Form,
    Button,
    Icon,
    Header,
    Segment,
    Message,
    Label
} from "semantic-ui-react";
import { Link } from "react-router-dom";
import LoginAnimation from "./LoginAnimation";

const Login = ({ history }) => {
    const { setUser, user } = useContext(UserContext);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const login = event => {
        event.preventDefault();

        firebase
            .auth()
            .signInWithEmailAndPassword(email, password)
            .then(loggedInuser => {
                console.log(loggedInuser.user);
                setUser({
                    displayName: loggedInuser.user.displayName,
                    uid: loggedInuser.user.uid,
                    role: user
                });
                console.log(user, "from user role");
                history.push("/");
            })
            .catch(err => console.log(err));
    };

    return (
        <div className="Login">
            <LoginAnimation />
            <Segment stacked>
                <Header as="h2">
                    <Icon color="red" name={appIconName} />
                    {appName}
                </Header>
                <Form onSubmit={login}>
                    {/* <Label color="red" pointing="below">
                        Enter your email
                    </Label> */}
                    <Form.Input
                        icon="mail"
                        type="email"
                        value={email}
                        iconPosition="left"
                        placeholder="E-mail address"
                        onChange={event => setEmail(event.target.value)}
                    />
                    {/* <Label color='red' pointing="below">Enter your password</Label> */}
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
            </Segment>
            <Message>
                New to us? <Link to="/Register">Register</Link>
            </Message>
        </div>
    );
};

export default Login;
