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

  constructor(viewerConfig: ViewerConfiguration) {
    viewerConfig.viewerOptions = {
      timeline : false,
      baseLayerPicker : false,
      animation : false,
      homeButton : false,
      geocoder : false,
      navigationHelpButton : false,
      navigationInstructionsInitiallyVisible : false,
    };

    viewerConfig.viewerModifier = (viewer: any) => {
      viewer.bottomContainer.remove();
    };
  }
}
