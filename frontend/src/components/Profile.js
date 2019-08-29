import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import { Grid } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';


const useStyles = makeStyles({
  Avatar: {
    margin: 20,
    width: 250,
    height: 250,
    marginLeft: "auto",
  },
});

const profile = {
  "Name": "taichi uchihara",
  "School": "NIT-OC",
  "Likes": "YouTube, TikTok, Programming",
  "Age": 19,
};

export default function Profile() {
  const classes = useStyles();

  const profileDoms = Object.keys(profile).map((key) => {  // profileのDomを作る
    return (
      <Typography align="left" variant="h5">
        {key}: {profile[key]}
      </Typography>);
  });

  // TODO: Avatar image の src を変更する
  return (
    <Grid container alignItems="center" spacing={3}>
      <Grid item xs={6}>
      <Avatar alt="ucpr" src="https://avatars0.githubusercontent.com/u/17886370?s=400&u=0f24fbcd64c66aca5918035a4ab60bf881a1e813&v=4" className={classes.Avatar} />
      </Grid>
      <Grid item xs={6}>
          {profileDoms}
      </Grid>
    </Grid>
  );
}