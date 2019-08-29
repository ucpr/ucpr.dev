import React from 'react';
import { Grid } from '@material-ui/core';
import {
    BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  } from 'recharts';


const skills = [
    {
      name: "Python3", level: 8,
    },
    {
      name: "Go", level: 4,
    },
    {
      name: "Linux", level: 5,
    },
    {
      name: "Docker", level: 5,
    },
    {
      name: "React", level: 3,
    },
    {
      name: "Nim", level: 5,
    },
  ];

export default function Skills() {
    const jsfiddleUrl = 'https://jsfiddle.net/alidingling/30763kr7/';
  
      return (
        <Grid
        container
        direction="column"
        justify="center"
        alignItems="center"
        >
        <BarChart
          width={500}
          height={300}
          data={skills}
          margin={{
            top: 5, right: 30, left: 20, bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis ticks={[0, 2, 4, 6, 8, 10]} />
          <Tooltip />
          <Legend />
          <Bar dataKey="level" fill="#82ca9d" />
        </BarChart>
        </Grid>
        );
}