import React, { useEffect,useState } from 'react'
import {csv} from 'd3';
import { Bar} from 'react-chartjs-2';
  const GlobalData=()=>{
  const [globalData,setGlobalData]=useState();
  const [globalCountry,setGlobalCountry]=useState([]);
  const [chartData,setChartData]=useState();
  var [dropDownValue,setDropDownValue]=useState("Afghanistan");
  var [timeSeriesCovidData,setTimeSeriesCovidData]=useState("time_series_covid19_confirmed_global")
  useEffect(()=>{
    var tempCountry="";
    csv(`https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/${timeSeriesCovidData}.csv`)
    .then((data)=>{
      tempCountry=new Set(data.map((value)=>value["Country/Region"]))
        setGlobalData(data);
        setGlobalCountry([...tempCountry])
    })
  },[timeSeriesCovidData])
  let filterData='';
  globalData && globalData.filter((val)=>{
    if(val["Country/Region"]===dropDownValue) {
       filterData = val;
    }
  })  
let header=[];
let confirmed=[];
  for(var property in filterData)
  {
    var date=new Date(property);
    if(!isNaN(date.valueOf())){
      header=[...header,property]
      confirmed=[...confirmed,filterData[property]]
      }
  }
  const chart=()=>{
    setChartData({
          labels: header,
          datasets: [
            {
              label: "Data",
              data: confirmed,
              backgroundColor: [
                'rgb(60, 179, 113)',
              ],
              borderColor: [
                'rgba(60, 179, 113, 1)',
              ],
              borderWidth: 1,
            }
          ]
        });
      }

      useEffect(()=>{
        chart();
      },[dropDownValue])

  return (
    <div>
    <hr/>
    <h1 className="text-primary d-flex justify-content-center">Global Covid Data Graph</h1>
    <hr/>
    <select
    className="mt-3 bg-dark text-white w-25 p-2 d-flex m-auto"
     onChange={(e) => {
          const dropvalue = e.target.value;
          setDropDownValue(dropvalue);
        }}
    >
      {globalCountry && globalCountry.map((data,index)=>{
        return <option value={data} key={index}>{data}</option>
      })}
    </select>
    
    <div className="container position-relative">
    <select
    className="position-absolute right"
    onChange={(e) => {
          const dropvalue = e.target.value;
          setTimeSeriesCovidData(dropvalue)
        }}
    >
    <option value={"time_series_covid19_confirmed_global"} className=" text-dark">Global Confirmed Cases</option>
    <option value={"time_series_covid19_recovered_global"} className=" text-dark">Global Recovered Cases</option>
    <option value={"time_series_covid19_deaths_global"} className=" text-dark">Global Death Cases</option>

    </select>
    <Bar data={chartData} height={30} width={100}/>
   
    </div>
    </div>
  )
      }

export default GlobalData;
