import React, { useContext } from "react";
import { withStyles } from "@material-ui/core/styles";
import { unstable_useMediaQuery as useMediaQuery } from "@material-ui/core/useMediaQuery";

import { Context } from "../state";

import NoContent from "./Pin/NoContent";
import CreatePin from "./Pin/CreatePin";
import PinContent from "./Pin/PinContent";

import { Paper } from "@material-ui/core";

const Blog = ({ classes }) => {
  const mobileSize = useMediaQuery("(max-width: 650px)");

  const {
    state: { draft, currentPin },
  } = useContext(Context);

  return (
    <Paper className={mobileSize ? classes.rootMobile : classes.root}>
      {!draft ? currentPin ? <PinContent /> : <NoContent /> : <CreatePin />}
    </Paper>
  );
};

const styles = {
  root: {
    minWidth: 350,
    maxWidth: 400,
    maxHeight: "calc(100vh - 64px)",
    overflowY: "scroll",
    display: "flex",
    justifyContent: "center",
  },
  rootMobile: {
    maxWidth: "100%",
    maxHeight: 300,
    overflowX: "hidden",
    overflowY: "scroll",
  },
};

export default withStyles(styles)(Blog);
