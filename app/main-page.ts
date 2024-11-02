import { EventData, Page } from '@nativescript/core';
import { WeatherViewModel } from './view-models/weather-view-model';

export function navigatingTo(args: EventData) {
  const page = <Page>args.object;
  page.bindingContext = new WeatherViewModel();
}