import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Geolocation } from '@capacitor/geolocation';

@Injectable({
  providedIn: 'root',
})
export class GeolocationService {
  user_geolocation = {
    latitude: '',
    longitude: '',
  };

  constructor(private router: Router) {}

  async getCoordinates() {
    await Geolocation.checkPermissions().then((result: any) => {
      if (result.location != 'granted') {
        if (localStorage.getItem('alertgeoloc') != 'true')
          alert(
            "Pour une meilleure expérience, il serait préférable d'activer la géolocalisation dans vos paramètres."
          );
        localStorage.setItem('alertgeoloc', 'true');
        this.router.navigateByUrl('/recherche-meteo', { replaceUrl: true });
      } else {
        Geolocation.getCurrentPosition().then(async (result: any) => {
          this.user_geolocation.latitude = await result.coords.latitude;
          this.user_geolocation.longitude = await result.coords.longitude;
        });
      }
    });
  }
}
