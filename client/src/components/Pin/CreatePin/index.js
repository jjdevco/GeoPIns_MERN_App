import React, { useState } from "react";
import { withStyles } from "@material-ui/core/styles";
import { unstable_useMediaQuery as useMediaQuery } from "@material-ui/core/useMediaQuery";

import ClearButton from "./ClearButton";
import SaveButton from "./SaveButton";

import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import AddAPhotoIcon from "@material-ui/icons/AddAPhotoTwoTone";
import LandscapeIcon from "@material-ui/icons/LandscapeOutlined";

const CreatePin = ({ classes }) => {
  const mobileSize = useMediaQuery("(max-width: 800px)");

  const [title, setTitle] = useState("");
  const [image, setImage] = useState("");
  const [content, setContent] = useState("");

  const clean = () => {
    setTitle("");
    setImage("");
    setContent("");
  };

  return (
    <form className={classes.form}>
      <Typography
        className={classes.alignCenter}
        component="h2"
        variant="h4"
        color="secondary"
      >
        Pin Location
      </Typography>

      <LandscapeIcon className={classes.iconLarge} />

      <div>
        <TextField
          name="title"
          label="Title"
          placeholder="Insert Pin title"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          className={classes.input}
          id="image"
          accept="image/*"
          type="file"
          onChange={(e) => setImage(e.target.files[0])}
        />

        <label htmlFor="image">
          <Button
            className={classes.button}
            style={{ color: image && "green" }}
            component="span"
            size="small"
          >
            <AddAPhotoIcon />
          </Button>
        </label>
      </div>

      <div className={classes.contentField}>
        <TextField
          name="content"
          label="Content"
          variant="outlined"
          rows={mobileSize ? 3 : 6}
          multiline
          fullWidth
          required
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </div>

      <div>
        <ClearButton onClear={clean} />
        <SaveButton
          title={title}
          image={image}
          content={content}
          onClear={clean}
        />
      </div>
    </form>
  );
};

const styles = (theme) => ({
  form: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    paddingBottom: theme.spacing.unit,
  },
  contentField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: "95%",
  },
  input: {
    display: "none",
  },
  alignCenter: {
    display: "flex",
    alignItems: "center",
  },
  iconLarge: {
    fontSize: 40,
    marginRight: theme.spacing.unit,
    color: "green",
  },
  button: {
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2,
    marginRight: theme.spacing.unit,
    marginLeft: 0,
  },
});

export default withStyles(styles)(CreatePin);
