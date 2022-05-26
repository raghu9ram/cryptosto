import React, {useState,useEffect} from 'react';
import axios from 'axios';
import ReactHtmlParser from "react-html-parser";
import { LinearProgress, makeStyles, Typography, CircularProgress,
    createTheme,
    ThemeProvider, } from "@material-ui/core";
import SelectButton from "./SelectButton";

import { stockDays } from "../config/data";
import { Chart as ChartJS, registerables } from 'chart.js';
import { Chart , Line} from 'react-chartjs-2'
import SearchComponent from './SearchComponent';
ChartJS.register(...registerables);
const Stocks = (props) => {
    const [stock,setStocks] = useState()
    const [symbol,setSymbol] = useState("AAPL");
    const [days, setDays] = useState("TIME_SERIES_INTRADAY");
    const [resKey, setResKey] = useState("Time Series (5min)");
    const [historicData, setHistoricData] = useState();
  const [flag,setflag] = useState(false);

  const getDetails = async () => {
    axios.get( `https://shares111.herokuapp.com/api/stocks/details?symbol=${symbol}`)
         .then(result => {
             setStocks(result.data)
         });
  }

    useEffect(() => {
         getDetails();
     },[symbol])
     const fetchHistoricData = async () => {
        const { data } = await axios.get(`https://shares111.herokuapp.com/api/stocks/timeseries?symbol=${symbol}&granularity=${days}`);
        setflag(true);
        if(!data[resKey]) {
          props.showAlert(data.Note,"danger");
          setHistoricData([]);
        }
        else {
          const keys = Object.keys(data[resKey]);
          const result =[];
          for(let i=0;i<keys.length;i++) {
            result.push([keys[i], data[resKey][keys[i]]["4. close"]]);
          }
          setHistoricData(result);
        }
      };
    
      console.log(stock);
    
      useEffect(() => {
        fetchHistoricData();
      }, [symbol, days]);

const useStyles = makeStyles((theme) => ({
    container: {
      display: "flex",
      [theme.breakpoints.down("md")]: {
        flexDirection: "column",
        alignItems: "center",
      },
    },
    sidebar: {
      width: "30%",
      [theme.breakpoints.down("md")]: {
        width: "100%",
      },
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      marginTop: 25,
      borderRight: "2px solid grey",
    },
    heading: {
      fontWeight: "bold",
      marginBottom: 20,
      fontFamily: "Montserrat",
    },
    description: {
      width: "100%",
      fontFamily: "Montserrat",
      padding: 25,
      paddingBottom: 15,
      paddingTop: 0,
      textAlign: "justify",
    },
    marketData: {
      alignSelf: "start",
      padding: 25,
      paddingTop: 10,
      width: "100%",
      [theme.breakpoints.down("md")]: {
        display: "flex",
        justifyContent: "space-around",
      },
      [theme.breakpoints.down("sm")]: {
        flexDirection: "column",
        alignItems: "center",
      },
      [theme.breakpoints.down("xs")]: {
        alignItems: "start",
      },
    },
    graph: {
        width: "75%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        marginTop: 25,
        padding: 40,
        [theme.breakpoints.down("md")]: {
          width: "100%",
          marginTop: 0,
          padding: 20,
          paddingTop: 0,
        },
      },
  }));
  const darkTheme = createTheme({
    palette: {
      primary: {
        main: "#CFD0DC",
      },
      type: "dark",
    },
  });
const classes = useStyles()

    return (
      <div>
      <SearchComponent
          url="https://expressapp111.herokuapp.com/api/stocks/search?query="
          dataString="bestMatches"
          multiple={false}
          labelKey="1. symbol"
          label="Search Stocks"
          onSelection={(values) => { setSymbol(values["1. symbol"])}}
        ></SearchComponent>
        <div className = {classes.container}> 
        <div className={classes.sidebar}>
        
        <Typography variant="h3" className={classes.heading}>
          {stock?.Name}
        </Typography>
        <Typography variant="subtitle1" className={classes.description}>
        {stock?.Description}. 
        </Typography>
       
        </div>
        
        <ThemeProvider theme={darkTheme}>
      <div className={classes.graph}>
        {!historicData | flag===false ? (
          <CircularProgress
            style={{ color: "gold" }}
            size={250}
            thickness={1}
          />
        ) : (
          <>
            <Line
              data={{
                labels: historicData.map((stock) => {
                  let date = new Date(stock[0]);
                  let time =
                    date.getHours() > 12
                      ? `${date.getHours() - 12}:${date.getMinutes()} PM`
                      : `${date.getHours()}:${date.getMinutes()} AM`;
                  return days === "TIME_SERIES_INTRADAY" ? time : date.toLocaleDateString();
                }).reverse(),

                datasets: [
                  {
                    data: historicData.map((stock) => stock[1]).reverse(),
                    label: `Price ( Past ${days} Days ) in USD`,
                    borderColor: "#CFD0DC",
                  },
                ],
              }}
              options={{
                elements: {
                  point: {
                    radius: 1,
                  },
                },
              }}
            />
            <div
              style={{
                display: "flex",
                marginTop: 20,
                justifyContent: "space-around",
                width: "100%",
              }}
            >
              {stockDays.map((day) => (
                <SelectButton
                  key={day.granularity}
                  onClick={() => {setDays(day.granularity);
                    setResKey(day.resKey);
                    setflag(false);
                  }}
                  selected={day.granularity === days}
                >
                  {day.label}
                </SelectButton>
              ))}
            </div>
          </>
        )}
      </div>
    </ThemeProvider>
        
           
        </div>
        </div>
    );
}

export default Stocks;
