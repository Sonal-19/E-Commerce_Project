import React, { Component } from "react";
import apiKeys from "./apiKeys";
import Clock from "react-live-clock";
import "./Weather.css";

class Weather extends Component {
  state = {
    temperatureC: undefined,
    city: undefined,
    errorMsg: undefined,
  };

  componentDidMount() {
    if (navigator.geolocation) {
      this.getPosition()
        .then((position) => this.getWeather(position.coords.latitude, position.coords.longitude))
        .catch(() => this.getWeather(28.67, 77.22));
    } else {
      alert("Geolocation not available");
    }

    this.timerID = setInterval(() => this.updateWeather(), 600000);
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  getPosition = () => new Promise((resolve, reject) => navigator.geolocation.getCurrentPosition(resolve, reject));

  getWeather = async (latitude, longitude) => {
    try {
      const api_call = await fetch(
        `${apiKeys.base}weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKeys.key}`
      );
  
      if (!api_call.ok) {
        throw new Error(`Failed to fetch weather data. Status: ${api_call.status}`);
      }
  
      const data = await api_call.json();
  
      if (data.main && data.main.temp !== undefined) {
        this.setState({
          city: data.name,
          temperatureC: Math.round(data.main.temp),
          latitude: data.coord.lat,
          longitude: data.coord.lon,
        });
      } else {
        throw new Error("Temperature data not available in the API response.");
      }
    } catch (error) {
      console.error("Error fetching weather data:", error.message);
      this.setState({ errorMsg: "Error fetching weather data" });
    }
  };
  

  updateWeather = () => {
    const { latitude, longitude } = this.state;
    if (latitude !== undefined && longitude !== undefined) {
      this.getWeather(latitude, longitude);
    }
  };

  getWeatherType = () => {
    const temperature = this.state.temperatureC;
  
    if (temperature <= 0) {
      console.log("Condition: snowy");
      return "snowy";
    } else if (temperature <= 10) {
      console.log("Condition: cloudy");
      return "cloudy";
    } else if (temperature <= 20) {
      console.log("Condition: partlyCloudy");
      return "partlyCloudy";
    } else if (temperature <= 30) {
      console.log("Condition: sunny");
      return "sunny";
    } else {
      console.log("Condition: thundery");
      return "thundery";
    }
  };
  

  render() {
    return (
      <div className="m-5">
        <div className={`weather-icon ${this.getWeatherType()}`}></div>
        <div className="card cardW rounded bg-white border shadow p-4">
          <div className="title card-title d-flex mb-5">
            <h2 className="me-5">{this.state.city}</h2> 
            <span className="temperature "> {this.state.temperatureC}°<span>C</span></span>
          </div>
          <div className="date-time">
            <div className="current-time">
              <Clock format="HH:mm" interval={1000} ticking={true} />
            </div>
            <div className="current-date">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                day: "numeric",
                month: "long",
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Weather;
