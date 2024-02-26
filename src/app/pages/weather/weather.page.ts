import { Component, ViewChild } from '@angular/core';
import { IonContent, ScrollDetail, ToastController } from '@ionic/angular';
import { GeolocationService } from 'src/app/services/geolocation.service';
import { WeatherService } from 'src/app/services/weather.service';

import countries from '../../../assets/countries.json';

import $ from 'jquery';
import 'round-slider';
import { Router } from '@angular/router';

interface ForeCast {
  hour: String;
  icon: String;
  temp: Number;
}

@Component({
  selector: 'app-weather',
  templateUrl: './weather.page.html',
  styleUrls: ['./weather.page.scss'],
})
export class WeatherPage {
  @ViewChild('pageTop') pageTop!: IonContent;
  currentYear = new Date().getFullYear();
  is_weather_loaded = false;
  showLittleDetails = false;
  wind_direction = '';
  pollutionObject = {
    quality: '',
    aqi: 0,
    co: 0,
    message: '',
  };
  currentWeather = {
    name: '',
    country: '',
    weather: {
      description: '',
      icon: '',
    },
    visibility: {
      val: 0,
      message: '',
    },
    main: {
      temp: 0,
      feels_like: {
        val: 0,
        message: '',
      },
      pressure: {
        val: 0,
        message: '',
      },
      humidity: {
        val: 0,
        message: '',
      },
      temp_min: 0,
      temp_max: 0,
    },
    wind: {
      speed: 0,
      deg: 0,
      message: '',
    },
    clouds: {
      val: 0,
      message: '',
    },
    precipitation: {
      val: 0,
      message: '',
    },
    sys: {
      sunrise: '',
      sunset: '',
    },
  };
  forecastWeather: ForeCast[] = [];
  air_quality = [
    {
      id: 1,
      quality: 'Bonne',
      message: "L'air est frais et pur, aucune préoccupation pour la santé.",
    },
    {
      id: 2,
      quality: 'Passable',
      message:
        "La qualité de l'air est acceptable mais peut être améliorée légèrement.",
    },
    {
      id: 3,
      quality: 'Modérée',
      message:
        "L'air présente une légère pollution, nécessitant une vigilance accrue.",
    },
    {
      id: 4,
      quality: 'Mauvaise',
      message:
        "La pollution de l'air est notable, il est recommandé de limiter les activités extérieures.",
    },
    {
      id: 5,
      quality: 'Très mauvaise',
      message:
        "L'air est fortement pollué, l'exposition extérieure doit être minimisée pour des raisons de santé.",
    },
  ];
  feelslike = [
    {
      inferieur:
        'Il fait plus froid que la température indiquée, habillez-vous chaudement.',
    },
    {
      egale:
        'La température ressentie correspond à la température réelle, habillez-vous en conséquence.',
    },
    {
      superieur:
        "Malgré la température indiquée, la sensation peut être plus chaude en raison de facteurs tels que l'humidité ou le vent.",
    },
  ];
  pressure = [
    {
      treshaute:
        "Avec une pression atmosphérique très élevée, attendez-vous à un ciel d'un bleu profond et à un temps calme et ensoleillé.",
    },
    {
      haute:
        'La pression atmosphérique est relativement élevée, indiquant un ciel clair et des conditions météorologiques stables.',
    },
    {
      normale:
        'La pression atmosphérique est dans la plage normale, avec un temps typique pour cette région.',
    },
    {
      basse:
        "Une légère baisse de la pression atmosphérique est observée, ce qui pourrait entraîner une augmentation de l'humidité et des nuages.",
    },
    {
      tresbasse:
        'Avec une pression atmosphérique très basse, attendez-vous à des conditions météorologiques instables, avec des risques de précipitations et de vents forts.',
    },
  ];
  humidity = [
    {
      treshaute:
        'Avec une humidité très élevée, attendez-vous à un air lourd et humide, avec des risques accrus de précipitations et de brouillard.',
    },
    {
      haute:
        "L'humidité est élevée, ce qui peut rendre l'air lourd et provoquer une sensation d'inconfort.",
    },
    {
      normale:
        "L'humidité est modérée, offrant un équilibre confortable entre l'air sec et l'air humide.",
    },
    {
      basse:
        "L'humidité est relativement faible, ce qui peut rendre l'air agréable et confortable.",
    },
    {
      tresbasse:
        "Avec une humidité très faible, attendez-vous à un air sec et des conditions propices à l'évaporation rapide.",
    },
  ];
  wind = [
    {
      calme:
        "Avec un vent calme, attendez-vous à des conditions de vent tranquilles et une sensation de douceur dans l'air.",
    },
    {
      leger:
        'Le vent est léger, ce qui peut ajouter une agréable brise rafraîchissante.',
    },
    {
      modere:
        "Le vent est modéré, ce qui peut agiter les branches d'arbres et faire voler légèrement la poussière.",
    },
    {
      fort: 'Le vent est fort, ce qui peut provoquer des mouvements brusques des arbres et des difficultés à marcher contre le vent.',
    },
  ];
  clouds = [
    {
      tresfaible:
        'Avec une couverture nuageuse très faible, attendez-vous à un ciel principalement dégagé avec peu ou pas de nuages visibles.',
    },
    {
      legere:
        'La couverture nuageuse est légère, offrant quelques nuages dispersés mais avec de nombreuses périodes ensoleillées.',
    },
    {
      modere:
        'La couverture nuageuse est modérée, avec un ciel partiellement nuageux et des périodes où le soleil peut être masqué par les nuages.',
    },
    {
      dense:
        'La couverture nuageuse est dense, avec un ciel principalement couvert et des périodes prolongées sans ensoleillement direct.',
    },
  ];
  precipitation = [
    {
      tresfaible:
        'Avec une très faible précipitation, attendez-vous à des gouttes de pluie ou de neige très légères, presque imperceptibles.',
    },
    {
      faible:
        'La précipitation est faible, ce qui peut entraîner des averses légères à modérées mais généralement de courte durée.',
    },
    {
      modere:
        "La précipitation est modérée, ce qui peut entraîner des averses soutenues et une accumulation significative d'eau.",
    },
    {
      forte:
        'La précipitation est forte, ce qui peut causer des averses intenses, des inondations potentielles et des conditions météorologiques dangereuses.',
    },
  ];
  visibility = [
    {
      tresfaible:
        'Avec une visibilité très faible, attendez-vous à une visibilité extrêmement réduite, souvent associée à du brouillard dense ou à des conditions de brouillard.',
    },
    {
      faible:
        'La visibilité est limitée, ce qui peut rendre la conduite difficile et nécessiter une attention accrue.',
    },
    {
      modere:
        'La visibilité est modérée, offrant une vision relativement claire, mais avec une perception réduite de lointains.',
    },
    {
      forte:
        'Avec une bonne visibilité, attendez-vous à une vision claire et dégagée, offrant une perception nette des environs.',
    },
  ];

