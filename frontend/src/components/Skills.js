import React from 'react';
import { Grid } from '@material-ui/core';
import { Surface, Radar, RadarChart, PolarGrid, Legend, Tooltip,
  PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer,
  LabelList, Label } from 'recharts';

const backend = [
  {
    "skill": "Python",
    "level": 4,
    "fullMark": 5,
  },
  {
    "skill": "Golang",
    "level": 3,
    "fullMark": 5,
  },
  {
    "skill": "REST",
    "level": 3,
    "fullMark": 5,
  },
  {
    "skill": "Nginx",
    "level": 2,
    "fullMark": 5,
  },
  {
    "skill": "MySQL",
    "level": 2,
    "fullMark": 5,
  },
];

const frontend = [
  {
    "skill": "HTML",
    "level": 3,
    "fullMark": 5,
  },
  {
    "skill": "CSS",
    "level": 1,
    "fullMark": 5,
  },
  {
    "skill": "JavaScript",
    "level": 2,
    "fullMark": 5,
  },
  {
    "skill": "React",
    "level": 3,
    "fullMark": 5,
  },
  {
    "skill": "jQuery",
    "level": 2,
    "fullMark": 5,
  },
];

function createRadarChart(data) {
  return (
    <RadarChart outerRadius={90} width={730} height={250} data={data}>
    <PolarGrid />
    <PolarAngleAxis dataKey="skill" />
    <PolarRadiusAxis angle={45} domain={[0, 5]} />
    <Radar name="level" dataKey="level" stroke="#8884d8" fill="#8884d8" fillOpacity={0.4} />
    <Legend />
    <Tooltip />
    </RadarChart>
  );
}

export default function Skills() {  
    return (
      <Grid
      container
      direction="column"
      justify="center"
      alignItems="center"
      >
        <Grid item xs={4}>
          {createRadarChart(backend)}
        </Grid>
        <Grid item xs={4}>
          {createRadarChart(frontend)}
        </Grid>
        <Grid item xs={4}>
          {createRadarChart(frontend)}
        </Grid>
      </Grid>
    );
}