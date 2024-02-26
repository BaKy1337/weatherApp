import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WeatherService {
  is_weather_loaded = false;

  private openApiToken = '185629bdb375797b96eb37a6c3d2824e';
  constructor(private http: HttpClient) {}

  getWeather(lat: any, lng: any): Observable<any[]> {
    const urlWeather =
      'https://api.openweathermap.org/data/2.5/weather?lat=' +
      lat +
      '&lon=' +
      lng +
      '&appid=' +
      this.openApiToken +
      '&units=metric&lang=fr';
    return this.http.get<any[]>(urlWeather);
  }

  getPollution(lat: any, lng: any): Observable<any[]> {
    const urlPollution =
      'https://api.openweathermap.org/data/2.5/air_pollution?lat=' +
      lat +
      '&lon=' +
      lng +
      '&appid=' +
      this.openApiToken +
      '&units=metric&lang=fr';
    return this.http.get<any[]>(urlPollution);
  }

  getForecast(lat: any, lng: any): Observable<any> {
    const urlForecast =
      'https://api.openweathermap.org/data/2.5/forecast?lat=' +
      lat +
      '&lon=' +
      lng +
      '&appid=' +
      this.openApiToken +
      '&units=metric&lang=fr';
    return this.http.get(urlForecast);
  }
}
