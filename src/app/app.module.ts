import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AngularCesiumModule } from 'angular-cesium';
import { SafehouseStore } from './services/safehouse-store.service';


import { AppComponent } from './app.component';
import { BuildingsLayer } from './components/buildings-layer/buildings-layer.component';


@NgModule({
  declarations: [
    AppComponent,
    BuildingsLayer
  ],
  imports: [
    BrowserModule,
    AngularCesiumModule.forRoot()
  ],
  providers: [SafehouseStore],
  bootstrap: [AppComponent]
})
export class AppModule { }
