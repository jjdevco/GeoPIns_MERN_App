import React, { useState, useContext } from "react";
import { withStyles } from "@material-ui/core";

import { Context } from "../../state";

import GraphqlClient from "../../graphql/client";
import { CREATE_COMMENT_MUTATION } from "../../graphql/mutations";

import InputBase from "@material-ui/core/InputBase";
import IconButton from "@material-ui/core/IconButton";
import ClearIcon from "@material-ui/icons/Clear";
import SendIcon from "@material-ui/icons/Send";
import Divider from "@material-ui/core/Divider";
import CircularProgress from "@material-ui/core/CircularProgress";

const CreateComment = ({ classes }) => {
  const {
    state: {
      currentPin: { _id },
    },
  } = useContext(Context);

  const [comment, setComment] = useState("");
  const [saving, setSaving] = useState(false);

  const handleCreateComment = async () => {
    setSaving(true);
    try {
      const client = GraphqlClient();
      const variables = { pinId: _id, text: comment };
      await client.request(CREATE_COMMENT_MUTATION, variables);
      setComment("");
      setSaving(false);
    } catch (err) {
      setSaving(false);
      console.error(err);
    }
  };

  return (
    <>
      <Divider />
      <form className={classes.form}>
        <IconButton
          className={classes.clearButton}
          disabled={!comment.trim() || saving}
          onClick={() => setComment("")}
        >
          <ClearIcon />
        </IconButton>

        <InputBase
          className={classes.input}
          value={comment}
          onChange={({ target: { value } }) => setComment(value)}
          placeholder="Add Comment"
          multiline
        />

        <IconButton
          className={classes.sendButton}
          disabled={!comment.trim() || saving}
          onClick={handleCreateComment}
        >
          {!saving ? <SendIcon /> : <CircularProgress size={22} />}
        </IconButton>
      </form>
      <Divider />
    </>
  );
};

const styles = (theme) => ({
  form: {
    display: "flex",
    alignItems: "center",
  },
  input: {
    marginLeft: 8,
    flex: 1,
  },
  clearButton: {
    padding: 0,
    color: "red",
  },
  sendButton: {
    padding: 0,
    color: theme.palette.secondary.dark,
  },
});

export default withStyles(styles)(CreateComment);
