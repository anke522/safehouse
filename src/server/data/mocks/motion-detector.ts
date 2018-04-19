import { SensorStatus, SensorType, Position, Sensor } from '../models';

const motionDetector: Sensor = {
  id: 'motion-detector',
  type: SensorType.Camera,
  name: 'Motion Detector',
  status: SensorStatus.Normal,
  message: '',
  position: {
    lon: -82.4374762 + 0.0000340,
    lat: 27.9561611 + 0.0000310,
    alt: 1.2,
  },
  related: ['access-point']
};

export interface MotionDetectorOptions {
  id?: string;
  type?: SensorType;
  name?: string;
  status?: SensorStatus;
  position?: Position;
  message?: string;
  related?: string[];
}

export const getMotionDetector = ({id, type, name, status, message, position, related}: MotionDetectorOptions = {}): Sensor => ({
  id: id || motionDetector.id,
  type: type || motionDetector.type,
  name: name || motionDetector.name,
  status: status || motionDetector.status,
  message: message || motionDetector.message,
  related: related || motionDetector.related.slice(0),
  position: position || {
    lat: motionDetector.position.lat,
    lon: motionDetector.position.lon,
    alt: motionDetector.position.alt
  },
});
