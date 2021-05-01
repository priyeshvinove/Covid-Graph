import React, { useEffect,useState } from 'react'
import {csv, filter, index, sum} from 'd3';
import Moment from 'moment'
import { Bar, Line } from 'react-chartjs-2';
const GlobalData = React.memo(props=>{
  const [globalData,setGlobalData]=useState();
  const [globalCountry,setGlobalCountry]=useState([]);
  // const [confirmedCount,setConfirmedCount]=useState({});
  // const [year, setYear] = useState([]);
  const [chartData,setChartData]=useState();
  var [dropDownValue,setDropDownValue]=useState("Afghanistan");

  // const [label,setLabel]=useState();
  // const [data,setData]=useState();
  // const [filterData,setFilterData]=useState();
  // var  months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  useEffect(()=>{
    var tempCountry="";
    csv("https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv")
    .then((data)=>{
      tempCountry=new Set(data.map((value)=>value["Country/Region"]))
        setGlobalData(data);
        setGlobalCountry([...tempCountry])
    })
  },[])
  // console.log(globalCountry);
  let filterData='';
  // var sum=0;
  globalData && globalData.filter((val)=>{
    if(val["Country/Region"]===dropDownValue) {
       filterData = val;
      //  setFilterData(val)
      // );
      // setYear(filterData);
    }
  })
  // console.log(filterData);    
  
let header=[];
let confirmed=[];
  for(var property in filterData)
  {

    var date=new Date(property);
   
    if(!isNaN(date.valueOf())){
      header=[...header,property]
      confirmed=[...confirmed,filterData[property]]
        // sumValue=sumValue+filterData[property]*1
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
      // console.log("Global");
  return (
    <div>
    <select
    className="mt-3 bg-dark text-white w-25 p-2 d-flex m-auto"
     onChange={(e) => {
          const dropvalue = e.target.value;
          setDropDownValue(dropvalue,()=>{
          });
        }}
    >
      {globalCountry && globalCountry.map((data,index)=>{
        return <option value={data} key={index}>{data}</option>
      })}
    </select>
    <Bar data={chartData} height={30} width={100}/>
    </div>
  )
})

export default GlobalData;
