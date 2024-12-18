import dotenv from 'dotenv';
import axios from 'axios';
dotenv.config();

// Define an interface for the Coordinates object
interface Coordinates {
  lat: number;
  lon: number;
}

// Define a class for the Weather object
class Weather {
  temperature: number;
  wind: number;
  humidity: number;

  constructor(
    temperature: number,
    wind: number,
    humidity: number
  ) {
    this.temperature = temperature;
    this.wind = wind;
    this.humidity = humidity;
  }
}

// Complete the WeatherService class
class WeatherService {
  // Define the baseURL, API key, and city name properties
  private baseURL = 'https://api.openweathermap.org';
  private apiKey: string = process.env.WEATHER_API_KEY || '';
  private cityName: string = '';

  // Create fetchLocationData method
  private async fetchLocationData(query: string): Promise<any[]> {
    const url = this.buildGeocodeQuery(query);
    const response = await axios.get(url);
    return response.data;
  }

  // Create buildGeocodeQuery method
  private buildGeocodeQuery(query: string): string {
    const limit = 1;
    return `${this.baseURL}/geo/1.0/direct?q=${encodeURIComponent(query)}&limit=${limit}&appid=${this.apiKey}`;
  }

  // Create destructureLocationData method
  private destructureLocationData(locationData: any[]): Coordinates {
    if (!locationData || locationData.length === 0) {
      throw new Error('No location data found for the city');
    }
    const { lat, lon } = locationData[0];
    return { lat, lon };
  }

  // Create buildWeatherQuery method
  private buildWeatherQuery(coordinates: Coordinates): string {
    // Using OpenWeatherMap Current Weather Data API:
    // https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={API key}&units=metric
    return `${this.baseURL}/data/2.5/weather?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${this.apiKey}&units=metric`;
  }

  // Create fetchAndDestructureLocationData method
  private async fetchAndDestructureLocationData(): Promise<Coordinates> {
    const locationData = await this.fetchLocationData(this.cityName);
    return this.destructureLocationData(locationData);
  }

  // Create fetchWeatherData method
  private async fetchWeatherData(coordinates: Coordinates): Promise<any> {
    const url = this.buildWeatherQuery(coordinates);
    const response = await axios.get(url);
    return response.data;
  }

  // Build parseCurrentWeather method
  private parseCurrentWeather(response: any): Weather {
    const temperature = response.main?.temp ?? 0;
    const humidity = response.main?.humidity ?? 0;
    const wind = response.wind?.speed ?? 0;
    return new Weather(temperature, wind, humidity);
  }

  // Complete getWeatherForCity method
  public async getWeatherForCity(city: string): Promise<Weather> {
    this.cityName = city;
    const coordinates = await this.fetchAndDestructureLocationData();
    const currentWeatherData = await this.fetchWeatherData(coordinates);
    const currentWeather = this.parseCurrentWeather(currentWeatherData);
    return currentWeather;
  }
}

export default new WeatherService();