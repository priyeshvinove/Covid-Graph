import {React,useState,useEffect} from 'react';
import './App.css';
import {Bar,Line,Doughnut } from 'react-chartjs-2'
import { csv } from "d3";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css'
import Moment from 'moment';

function App() {
  const [covidData,setCovidData]=useState();
  const [country,setCountry]=useState([]);
  const [chartData,setChartData]=useState({});
  const [stateValue,setStateValue]=useState([]);
  var [dropDownValue,setDropDownValue]=useState("Alabama");
  const todayDate=new Date('2021-04-05');
    const from = Moment(todayDate).format('MM-DD-YYYY').toString();
    console.log("from",from);
  const [selectedDate, setSelectedDate] = useState(from);
  const [altenatDate,setAlternateDate]=useState(null);
  const [hideGraph,setHideGraph]=useState(false);
  useEffect(() => {
    var tempCountry = "";
    console.log("This");
    csv(
      `https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_daily_reports_us/${selectedDate.toString()}.csv`
    ).then((data) => {
        // console.log(data);
      setHideGraph(false)

        setCovidData(data);
        tempCountry = new Set(data.map((d) => d.Province_State));
        // console.log(tempCountry);
        setCountry([...tempCountry]);
      })
      .catch((err) => {console.log("Error",{err})
      setHideGraph(true)
      });
  }, [selectedDate]);
// console.log(co);
  const chart=()=>{
    setChartData({
          labels: ["Confirmed","Death","Active"],
          datasets: [
            {
              label: "Data",
              data: stateValue,
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                
              ],
              borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)'
              ],
              borderWidth: 1,

              // borderWidth: 4
            }
          ]
        });
  }
  
  useEffect(()=>{
    chart();
  },[stateValue])

  useEffect(()=>{
 covidData&& covidData.map((val)=>{
    if(val.Province_State===dropDownValue) {
      setStateValue([parseInt(val.Confirmed),parseInt(val.Deaths),parseInt(val.Active)])
    }
  })
  },[dropDownValue])
      // console.log(stateValue);
    console.log("Formated Date",selectedDate);
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
          console.log(dropvalue)
          });
        }} >
      {country&& country.map((val)=>{
       return(
         <option value={val}>{val}</option>
       )
      })}
  </select>
  {hideGraph?<><h1>No data Available for Date {selectedDate}</h1>
  </>: 
     <Bar data={chartData} height={25} width={100} />
  }
    </div>
  );
}

export default App;