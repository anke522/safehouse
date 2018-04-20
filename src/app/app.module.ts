import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AngularCesiumModule } from 'angular-cesium';
import { SafehouseStore } from './services/safehouse-store.service';


import { AppComponent } from './app.component';
import { SafehouseLayer } from './components/safehouse-layer/safehouse-layer.component';
import { SensorsLayerComponent } from './components/sensors-layer/sensors-layer.component';


@NgModule({
  declarations: [
    AppComponent,
    SafehouseLayer,
    SensorsLayerComponent
  ],
  imports: [
    BrowserModule,
    AngularCesiumModule.forRoot()
  ],
  providers: [SafehouseStore],
  bootstrap: [AppComponent]
})
export class AppModule { }
