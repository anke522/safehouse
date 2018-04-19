import { Component, ViewEncapsulation } from '@angular/core';
import { MapLayerProviderOptions, ViewerConfiguration } from 'angular-cesium';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [ViewerConfiguration],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent {
  title = 'app';
  MapLayerProviderOptions = MapLayerProviderOptions;

  constructor(viewerConfig: ViewerConfiguration){
    viewerConfig.viewerOptions = {baseLayerPicker : true, geocoder : false,}
  }
}
