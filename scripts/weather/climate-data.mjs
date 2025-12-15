/**
 * Climate zone definitions for procedural weather generation.
 * Each climate defines temperature ranges and weather probabilities by season.
 *
 * @module Weather/ClimateData
 * @author Tyler
 */

/**
 * Climate zone definitions.
 * Weather probabilities are relative weights (higher = more likely).
 *
 * @type {object}
 */
export const CLIMATE_ZONES = {
  tropical: {
    id: 'tropical',
    label: 'CALENDARIA.Weather.Climate.Tropical',
    description: 'CALENDARIA.Weather.Climate.TropicalDesc',
    temperature: {
      default: { min: 24, max: 35 }
    },
    weather: {
      default: {
        clear: 8,
        'partly-cloudy': 5,
        rain: 7,
        thunderstorm: 3,
        fog: 2,
        sunshower: 1
      }
    }
  },

  subtropical: {
    id: 'subtropical',
    label: 'CALENDARIA.Weather.Climate.Subtropical',
    description: 'CALENDARIA.Weather.Climate.SubtropicalDesc',
    temperature: {
      summer: { min: 15, max: 32 },
      winter: { min: 5, max: 17 },
      default: { min: 10, max: 25 }
    },
    weather: {
      summer: {
        clear: 5,
        'partly-cloudy': 4,
        rain: 5,
        drizzle: 2,
        sunshower: 1
      },
      winter: {
        clear: 2,
        cloudy: 4,
        rain: 3,
        mist: 2,
        fog: 1
      },
      default: {
        clear: 4,
        'partly-cloudy': 5,
        cloudy: 3,
        rain: 2
      }
    }
  },

  temperate: {
    id: 'temperate',
    label: 'CALENDARIA.Weather.Climate.Temperate',
    description: 'CALENDARIA.Weather.Climate.TemperateDesc',
    temperature: {
      summer: { min: 18, max: 30 },
      winter: { min: -5, max: 5 },
      spring: { min: 8, max: 18 },
      autumn: { min: 8, max: 18 },
      default: { min: 8, max: 20 }
    },
    weather: {
      summer: {
        clear: 6,
        'partly-cloudy': 4,
        thunderstorm: 2,
        rain: 2
      },
      winter: {
        snow: 5,
        blizzard: 2,
        fog: 2,
        overcast: 3,
        clear: 2
      },
      spring: {
        rain: 4,
        drizzle: 3,
        'partly-cloudy': 3,
        clear: 2,
        mist: 2
      },
      autumn: {
        cloudy: 4,
        rain: 3,
        fog: 3,
        'partly-cloudy': 2,
        windy: 2
      },
      default: {
        rain: 3,
        cloudy: 3,
        mist: 2,
        drizzle: 2,
        clear: 3
      }
    }
  },

  polar: {
    id: 'polar',
    label: 'CALENDARIA.Weather.Climate.Polar',
    description: 'CALENDARIA.Weather.Climate.PolarDesc',
    temperature: {
      summer: { min: -5, max: 10 },
      winter: { min: -40, max: -10 },
      default: { min: -15, max: 0 }
    },
    weather: {
      summer: {
        clear: 4,
        'partly-cloudy': 3,
        windy: 2,
        mist: 1,
        snow: 2
      },
      winter: {
        blizzard: 6,
        snow: 5,
        overcast: 2,
        windy: 3
      },
      default: {
        snow: 4,
        overcast: 3,
        blizzard: 2,
        windy: 2,
        clear: 1
      }
    }
  }
};

/**
 * Get a climate zone by ID.
 * @param {string} id - Climate zone ID
 * @returns {object|null} Climate zone or null
 */
export function getClimateZone(id) {
  return CLIMATE_ZONES[id] ?? null;
}

/**
 * Get all climate zone IDs.
 * @returns {string[]} Climate zone IDs
 */
export function getClimateZoneIds() {
  return Object.keys(CLIMATE_ZONES);
}

/**
 * Get weather probabilities for a climate and season.
 * Falls back to 'default' if season not defined.
 * @param {string} climateId - Climate zone ID
 * @param {string} [season] - Season name (spring, summer, autumn, winter)
 * @returns {object} Weather probabilities map
 */
export function getWeatherProbabilities(climateId, season) {
  const climate = getClimateZone(climateId);
  if (!climate) return {};

  const seasonLower = season?.toLowerCase();
  return climate.weather[seasonLower] ?? climate.weather.default ?? {};
}

/**
 * Get temperature range for a climate and season.
 * Falls back to 'default' if season not defined.
 * @param {string} climateId - Climate zone ID
 * @param {string} [season] - Season name
 * @returns {object} Temperature range { min, max }
 */
export function getTemperatureRange(climateId, season) {
  const climate = getClimateZone(climateId);
  if (!climate) return { min: 10, max: 20 };

  const seasonLower = season?.toLowerCase();
  return climate.temperature[seasonLower] ?? climate.temperature.default ?? { min: 10, max: 20 };
}

/**
 * Normalize season name to match climate data keys.
 * @param {string} seasonName - Season name (may be localized)
 * @returns {string} Normalized season key
 */
export function normalizeSeasonName(seasonName) {
  if (!seasonName) return 'default';

  const lower = seasonName.toLowerCase();

  // Common mappings
  if (lower.includes('spring') || lower.includes('vernal')) return 'spring';
  if (lower.includes('summer') || lower.includes('estival')) return 'summer';
  if (lower.includes('autumn') || lower.includes('fall') || lower.includes('autumnal')) return 'autumn';
  if (lower.includes('winter') || lower.includes('hibernal')) return 'winter';

  return 'default';
}
