import "./App.css";
import searchIcon from "./assets/search.png";
import cloudIcon from "./assets/clouds.png";
import clearIcon from "./assets/clear.png";
import drizzleIcon from "./assets/drizzle.png";
import humidityIcon from "./assets/humidity.png";
import rainIcon from "./assets/rain.png";
import snowIcon from "./assets/snow.png";
import windIcon from "./assets/wind.png";
import { useEffect, useState } from "react";

const weatherIconMap = {
  "01d": clearIcon,
  "01n": clearIcon,
  "02d": cloudIcon,
  "02n": cloudIcon,
  "03d": drizzleIcon,
  "03n": drizzleIcon,
  "04d": drizzleIcon,
  "04n": drizzleIcon,
  "09d": rainIcon,
  "09n": rainIcon,
  "010d": rainIcon,
  "010n": rainIcon,
  "013d": snowIcon,
  "013n": snowIcon,
};

const WeatherDetails = ({icon, temp, city, country, wind, humidity})=>{
  return (
    <>
      <div className="image"><img src={icon} alt="Image" /></div>
      <div className="temp">{temp}<span>&#176;C</span></div>
      <div className="location">{city}</div>
      <div className="country">{country}</div>
      <div className="dataContainer">
        <div className="element">
          <img src={humidityIcon} alt="humidity" className="icon"/>
          <div className="data">
            <div className="humidityPercent">{humidity} %</div>
            <div className="text">Humidity</div>
          </div>
        </div>
        <div className="element">
          <img src={windIcon} alt="humidity" className="icon"/>
          <div className="data">
            <div className="windPercent">{wind} km/hr</div>
            <div className="text">Wind Speed </div>
          </div>
        </div>
      </div>
    </>
  );
}

function App() {
  const [text,setText] = useState("Madurai");
  const [icon,setIcon] = useState(snowIcon);
  const [temp, setTemp] = useState(0);
  const [city,setCity] = useState("Madurai");
  const [country,setCountry] = useState("IN");
  const [wind,setWind] = useState(0);
  const [humidity,setHumidity] = useState(0);
  const [cityNotFound,setCityNotFound] = useState(false);
  const [loading,setLoading] = useState(false);
  const [error,setError] = useState(null)


  const search = async ()=>{
    setLoading(true);
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${text}&appid=6a0ee31e8ba1d0bad6b6bea3f076dff7&units=Metric`;
    try{
      let res = await fetch(url);
      let data = await res.json();
      if(data.cod==="404"){
        console.log("City Not Found");
        setCityNotFound(true);
        setLoading(false);
        return;
      }
      setHumidity(data.main.humidity);
      setTemp(data.main.temp);
      setWind(data.wind.speed);
      setCity(data.name);
      setCountry(data.sys.country);
      const weatherIconCode = data.weather[0].icon;
      setIcon(weatherIconMap[weatherIconCode] || clearIcon);
      setCityNotFound(false);
    }catch(error){
      console.log("An Error Occured:" + error.message);
      setError("Error Occured while fetching weather data ");
    }finally{
      setLoading(false);
    }
  };

  function handleCity(e)
  {
    setText(e.target.value);
  }

  const handleKeyDown = (e)=>{
    if(e.key=="Enter")
    search();
  };

  useEffect(function(){
    search();
  },[]);

  return (
    <>
      <div className="container">
        <div className="input-container">
          <input type="text" 
          className="inputCity"
          placeholder="Search City" 
          onChange={handleCity} 
          value = {text} 
          onKeyDown={handleKeyDown}/>
          <div className="searchIcon" onClick={search}>
            <img src={searchIcon} alt="search"/>
          </div>
        </div>
        
        {loading && <div className="loadingMessage">Loading...</div>}
        {error && <div className="errorMessage">{error}</div>}
        {cityNotFound && <div className="cityNotFound">City not found</div>}

        {!loading && !cityNotFound && <WeatherDetails icon = {icon} temp = {temp} city = {city} country = {country} wind = {wind} humidity = {humidity}/>}

      </div>
    </>
  )
}

export default App
