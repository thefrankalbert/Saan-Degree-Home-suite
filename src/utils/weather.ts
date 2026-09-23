export interface WeatherData {
  city: string;
  temp: number;
  condition: string;
  icon: 'sun' | 'cloud' | 'cloud-rain' | 'snowflake' | 'cloud-sun';
  humidity: number;
  windSpeed: number;
  high: number;
  low: number;
}

export function getEstimatedWeather(city: string): WeatherData {
  const normalized = city.toLowerCase();
  if (normalized.includes('ouaga') || normalized.includes('burkina')) {
    return {
      city: 'Ouagadougou',
      temp: 32,
      condition: 'Chaleur Agréable & Ciel Dégagé',
      icon: 'sun',
      humidity: 42,
      windSpeed: 12,
      high: 35,
      low: 24
    };
  }
  if (normalized.includes('cham') || normalized.includes('alpes') || normalized.includes('mont')) {
    return {
      city,
      temp: 14,
      condition: 'Frais & Ciel Dégagé',
      icon: 'cloud-sun',
      humidity: 58,
      windSpeed: 11,
      high: 17,
      low: 6
    };
  }
  if (normalized.includes('cannes') || normalized.includes('nice') || normalized.includes('azur') || normalized.includes('marseille')) {
    return {
      city,
      temp: 24,
      condition: 'Ensoleillé',
      icon: 'sun',
      humidity: 48,
      windSpeed: 14,
      high: 26,
      low: 18
    };
  }
  // Default (Paris, Bordeaux, Lyon, etc.)
  return {
    city,
    temp: 19,
    condition: 'Éclaircies agréables',
    icon: 'cloud-sun',
    humidity: 55,
    windSpeed: 16,
    high: 22,
    low: 13
  };
}
