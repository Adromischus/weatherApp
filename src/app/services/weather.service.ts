import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LocationDetails } from '../models/location-details';
import { WeatherDetails } from '../models/weather-details';
import { CurrentDayData } from '../models/current-day-data';
import { TodaysData } from '../models/todays-data';
import { WeekData } from '../models/week-data';
import { TodaysHighlights } from '../models/todays-highlights';
import { Observable } from 'rxjs';
import { environmentVars } from '../environment/environmentVars';

@Injectable({
  providedIn: 'root',
})
export class WeatherService {
  locationDetails?: LocationDetails;
  weatherDetails?: WeatherDetails;
  currentDayData: CurrentDayData; //left container
  todaysData?: TodaysData[] = []; //right container
  weekData?: WeekData[] = []; //right container
  todaysHighlights: TodaysHighlights; //right container

  cityName: string = 'Prague';
  language: string = 'en-US';
  date: string = '20230809';
  units: string = 'm';

  currentTime: Date;

  today: boolean = true;
  week: boolean = false;

  celsius: boolean = true;
  fahrenheit: boolean = false;

  constructor(private httpClient: HttpClient) {
    this.getData();
  }

  fillCurrentDayDataModel(): void {
    this.currentTime = new Date();
    this.currentDayData.day =
      this.weatherDetails['v3-wx-observations-current'].dayOfWeek;
    this.currentDayData.time = `${String(this.currentTime.getHours()).padStart(
      2,
      '0'
    )}:${String(this.currentTime.getMinutes()).padStart(2, '0')}`;
    this.currentDayData.temperature =
      this.weatherDetails['v3-wx-observations-current'].temperature;
    this.currentDayData.location = `${this.locationDetails.location.city[0]},${this.locationDetails.location.country[0]}`;
    this.currentDayData.rainPercentage =
      this.weatherDetails['v3-wx-observations-current'].precip24Hour;
    this.currentDayData.summaryPhrase =
      this.weatherDetails['v3-wx-observations-current'].wxPhraseShort;
    this.currentDayData.summaryImg = this.getSummaryImage(
      this.currentDayData.summaryPhrase
    );
  }

  fillWeekData() {
    let weekCount = 0;
    while (weekCount < 7) {
      this.weekData.push(new WeekData());
      this.weekData[weekCount].day = this.weatherDetails[
        'v3-wx-forecast-daily-15day'
      ].dayOfWeek[weekCount].slice(0, 3);
      this.weekData[weekCount].tempMax =
        this.weatherDetails[
          'v3-wx-forecast-daily-15day'
        ].calendarDayTemperatureMax[weekCount];
      this.weekData[weekCount].tempMin =
        this.weatherDetails[
          'v3-wx-forecast-daily-15day'
        ].calendarDayTemperatureMin[weekCount];
      this.weekData[weekCount].summaryImg = this.getSummaryImage(
        this.weatherDetails['v3-wx-forecast-daily-15day'].narrative[weekCount]
      );
      weekCount++;
    }
  }

  fillTodaysData() {
    let todaysCount = 0;
    while (todaysCount < 7) {
      this.todaysData.push(new TodaysData());
      this.todaysData[todaysCount].time = this.weatherDetails[
        'v3-wx-forecast-hourly-10day'
      ].validTimeLocal[todaysCount].slice(11, 16);
      this.todaysData[todaysCount].temperature =
        this.weatherDetails['v3-wx-forecast-hourly-10day'].temperature[
          todaysCount
        ];
      this.todaysData[todaysCount].summaryImg = this.getSummaryImage(
        this.weatherDetails['v3-wx-forecast-hourly-10day'].wxPhraseShort[
          todaysCount
        ]
      );
      todaysCount++;
    }
  }

