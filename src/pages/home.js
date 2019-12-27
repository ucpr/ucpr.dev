import React from "react";
import { makeStyles } from '@material-ui/core/styles';
import ImageAvatars from "../atoms/icon";

const useStyles = makeStyles(() => ({
  root: {
    justifyContent: "center",
  },
}));

export default function Home() {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <ImageAvatars />
    </div>
  );
}
