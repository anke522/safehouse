import { Injectable } from '@angular/core';

@Injectable()
export class AlertService {
  private alertSound = new Audio('assets/sound/alert.WAV');

  constructor() {
    this.alertSound.volume = 0;
    this.alertSound.play();
  }

  playAlert(volume = 1.0) {
    this.alertSound.volume = volume;
    this.alertSound.currentTime = 0;
    this.alertSound.play();
  }

  toggleMute(){
    this.alertSound.muted = !this.alertSound.muted;
  }
}
