import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import cities from 'cities.json';
import { GeolocationService } from 'src/app/services/geolocation.service';
import { WeatherService } from 'src/app/services/weather.service';

interface City {
  name: string;
  lat: String;
  lng: String;
  country: String;
}

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit {
  user_geolocation = {
    latitude: '',
    longitude: '',
  };

  cities_founded: any = [];
  constructor(
    private weather: WeatherService,
    private router: Router,
    private geoloc: GeolocationService
  ) {}

  ngOnInit() {}

  handleInput(e: any) {
    this.cities_founded = [];
    if (e.detail.value.length > 2) {
      for (let city of cities) {
        if (city.name.toLowerCase().startsWith(e.detail.value.toLowerCase())) {
          this.cities_founded.push(city);
        }
      }
    }
  }

  async getWeather(city: any) {
    this.geoloc.user_geolocation.latitude = await city.lat;
    this.geoloc.user_geolocation.longitude = await city.lng;
    this.router.navigateByUrl('/meteo', { replaceUrl: true });
  }
}