  getTimeFromString(localTime: string): string {
    return localTime.slice(11, 16);
  }
  fillTodaysHighlights() {
    this.todaysHighlights.airQuality =
      this.weatherDetails[
        'v3-wx-globalAirQuality'
      ].globalairquality.airQualityIndex;
    this.todaysHighlights.humidity =
      this.weatherDetails['v3-wx-observations-current'].relativeHumidity;
    this.todaysHighlights.sunrise = this.getTimeFromString(
      this.weatherDetails['v3-wx-observations-current'].sunriseTimeLocal
    );
    this.todaysHighlights.sunset = this.getTimeFromString(
      this.weatherDetails['v3-wx-observations-current'].sunsetTimeLocal
    );
    this.todaysHighlights.uvIndex =
      this.weatherDetails['v3-wx-observations-current'].uvIndex;
    this.todaysHighlights.visibility =
      this.weatherDetails['v3-wx-observations-current'].visibility;
    this.todaysHighlights.windStatus =
      this.weatherDetails['v3-wx-observations-current'].windSpeed;
  }

  getSummaryImage(summary: string): string {
    const baseAddress = 'assets/';

    const partlyCloudy = 'partly_cloudy.png';
    const rainy = 'rainy.png';
    const snowy = 'snowy.png';
    const sunny = 'sunny.png';
    const windy = 'windy.png';

    if (
      String(summary.includes('Partly Cloudy')) ||
      String(summary.includes('P Cloudy'))
    )
      return baseAddress + partlyCloudy;
    else if (String(summary.includes('rain'))) return baseAddress + rainy;
    else if (String(summary.includes('sun'))) return baseAddress + sunny;
    else if (String(summary.includes('snow'))) return baseAddress + snowy;

    return baseAddress + windy;
  }

  prepareData(): void {
    this.fillCurrentDayDataModel();
    this.fillWeekData();
    this.fillTodaysData();
    this.fillTodaysHighlights();
    console.log(this.currentDayData);
    console.log(this.weekData);
    console.log(this.todaysData);
    console.log(this.todaysHighlights);
  }

  celsiusToFahrenheit(celsius: number): number {
    return (celsius * 9) / 5 + 32;
  }

  fahrenheitToCelsius(fahrenheit: number): number {
    return ((fahrenheit - 32) * 5) / 9;
  }
  getLocationDetails(
    cityName: string,
    language: string
  ): Observable<LocationDetails> {
    return this.httpClient.get<LocationDetails>(
      environmentVars.weatherApiLocationBaseUrl,
      {
        headers: new HttpHeaders()
          .set(
            environmentVars.xRapidApiKeyName,
            environmentVars.xRapidApiKeyValue
          )
          .set(
            environmentVars.xRapidApiHostName,
            environmentVars.xRapisApiHostValue
          ),
        params: new HttpParams()
          .set('query', cityName)
          .set('language', language),
      }
    );
  }

  getWeatherReport(
    date: string,
    latitude: number,
    longitude: number,
    language: string,
    units: string
  ): Observable<WeatherDetails> {
    return this.httpClient.get<WeatherDetails>(
      environmentVars.weatherApiForecastBaseUrl,
      {
        headers: new HttpHeaders()
          .set(
            environmentVars.xRapidApiKeyName,
            environmentVars.xRapidApiKeyValue
          )
          .set(
            environmentVars.xRapidApiHostName,
            environmentVars.xRapisApiHostValue
          ),
        params: new HttpParams()
          .set('date', date)
          .set('latitude', latitude)
          .set('longitude', longitude)
          .set('language', language)
          .set('units', units),
      }
    );
  }

  getData() {
    this.todaysData = [];
    this.weekData = [];
    this.currentDayData = new CurrentDayData();
    this.todaysHighlights = new TodaysHighlights();
    let latitude = 0;
    let longitude = 0;
    this.getLocationDetails(this.cityName, this.language).subscribe({
      next: (response) => {
        this.locationDetails = response;
        latitude = this.locationDetails.location.latitude[0];
        longitude = this.locationDetails.location.longitude[0];

        this.getWeatherReport(
          this.date,
          latitude,
          longitude,
          this.language,
          this.units
        ).subscribe({
          next: (response) => {
            this.weatherDetails = response;
            this.prepareData();
          },
        });
      },
    });
  }
}
