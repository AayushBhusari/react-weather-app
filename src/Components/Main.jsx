import { useState, useEffect } from "react";
import { FaLocationDot } from "react-icons/fa6";
import {
  MdWbCloudy,
  MdWbSunny,
  MdInvertColors,
  MdGrain,
  MdFlashOn,
  MdWaves,
} from "react-icons/md";
import { BsCloudHaze } from "react-icons/bs";

const Main = () => {
  const [area, setArea] = useState("New York");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${area}&appid=a6c7184161590535fce92a34441d9f3b`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const jsonData = await response.json();
      setData(jsonData);
      setArea(""); // Reset the area input
      setLoading(false); // Set loading to false after data is fetched
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const convertToCelsius = (temp) => {
    return (temp - 273.15).toFixed(2);
  };

  const convertToFahrenheit = (temp) => {
    return (((temp - 273.15) * 9) / 5 + 32).toFixed(2);
  };

  const renderWeatherIcon = () => {
    if (!data || !data.weather || data.weather.length === 0) return null;

    const weatherMain = data.weather[0].main.toLowerCase();

    switch (weatherMain) {
      case "clouds":
        return <MdWbCloudy size={50} />;
      case "clear":
        return <MdWbSunny size={50} />;
      case "rain":
        return <MdInvertColors size={50} />;
      case "drizzle":
        return <MdGrain size={50} />;
      case "thunderstorm":
        return <MdFlashOn size={50} />;
      case "snow":
        return <MdWaves size={50} />;
      case "haze":
        return <BsCloudHaze size={50} />;
      default:
        return null;
    }
  };

  const getCurrentDate = () => {
    const date = new Date();
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = String(date.getFullYear()).slice(2);
    return `${day}/${month}/${year}`;
  };

  return (
    <div className="h-screen bg-gradient-to-br from-blue-300 to-purple-400 flex justify-center items-center">
      <div className="container mx-auto bg-white p-6 rounded-xl shadow-lg w-11/12 md:w-1/2 lg:w-1/3">
        <div className="mb-4 flex flex-col md:flex-row items-center">
          <input
            className="w-full  px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 mb-2 md:mb-0 md:mr-2"
            type="text"
            placeholder="Enter the area name..."
            value={area}
            onChange={(e) => setArea(e.target.value)}
          />
          <button
            className="w-full md:w-auto px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none"
            onClick={fetchData}
          >
            Search
          </button>
        </div>
        <div className="p-4 border border-gray-300 rounded-md flex-grow overflow-auto">
          {!loading && data && (
            <div>
              <div className="location flex items-center justify-center gap-3 text-xl font-bold mb-4">
                <FaLocationDot />
                <h2>
                  {data.name}, {data.sys.country}
                </h2>
                <div className="date flex items-center">
                  <span className="mr-1 text-gray-500">Date:</span>
                  <h2 className="text-blue-600">{getCurrentDate()}</h2>
                </div>
              </div>
              <div className="icon flex justify-center items-center p-4">
                {renderWeatherIcon()}
              </div>
              <div className="display grid grid-cols-2 gap-2 max-md:grid-cols-1">
                <p className="weather-info p-2 bg-gray-300 rounded-lg">
                  <span className="label text-gray-500">Temperature:</span>{" "}
                  {convertToCelsius(data.main.temp)}°C /{" "}
                  {convertToFahrenheit(data.main.temp)}°F
                </p>
                <p className="weather-info p-2 bg-gray-300 rounded-lg">
                  <span className="label text-gray-500">Weather:</span>{" "}
                  {data.weather[0].description.charAt(0).toUpperCase() +
                    data.weather[0].description.slice(1)}
                </p>
                <p className="weather-info p-2 bg-gray-300 rounded-lg">
                  <span className="label text-gray-500">Humidity:</span>{" "}
                  {data.main.humidity}%
                </p>
                <p className="weather-info p-2 bg-gray-300 rounded-lg">
                  <span className="label text-gray-500">Wind Speed:</span>{" "}
                  {data.wind.speed} m/s
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Main;
