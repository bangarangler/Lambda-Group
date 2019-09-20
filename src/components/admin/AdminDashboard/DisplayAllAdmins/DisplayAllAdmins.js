import React, { useState, useEffect, useRef } from "react";
import { db } from "../../../../logic/firebase.js";
import "./DisplayAllAdmins.css";
import { Button, Card } from "semantic-ui-react";

// const DisplayAllAdmins = ({ triggerAdminFunc, setTriggerAdminFunc }) => {
const DisplayAllAdmins = () => {
  const [overlords, setOverlords] = useState([]);
  const refTo_overlords = useRef();
  refTo_overlords.current = overlords;

  const [minions, setMinions] = useState([]);
  const refTo_minions = useRef();
  refTo_minions.current = minions;

  const fetchAdmins = async () => {
    await db.collection("admin").onSnapshot(querySnapshot => {
      let overLordArr = [];
      let minionArr = [];
      let changeType;
      let data = querySnapshot.docChanges().map(change => {
        changeType = change.type;
        return change.doc.data();
      });
      // admin role changed
      if (changeType === "modified") {
        data = data[0];
        if (data.role === "overlord") {
          minionArr = refTo_minions.current.filter(admin => {
            return admin.email !== data.email;
          });
          setOverlords([...refTo_overlords.current, data]);
          setMinions(minionArr);
        } else {
          overLordArr = refTo_overlords.current.filter(admin => {
            return admin.email !== data.email;
          });
          setMinions([...refTo_minions.current, data]);
          setOverlords(overLordArr);
        }
      } else if (changeType === "removed") {
        data.forEach(admin => {
          if (admin.role === "overlord") {
            setOverlords(
              refTo_overlords.current.filter(overlord => {
                return overlord.email !== admin.email;
              })
            );
          } else {
            setMinions(
              refTo_minions.current.filter(minion => {
                return minion.email !== admin.email;
              })
            );
          }
        });

        // map over data of who is current on state and remove them.
      } else {
        // Added data
        data.forEach(admin => {
          if (admin.role === "overlord") {
            overLordArr.push(admin);
          } else {
            minionArr.push(admin);
          }
        });
        setOverlords([...refTo_overlords.current, ...overLordArr]);
        setMinions([...refTo_minions.current, ...minionArr]);
      }
    });
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const removeAdmin = user => {
    db.collection("admin")
      .doc(`${user.email}`)
      .delete()
      .catch(err => {
        console.error(err);
      });
  };

  const updatePermissions = admin => {
    let newRole;
    if (admin.role === "minion") {
      newRole = "overlord";
    } else {
      newRole = "minion";
    }
    db.doc(`admin/${admin.email}`).set(
      {
        role: newRole
      },
      { merge: true }
    );
  };

  return (
    <>
      <h2>Administrators</h2>
      <Card.Group>
        {overlords &&
          overlords.map(o => {
            return (
              <Card key={o.email}>
                <Card.Content>{o.displayName}</Card.Content>
                <Card.Content>
                  <Button.Group>
                    <Button onClick={() => removeAdmin(o)} color="red">
                      Remove
                    </Button>{" "}
                    <Button.Or />
                    <Button onClick={() => updatePermissions(o)} color="blue">
                      Make Team Lead
                    </Button>
                  </Button.Group>
                </Card.Content>
              </Card>
            );
          })}
      </Card.Group>
      <h3>Team Leads</h3>
      <Card.Group>
        {minions &&
          minions.map(m => {
            return (
              <Card key={m.email}>
                <Card.Content>
                  <Card.Header>{m.displayName}</Card.Header>
                </Card.Content>
                <Card.Content>
                  <Button.Group>
                    <Button onClick={() => removeAdmin(m)} color="red">
                      Remove
                    </Button>
                    <Button.Or />
                    <Button onClick={() => updatePermissions(m)} color="blue">
                      Make Admin
                    </Button>
                  </Button.Group>
                </Card.Content>
              </Card>
            );
          })}
      </Card.Group>
    </>
  );
};

export default DisplayAllAdmins;
