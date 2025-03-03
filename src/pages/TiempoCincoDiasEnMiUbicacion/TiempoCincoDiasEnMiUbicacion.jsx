/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import '../../pages/TiempoCincoDiasEnMiUbicacion/TiempoCincoDiasEnMiUbicacion.css';
import obtenerNombreDia from '../../components/ObtenerNombreDía';
import convertirUnixATiempo from '../../components/ConvertirUnixATiempo';
import MySpinner from '../../components/Spinner/Spinner';



const TiempoCincoDiasEnMiUbicacion = () => {
  const [location, setLocation] = useState({ lat: null, lon: null }); 
  const [weatherData, setWeatherData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (location.lat !== null && location.lon !== null) {
      const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${location.lat}&lon=${location.lon}&appid=ecce75668fb512c7b4b22a15d930fb7e&units=metric&lang=es`;
      fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
          setWeatherData(data);
          setIsLoading(false); // Deja de cargar después de obtener los datos
        })
        .catch(error => {
          console.error('Error al buscar datos:', error);
          setIsLoading(false); // Deja de cargar si ocurre un error
        });
    }
  }, [location]);

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        setLocation({
          lat: position.coords.latitude,
          lon: position.coords.longitude
        });
      }, error => console.error('Error getting location:', error));
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  };

  useEffect(() => {
    getLocation();
  }, []);
   
  return (
    <>
        <h1>Clima Check</h1>
      {isLoading ? (
        <MySpinner /> // Muestra el spinner mientras `isLoading` sea true
      ) : (
        weatherData && weatherData.list && (
          <div className='cincoDiasCajaGrande'>
            <div className='cincoDiasCaja'>
              <div className='nombreDeCiudad'>
                <h3>Clima por cinco días en </h3>    
                <h2>{weatherData.city.name}</h2>      
              </div>
              {weatherData.list.slice(0, 5).map((forecast, index) => (
                <div key={index} className='cincoDias'>
                  <div className='cajaLateral'>
                    <div className='cajitaDoble'> 
                      <p>{obtenerNombreDia(index)} </p>
                      <div className='cajitaDobleImg'>
                        <img
                          src={`http://openweathermap.org/img/w/${forecast.weather[0].icon}.png`}
                          alt={forecast.weather[0].description}
                          onError={(e) => console.error("Error al cargar la imagen:", e)}
                        />
                      </div>
                    </div>     
                    <p>Temperatura: {Math.round(forecast.main.temp)}°C</p>
                    <p>Sensación térmica: {Math.round(forecast.main.feels_like)}°C</p>
                    <p>Temperatura mínima: {Math.round(forecast.main.temp_min)}°C</p>
                    <p>Temperatura máxima: {Math.round(forecast.main.temp_max)}°C</p>
                    <p>Pres. Atmosférica: {forecast.main.pressure} hPa</p>
                    <p>Descripción: {forecast.weather[0].description}</p>
                    <p>Nubosidad variable: {forecast.clouds.all}%</p>
                    <p>Humedad: {forecast.main.humidity}%</p>
                    <p>Visibilidad: {Math.round(forecast.visibility / 1000)} km</p>
                  </div>
                </div>
              ))}
            </div>
          </div> 
        )
      )}
    </>
  );
};

export default TiempoCincoDiasEnMiUbicacion;
