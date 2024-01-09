import React from 'react'
import CurrentLocation from "./currentLocation";
import "./Weather.css";

function WeatherCard() {
  return (
    <>
      <div>
        <CurrentLocation />
      </div>
    </>
  )
}

export default WeatherCard