import React, { useState, useRef } from "react";
import { Card, Button } from "semantic-ui-react";
import { db } from "../../../logic/firebase.js";
import { styles } from "ansi-colors";
//import { Z_FIXED } from "zlib";

const CopyLink = props => {
  const [copySuccess, setCopySuccess] = useState(false);
  const textAreaRef = useRef(null);

  async function AddLinkToBuildWeek() {
    db.collection("build_weeks")
      .doc(`${props.buildWeek}`)
      .set(
        {
          studentUrl: `${process.env.REACT_APP_BASE_URL}student/buildweek/${props.buildWeek}`
        },
        { merge: true }
      );
    try {
      const response = () => {
        console.log("Url Added to Firestore!", response);
      };
    } catch (err) {
      console.error(err);
    }
  }

  function copyToClipboard(e) {
    AddLinkToBuildWeek(e);
    textAreaRef.current.select();
    document.execCommand("copy");
    // This is just personal preference.
    // I prefer to not show the the whole text area selected.
    e.target.focus();
    setCopySuccess(true);
    setTimeout(() => {
      setCopySuccess(false);
    }, 1000);
  }

  return (
    <>
      {document.queryCommandSupported("copy") && (
        <Button
          color="blue"
          onClick={copyToClipboard}
          // style={{ borderRadius: "6px" }}
        >
          {copySuccess ? "Copied!" : "Copy URL"}
        </Button>
      )}
      <form style={{ overflow: "hidden", position: "relative" }}>
        <textarea
          style={{
            position: "absolute",
            top: "-1000",
            left: "-1000"
          }}
          ref={textAreaRef}
          value={`${process.env.REACT_APP_BASE_URL}student/buildweek/${props.buildWeek}`}
          readOnly
        />
      </form>
    </>
  );
};

export default CopyLink;
