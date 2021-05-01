import {React,useState,useEffect} from 'react';
import './App.css';
import {Bar,Line,Doughnut } from 'react-chartjs-2'
import { csv } from "d3";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css'
import Moment from 'moment';
import GlobalData from './Component/GlobalData';
import EveryDayData from './Component/EveryDayData';

function App() {
  return(
    <>
    <EveryDayData/>
    <GlobalData/>
    </>
  )
}

export default App;