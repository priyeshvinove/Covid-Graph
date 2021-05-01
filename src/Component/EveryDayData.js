import {React,useState,useEffect} from 'react';
import {Bar} from 'react-chartjs-2'
import { csv } from "d3";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css'
import Moment from 'moment';
import CountUp from "react-countup";

const EveryDayData = () => {
    const [covidData,setCovidData]=useState();
  const [country,setCountry]=useState([]);
  const [chartData,setChartData]=useState({});
  const [stateValue,setStateValue]=useState([]);
  const [dropDownValue,setDropDownValue]=useState("Alabama");
  const [altenatDate,setAlternateDate]=useState(new Date());
  const [hideGraph,setHideGraph]=useState(false);
  const todayDate=new Date('2021-04-05');
    const from = Moment(todayDate).format('MM-DD-YYYY').toString();
  const [selectedDate, setSelectedDate] = useState(from);

  const [stateName,setStateName]=useState();
  const [provinceState,setProvinceState]=useState("");
  useEffect(() => {
    var tempCountry = "";
    csv(
      `https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_daily_reports/${selectedDate.toString()}.csv`
    ).then((data) => {
      setHideGraph(false)
        setCovidData(data);
        tempCountry = new Set(data.map((d) => d.Country_Region));
        setCountry([...tempCountry]);
      })
      .catch((err) => {console.log("Error",{err})
      setHideGraph(true)
      });
  }, [selectedDate]);

  const chart=()=>{
    setChartData({
          labels: ["Confirmed","Death","Active","Recovered"],
          datasets: [
            {
              label: "Data",
              data: stateValue,
            backgroundColor: [
                'rgb(60, 179, 113)',
                'rgb(255, 0, 0)',
                'rgb(255, 165, 0)',
                'rgb(106, 90, 205)'
              ],
              borderColor: [
                'rgba(60, 179, 113, 1)',
                'rgba(255, 0, 0, 1)',
                'rgba(255, 206, 86, 1)',

              ],
              borderWidth: 1,
            }
          ]
        });
  }
  
  useEffect(()=>{
    chart();
  },[stateValue,provinceState])

  useEffect(()=>{
 covidData&& covidData.forEach((val)=>{
    if(val.Country_Region===dropDownValue) {
      let filterData = covidData.filter(
        (data) => data.Country_Region === dropDownValue
      );
        setStateName(filterData);
      setStateValue([parseInt(val.Confirmed),parseInt(val.Deaths),parseInt(val.Active),parseInt(val.Recovered)])
    }
  })
  },[dropDownValue,selectedDate,provinceState])

  useEffect(()=>{
    stateName&& stateName.map((val)=>{
       if(val.Province_State===provinceState){
         setStateValue([parseInt(val.Confirmed),parseInt(val.Deaths),parseInt(val.Active),parseInt(val.Recovered)])
       }
     })
     },[provinceState,dropDownValue,selectedDate])

        // console.log(stateValue[0]);
       console.log(stateValue[0]);

  return (
    <div className="App">
     <h1><span className="text-danger"><u>{dropDownValue}</u></span> Covid Data {altenatDate &&altenatDate.toDateString()}</h1>
      <DatePicker
                    selected={altenatDate}
                    onChange={date => {
                      setSelectedDate(Moment(date).format('MM-DD-YYYY'))
                      setAlternateDate(date)
                    }
                    }
                    dateFormat='MM-dd-yyyy'
                    maxDate={new Date()}
                    className="text-danger"
                />
                <br/>
       <select
       className="mt-3 bg-dark text-white w-25 p-2" 
       onChange={(e) => {
          const dropvalue = e.target.value;
          setDropDownValue(dropvalue,()=>{
          });
        }} >
      {country&& country.map((val,index)=>{
       return(
         <option value={val} key={index}>{val}</option>
       )
      })}
  </select>
      {stateName&&stateName.length===1?"":
  <select className="mt-3 bg-dark text-white w-25 p-2"
  onChange={(e) => {
          const dropvalue = e.target.value;
          setProvinceState(dropvalue,()=>{
          });
        }}
  >
  {stateName&& stateName.map((val,index)=>{
       return(
         <option value={val.Province_State} key={index}>{val.Province_State}</option>
       )
      })}
  </select>}
  {hideGraph?<><h1>No data Available for Date {selectedDate}</h1>
  </>: <>
  <div className="container">
  <div class="row mt-2 mb-2">
  <div class="col-sm-3">
    <div class="card  bg-primary">
      <div class="card-body">
        <h5 class="card-title">Confirmed</h5>
        <p className="card-text text-white">{stateValue[0] && stateValue[0]}</p>
      </div>
    </div>
  </div>
  <div class="col-sm-3">
  <div class="card bg-danger">
      <div class="card-body">
        <h5 class="card-title">Death</h5>
        <p className="card-text text-white">{stateValue[1] && stateValue[1]}</p>
      </div>
    </div>
  </div>
  <div class="col-sm-3">
  <div class="card bg-success">
      <div class="card-body">
        <h5 class="card-title">Active</h5>
        <p className="card-text text-white">{stateValue[2] && stateValue[2]}</p>
      </div>
    </div>
  </div>
  <div class="col-sm-3">
  <div class="card bg-success">
      <div class="card-body bg-info">
        <h5 class="card-title">Recovered</h5>
        <p className="card-text text-white">{stateValue[3] && stateValue[3]}</p>
      </div>
    </div>
  </div>
</div>
  </div>
  <div className="container mb-4">
     <Bar data={chartData} height={25} width={100} />
  </div>
     </>
  }
    </div>
  );
}

export default EveryDayData
