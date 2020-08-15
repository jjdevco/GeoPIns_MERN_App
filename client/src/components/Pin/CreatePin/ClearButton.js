import React, { useContext } from "react";
import { withStyles } from "@material-ui/core/styles";

import ClearIcon from "@material-ui/icons/Clear";

import { Context } from "../../../state";
import { CLEAR_DRAFT } from "../../../state/types";

import Button from "@material-ui/core/Button";

const ClearButton = ({ onClear, classes }) => {
  const { dispatch } = useContext(Context);

  const handleClearDraft = () => {
    onClear();
    dispatch({ type: CLEAR_DRAFT });
  };

  return (
    <Button
      className={classes.button}
      variant="contained"
      color="primary"
      onClick={handleClearDraft}
    >
      <ClearIcon className={classes.leftIcon} />
      Discard
    </Button>
  );
};

const styles = (theme) => ({
  leftIcon: {
    fontSize: 20,
    marginRight: theme.spacing.unit,
  },
  button: {
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2,
    marginRight: theme.spacing.unit,
    marginLeft: 0,
  },
});

export default withStyles(styles)(ClearButton);
