import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AngularCesiumModule } from 'angular-cesium';
import { SafehouseStore } from './services/safehouse-store.service';


import { AppComponent } from './app.component';
import { SafehouseLayer } from './components/safehouse-layer/safehouse-layer.component';


@NgModule({
  declarations: [
    AppComponent,
    SafehouseLayer
  ],
  imports: [
    BrowserModule,
    AngularCesiumModule.forRoot()
  ],
  providers: [SafehouseStore],
  bootstrap: [AppComponent]
})
export class AppModule { }
