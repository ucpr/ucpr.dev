import React from 'react';
import { Grid } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';


const useStyles = makeStyles({

});

const works = [
    "Kosenハッカソン 函館",
    "高専プログラミングコンテスト2017",
    "ParadiseJam 2017+",
    "Web × IoT メイカーズチャレンジ",
    "SecHack365 開発駆動コース 2019/4 ~",
    "Retty summer internship AdTech 2018/09",
    "Cookpad 1day internship コンテナ自作コース 2019/03/20",
    "CyberAgent CA TechJob 2019/09/05 ~ 2019/09/30",
];

export default function Works() {
  const classes = useStyles();

  const worksDoms = works.map((element, index, array) => {  // profileのDomを作る
    return (
      <Typography variant="body1">
        {element}
      </Typography>
    );
  });

  return (
    <Grid 
    container
    direction="column"
    justify="center"
    alignItems="center"
    >
        {worksDoms}
    </Grid>
  );
}