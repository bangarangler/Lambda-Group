import React, {useState, useEffect} from 'react';
import {db} from '../../../logic/firebase.js';

const DisplayAllAdmins = ({triggerAdminFunc}) => {
  const [overlords, setOverlords] = useState([]);
  const [minions, setMinions] = useState([]);

  const fetchAdmins = async () => {
    let overLoardArr = [];
    let minionArr = [];
    await db
      .collection('admin')
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          const adminData = {
            name: doc.data().displayName,
            email: doc.data().email,
            role: doc.data().role,
          };
          if (adminData.role === 'overlord') {
            overLoardArr.push(adminData);
          } else {
            minionArr.push(adminData);
          }
          setOverlords(overLoardArr);
          setMinions(minionArr);
        });
      });
  };

  useEffect(() => {
    fetchAdmins();
  }, [triggerAdminFunc]);

  return (
    <>
      {overlords &&
        overlords.map(o => {
          return (
            <div className="overlords-container">
              <p key={o.email}>{o.name}</p>
            </div>
          );
        })}
      {minions &&
        minions.map(m => {
          return (
            <div className="minions-container">
              <p key={m.email}>{m.name}</p>
            </div>
          );
        })}
    </>
  );
};

export default DisplayAllAdmins;
