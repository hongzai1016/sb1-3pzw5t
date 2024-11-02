import { Observable, Http } from '@nativescript/core';

export interface WeatherData {
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  iconUrl: string;
  feelsLike: number;
  uvIndex: number;
}

export interface ForecastDay {
  date: string;
  maxTemp: number;
  minTemp: number;
  condition: string;
  iconUrl: string;
}

export class WeatherService extends Observable {
  private apiKey = '69630082ef1f498f9b2112213240211';
  private baseUrl = 'https://api.weatherapi.com/v1';

  async getWeatherAndForecast(
    city: string
  ): Promise<{ current: WeatherData; forecast: ForecastDay[] }> {
    try {
      const response = await Http.request({
        url: `${this.baseUrl}/forecast.json?key=${
          this.apiKey
        }&q=${encodeURIComponent(city)}&days=5`,
        method: 'GET',
      });

      const data = response.content.toJSON();

      const current: WeatherData = {
        temperature: data.current.temp_c,
        condition: data.current.condition.text,
        humidity: data.current.humidity,
        windSpeed: data.current.wind_kph,
        iconUrl: 'https:' + data.current.condition.icon,
        feelsLike: data.current.feelslike_c,
        uvIndex: data.current.uv,
      };

      const forecast: ForecastDay[] = data.forecast.forecastday.map((day) => ({
        date: day.date,
        maxTemp: day.day.maxtemp_c,
        minTemp: day.day.mintemp_c,
        condition: day.day.condition.text,
        iconUrl: 'https:' + day.day.condition.icon,
      }));

      return { current, forecast };
    } catch (error) {
      console.error('Error fetching weather:', error);
      throw new Error('Failed to fetch weather data');
    }
  }
}
