import React, { useState, useContext } from "react";
import axios from "axios";
import { withStyles } from "@material-ui/core/styles";

import { Context } from "../../../state";
import { CREATE_PIN, CLEAR_DRAFT } from "../../../state/types";

import GrahpqlClient from "../../../graphql/client";
import { CREATE_PIN_MUTATION } from "../../../graphql/mutations";

import Button from "@material-ui/core/Button";
import SaveIcon from "@material-ui/icons/SaveTwoTone";
import CircularProgress from "@material-ui/core/CircularProgress";

const SaveButton = ({ title, image, content, onClear, classes }) => {
  const { state, dispatch } = useContext(Context);
  const { draft } = state;

  const [saving, setSaving] = useState(false);
  const disabled = !title.trim() || !content.trim() || saving;

  const handleImageUpload = async () => {
    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", "geopins");
    data.append("cloud_name", "jjdevco");

    const res = await axios.post(
      "https://api.cloudinary.com/v1_1/jjdevco/image/upload",
      data
    );

    return res.data.url;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      let url;

      if (image) {
        url = await handleImageUpload();
      }
      const client = GrahpqlClient();
      const variables = { title, image: url ? url : null, content, ...draft };

      const { createPin } = await client.request(
        CREATE_PIN_MUTATION,
        variables
      );

      setSaving(false);

      dispatch({
        type: CREATE_PIN,
        payload: createPin,
      });
      dispatch({ type: CLEAR_DRAFT });

      onClear();
    } catch (err) {
      setSaving(false);
      console.error(err);
    }
  };

  return (
    <Button
      className={classes.button}
      type="submit"
      variant="contained"
      color="secondary"
      disabled={disabled}
      onClick={handleSubmit}
    >
      {saving ? (
        <CircularProgress size={24} />
      ) : (
        <>
          Submit
          <SaveIcon className={classes.rightIcon} />
        </>
      )}
    </Button>
  );
};

const styles = (theme) => ({
  rightIcon: {
    fontSize: 20,
    marginLeft: theme.spacing.unit,
  },
  button: {
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2,
    marginRight: theme.spacing.unit,
    marginLeft: 0,
  },
});

export default withStyles(styles)(SaveButton);