  constructor(
    private geoloc: GeolocationService,
    private weather: WeatherService,
    private toastController: ToastController,
    private router: Router
  ) {
    this.is_weather_loaded = this.weather.is_weather_loaded;
  }

  handleScroll(ev: CustomEvent<ScrollDetail>) {
    if (ev.detail.scrollTop > 250) {
      document.getElementById('showLittleDetails')!.style.opacity = '1';
    }
    if (ev.detail.scrollTop < 250) {
      document.getElementById('showLittleDetails')!.style.opacity = '0';
    }
  }

  async ionViewWillEnter() {
    this.getWeather(
      this.geoloc.user_geolocation.latitude,
      this.geoloc.user_geolocation.longitude
    );
  }

  getWeather(lat: string, lng: string) {
    this.weather.getPollution(lat, lng).subscribe(
      async (pollution: any) => {
        this.pollutionObject.co = await pollution.list[0].components.co;
        this.pollutionObject.aqi = await pollution.list[0].main.aqi;
        for (let quality of this.air_quality) {
          if (pollution.list[0].main.aqi == quality.id) {
            this.pollutionObject.message = quality.message;
            this.pollutionObject.quality = quality.quality;
          }
        }
      },
      (err) => {
        this.is_weather_loaded = false;
        return this.presentToast();
      }
    );
    this.weather.getWeather(lat, lng).subscribe(
      async (weather: any) => {
        
        this.currentWeather.name = weather.name; //Nom de la ville
        this.currentWeather.weather.description =
          weather.weather[0].description; // description du temps
        this.currentWeather.weather.icon = weather.weather[0].icon;

        this.currentWeather.main.temp = Math.round(weather.main.temp); // arondir la température à l'entier le plus proche
        this.currentWeather.main.temp_max = Math.round(weather.main.temp_max);
        this.currentWeather.main.temp_min = Math.round(weather.main.temp_min);
        this.currentWeather.main.feels_like.val = Math.round(
          weather.main.feels_like
        );
        if (
          Math.round(weather.main.feels_like) < Math.round(weather.main.temp)
        ) {
          for (let message of this.feelslike) {
            if (message.inferieur) {
              this.currentWeather.main.feels_like.message = message.inferieur;
            }
          }
        }
        if (
          Math.round(weather.main.feels_like) == Math.round(weather.main.temp)
        ) {
          for (let message of this.feelslike) {
            if (message.egale) {
              this.currentWeather.main.feels_like.message = message.egale;
            }
          }
        }
        if (
          Math.round(weather.main.feels_like) > Math.round(weather.main.temp)
        ) {
          for (let message of this.feelslike) {
            if (message.superieur) {
              this.currentWeather.main.feels_like.message = message.superieur;
            }
          }
        }

        //PRESSION
        this.currentWeather.main.pressure.val = Math.round(
          weather.main.pressure
        );
        if (Math.round(weather.main.pressure) > 1025) {
          for (let message of this.pressure) {
            if (message.treshaute) {
              this.currentWeather.main.pressure.message = message.treshaute;
            }
          }
        }
        if (
          Math.round(weather.main.pressure) > 1020 &&
          Math.round(weather.main.pressure) <= 1025
        ) {
          for (let message of this.pressure) {
            if (message.haute) {
              this.currentWeather.main.pressure.message = message.haute;
            }
          }
        }
        if (
          Math.round(weather.main.pressure) > 1000 &&
          Math.round(weather.main.pressure) <= 1020
        ) {
          for (let message of this.pressure) {
            if (message.normale) {
              this.currentWeather.main.pressure.message = message.normale;
            }
          }
        }
        if (
          Math.round(weather.main.pressure) > 995 &&
          Math.round(weather.main.pressure) <= 1000
        ) {
          for (let message of this.pressure) {
            if (message.basse) {
              this.currentWeather.main.pressure.message = message.basse;
            }
          }
        }
        if (Math.round(weather.main.pressure) <= 995) {
          for (let message of this.pressure) {
            if (message.tresbasse) {
              this.currentWeather.main.pressure.message = message.tresbasse;
            }
          }
        }

        //HUMIDITE
        this.currentWeather.main.humidity.val = Math.round(
          weather.main.humidity
        );
        if (Math.round(weather.main.humidity) > 80) {
          for (let message of this.humidity) {
            if (message.treshaute) {
              this.currentWeather.main.humidity.message = message.treshaute;
            }
          }
        }
        if (
          Math.round(weather.main.humidity) > 60 &&
          Math.round(weather.main.humidity) <= 80
        ) {
          for (let message of this.humidity) {
            if (message.haute) {
              this.currentWeather.main.humidity.message = message.haute;
            }
          }
        }
        if (
          Math.round(weather.main.humidity) > 40 &&
          Math.round(weather.main.humidity) <= 60
        ) {
          for (let message of this.humidity) {
            if (message.normale) {
              this.currentWeather.main.humidity.message = message.normale;
            }
          }
        }
        if (
          Math.round(weather.main.humidity) > 20 &&
          Math.round(weather.main.humidity) <= 40
        ) {
          for (let message of this.humidity) {
            if (message.basse) {
              this.currentWeather.main.humidity.message = message.basse;
            }
          }
        }
        if (Math.round(weather.main.humidity) <= 20) {
          for (let message of this.humidity) {
            if (message.tresbasse) {
              this.currentWeather.main.humidity.message = message.tresbasse;
            }
          }
        }

        //VISIBILITY
        this.currentWeather.visibility.val = Math.round(
          weather.visibility / 1000
        );
        if (Math.round(weather.visibility) > 5000) {
          for (let message of this.visibility) {
            if (message.forte) {
              this.currentWeather.visibility.message = message.forte;
            }
          }
        }
        if (
          Math.round(weather.visibility) > 3000 &&
          Math.round(weather.visibility) <= 5000
        ) {
          for (let message of this.visibility) {
            if (message.modere) {
              this.currentWeather.visibility.message = message.modere;
            }
          }
        }
        if (
          Math.round(weather.visibility) > 1000 &&
          Math.round(weather.visibility) <= 3000
        ) {
          for (let message of this.visibility) {
            if (message.faible) {
              this.currentWeather.visibility.message = message.faible;
            }
          }
        }
        if (Math.round(weather.visibility) <= 1000) {
          for (let message of this.visibility) {
            if (message.tresfaible) {
              this.currentWeather.visibility.message = message.tresfaible;
            }
          }
        }

        //WIND
        this.currentWeather.wind.speed = Math.round(weather.wind.speed);
        this.currentWeather.wind.deg = Math.round(weather.wind.deg);

        if (Math.round(weather.wind.speed) > 8) {
          for (let message of this.wind) {
            if (message.fort) {
              this.currentWeather.wind.message = message.fort;
            }
          }
        }
        if (
          Math.round(weather.wind.speed) > 5 &&
          Math.round(weather.wind.speed) <= 8
        ) {
          for (let message of this.wind) {
            if (message.modere) {
              this.currentWeather.wind.message = message.modere;
            }
          }
        }
        if (
          Math.round(weather.wind.speed) > 2 &&
          Math.round(weather.wind.speed) <= 5
        ) {
          for (let message of this.wind) {
            if (message.leger) {
              this.currentWeather.wind.message = message.leger;
            }
          }
        }
        if (Math.round(weather.wind.speed) <= 2) {
          for (let message of this.wind) {
            if (message.calme) {
              this.currentWeather.wind.message = message.calme;
            }
          }
        }

        //CLOUDS
        this.currentWeather.clouds.val = Math.round(weather.clouds.all);
        if (Math.round(weather.clouds.all) > 70) {
          for (let message of this.clouds) {
            if (message.dense) {
              this.currentWeather.clouds.message = message.dense;
            }
          }
        }
        if (
          Math.round(weather.clouds.all) > 40 &&
          Math.round(weather.clouds.all) <= 70
        ) {
          for (let message of this.clouds) {
            if (message.modere) {
              this.currentWeather.clouds.message = message.modere;
            }
          }
        }
        if (
          Math.round(weather.clouds.all) > 20 &&
          Math.round(weather.clouds.all) <= 40
        ) {
          for (let message of this.clouds) {
            if (message.legere) {
              this.currentWeather.clouds.message = message.legere;
            }
          }
        }
        if (Math.round(weather.clouds.all) <= 20) {
          for (let message of this.clouds) {
            if (message.tresfaible) {
              this.currentWeather.clouds.message = message.tresfaible;
            }
          }
        }

        for (let country of countries) {
          if (weather.sys.country == country.code) {
            this.currentWeather.country = country.name;
          }
        }

        //PRECIPITATION
        if (!weather.rain && !weather.snow) {
          this.currentWeather.precipitation.message =
            "Il n'existe aucune valeure expoloitable pour l'heure";
        }
        if (weather.rain) {
          if (weather.rain['1h']) {
            this.currentWeather.precipitation.val = weather.rain['1h'];
            if (weather.rain['1h'] > 10) {
              for (let message of this.precipitation) {
                if (message.forte) {
                  this.currentWeather.precipitation.message = message.forte;
                }
              }
            }
            if (weather.rain['1h'] > 5 && weather.rain['1h'] <= 10) {
              for (let message of this.precipitation) {
                if (message.modere) {
                  this.currentWeather.precipitation.message = message.modere;
                }
              }
            }
            if (weather.rain['1h'] > 1 && weather.rain['1h'] <= 5) {
              for (let message of this.precipitation) {
                if (message.faible) {
                  this.currentWeather.precipitation.message = message.faible;
                }
              }
            }
            if (weather.rain['1h'] <= 1) {
              for (let message of this.precipitation) {
                if (message.tresfaible) {
                  this.currentWeather.precipitation.message =
                    message.tresfaible;
                }
              }
            }
          }
          if (weather.rain['3h']) {
            this.currentWeather.precipitation.val = Math.round(
              weather.rain['3h']
            );
            if (weather.rain['3h'] > 10) {
              for (let message of this.precipitation) {
                if (message.forte) {
                  this.currentWeather.precipitation.message = message.forte;
                }
              }
            }
            if (weather.rain['3h'] > 5 && weather.rain['3h'] <= 10) {
              for (let message of this.precipitation) {
                if (message.modere) {
                  this.currentWeather.precipitation.message = message.modere;
                }
              }
            }
            if (weather.rain['3h'] > 1 && weather.rain['3h'] <= 5) {
              for (let message of this.precipitation) {
                if (message.faible) {
                  this.currentWeather.precipitation.message = message.faible;
                }
              }
            }
            if (weather.rain['3h'] <= 1) {
              for (let message of this.precipitation) {
                if (message.tresfaible) {
                  this.currentWeather.precipitation.message =
                    message.tresfaible;
                }
              }
            }
          }
        }
        if (weather.snow) {
          if (weather.snow['1h']) {
            this.currentWeather.precipitation.val = Math.round(
              weather.snow['1h']
            );
            if (weather.snow['1h'] > 10) {
              for (let message of this.precipitation) {
                if (message.forte) {
                  this.currentWeather.precipitation.message = message.forte;
                }
              }
            }
            if (weather.snow['1h'] > 5 && weather.snow['1h'] <= 10) {
              for (let message of this.precipitation) {
                if (message.modere) {
                  this.currentWeather.precipitation.message = message.modere;
                }
              }
            }
            if (weather.snow['1h'] > 1 && weather.snow['1h'] <= 5) {
              for (let message of this.precipitation) {
                if (message.faible) {
                  this.currentWeather.precipitation.message = message.faible;
                }
              }
            }
            if (weather.snow['1h'] <= 1) {
              for (let message of this.precipitation) {
                if (message.tresfaible) {
                  this.currentWeather.precipitation.message =
                    message.tresfaible;
                }
              }
            }
          }
          if (weather.snow['3h']) {
            this.currentWeather.precipitation.val = Math.round(
              weather.snow['3h']
            );
            if (weather.snow['3h'] > 10) {
              for (let message of this.precipitation) {
                if (message.forte) {
                  this.currentWeather.precipitation.message = message.forte;
                }
              }
            }
            if (weather.snow['3h'] > 5 && weather.snow['3h'] <= 10) {
              for (let message of this.precipitation) {
                if (message.modere) {
                  this.currentWeather.precipitation.message = message.modere;
                }
              }
            }
            if (weather.snow['3h'] > 1 && weather.snow['3h'] <= 5) {
              for (let message of this.precipitation) {
                if (message.faible) {
                  this.currentWeather.precipitation.message = message.faible;
                }
              }
            }
            if (weather.snow['3h'] <= 1) {
              for (let message of this.precipitation) {
                if (message.tresfaible) {
                  this.currentWeather.precipitation.message =
                    message.tresfaible;
                }
              }
            }
          }
        }

        let sunriseDate = new Date(weather.sys.sunrise * 1000);
        let sunriseHours = '0' + sunriseDate.getHours();
        let sunriseMinutes = '0' + sunriseDate.getMinutes();
        let formattedSunrise =
          sunriseHours.substr(-2) + ':' + sunriseMinutes.substr(-2);

        let sunsetDate = new Date(weather.sys.sunset * 1000);
        let sunsetHours = '0' + sunsetDate.getHours();
        let sunsetMinutes = '0' + sunsetDate.getMinutes();
        let formattedSunset =
          sunsetHours.substr(-2) + ':' + sunsetMinutes.substr(-2);

        this.currentWeather.sys.sunrise = formattedSunrise;
        this.currentWeather.sys.sunset = formattedSunset;

        let rotation =
          'translate(-50%, 0%) rotate(' +
          this.currentWeather.wind.deg.toString() +
          'deg)';
        let positionhPa =
          'translate(-50%, -50%) rotate(' +
          this.hPaPosition(this.currentWeather.main.pressure.val).toString() +
          'deg)';
        document.getElementById('wind_direction')!.style.transform = rotation;
        document.getElementById('hpaMesure')!.style.transform = positionhPa;

        if (weather.wind.deg <= 90) {
          this.wind_direction = 'NE';
        } else if (weather.wind.deg > 90 && weather.wind.deg < 180) {
          this.wind_direction = 'SE';
        } else if (weather.wind.deg >= 180 && weather.wind.deg < 270) {
          this.wind_direction = 'SO';
        } else if (weather.wind.deg >= 270 && weather.wind.deg <= 360) {
          this.wind_direction = 'NO';
        }

        this.weather.getForecast(lat, lng).subscribe(
          async (forecast: any) => {
            let icon = this.currentWeather.weather.icon + '.svg';
            this.forecastWeather[0] = {
              hour: 'Maint.',
              icon: '../../../assets/icons/weather/' + icon,
              temp: this.currentWeather.main.temp,
            };
            for (let weather of forecast.list) {
              let icon =
                '../../../assets/icons/weather/' +
                weather.weather[0].icon +
                '.svg';
              let forcecast = {
                hour: weather.dt_txt.substring(11, 13) + 'h',
                icon: icon,
                temp: Math.round(weather.main.temp),
              };
              this.forecastWeather.push(forcecast);
            }
          },
          (err) => {
            console.log(err);

            this.is_weather_loaded = false;
            return this.presentToast();
          }
        );
      },
      (err) => {
        this.is_weather_loaded = false;
        return this.presentToast();
      }
    );

    this.is_weather_loaded = true;
  }

  async presentToast() {
    const toast = await this.toastController.create({
      message:
        "Une erreur est survenue lors de la requête. Si le problème persiste, veuiller contacter l'administrateur.",
      duration: 2000,
      mode: 'ios',
      position: 'top',
      swipeGesture: 'vertical',
      cssClass: 'custom-toast',
      buttons: [
        {
          icon: 'close-outline',
          role: 'cancel',
        },
      ],
    });

    await toast.present();
  }

  hPaPosition(value: number) {
    // value devrait se situer toujours entre 940 et 1060
    let degRange = 360; // degres cercle
    let valRange = 120; // val max - val min hPa (1060 - 940)
    let deg_p_unit = degRange / valRange; // 3
    let position = deg_p_unit * (value - 940); // 940 val min hPa

    return position;
  }

  selectCity(lat: string, lng: string) {
    this.geoloc.user_geolocation.latitude = lat;
    this.geoloc.user_geolocation.longitude = lng;
    this.getWeather(lat, lng);
    this.pageTop.scrollToTop();
  }
}
