import { Location } from '../models';
import { locationRepository } from '../repos';

export const getLocations = (): Promise<Location[]> => {
  return locationRepository.find();
};
