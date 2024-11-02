import { Observable, alert } from '@nativescript/core';
import { WeatherService, WeatherData, ForecastDay } from '../services/weather.service';

export class WeatherViewModel extends Observable {
  private weatherService: WeatherService;
  private _weatherData: WeatherData | null = null;
  private _forecast: ForecastDay[] = [];
  private _city: string = '';
  private _isLoading: boolean = false;
  private _selectedCity: string = '';

  constructor() {
    super();
    this.weatherService = new WeatherService();
  }

  get weatherData(): WeatherData | null {
    return this._weatherData;
  }

  get forecast(): ForecastDay[] {
    return this._forecast;
  }

  get city(): string {
    return this._city;
  }

  get selectedCity(): string {
    return this._selectedCity;
  }

  set city(value: string) {
    if (this._city !== value) {
      this._city = value;
      this.notifyPropertyChange('city', value);
    }
  }

  get isLoading(): boolean {
    return this._isLoading;
  }

  set isLoading(value: boolean) {
    if (this._isLoading !== value) {
      this._isLoading = value;
      this.notifyPropertyChange('isLoading', value);
    }
  }

  formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  }

  async fetchWeather() {
    if (!this.city) {
      alert({
        title: "Error",
        message: "Please enter a city name",
        okButtonText: "OK"
      });
      return;
    }

    try {
      this.isLoading = true;
      const { current, forecast } = await this.weatherService.getWeatherAndForecast(this.city);
      this._weatherData = current;
      this._forecast = forecast;
      this._selectedCity = this.city;
      this.notifyPropertyChange('weatherData', current);
      this.notifyPropertyChange('forecast', forecast);
      this.notifyPropertyChange('selectedCity', this.city);
    } catch (error) {
      alert({
        title: "Error",
        message: "Failed to fetch weather data. Please try again.",
        okButtonText: "OK"
      });
    } finally {
      this.isLoading = false;
    }
  }
}