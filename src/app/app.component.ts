import { Component } from '@angular/core';
import { GeolocationService } from './services/geolocation.service';
import { register } from 'swiper/element/bundle';
register();


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(private geoloc : GeolocationService) {
    this.geoloc.getCoordinates();
  }
}
