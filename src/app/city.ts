import { City } from '../models';
import { cityRepository } from '../repos';

export const getCities = (): Promise<City[]> => {
  return cityRepository.find();
};
