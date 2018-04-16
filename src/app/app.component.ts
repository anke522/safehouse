import { Component } from '@angular/core';
import { MapLayerProviderOptions } from 'angular-cesium'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  MapLayerProviderOptions = MapLayerProviderOptions;
}
