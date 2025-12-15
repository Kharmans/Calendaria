/**
 * Procedural weather generation based on climate zones and seasons.
 * Uses weighted random selection with optional seeded randomness.
 *
 * @module Weather/WeatherGenerator
 * @author Tyler
 */

import { getWeatherProbabilities, getTemperatureRange, normalizeSeasonName } from './climate-data.mjs';
import { getPreset, getAllPresets } from './weather-presets.mjs';

/**
 * Seeded random number generator (mulberry32).
 * @param {number} seed - Seed value
 * @returns {function} Random function returning 0-1
 */
function seededRandom(seed) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Generate a seed from date components.
 * @param {number} year - Year
 * @param {number} month - Month (0-indexed)
 * @param {number} day - Day of month
 * @returns {number} Seed value
 */
export function dateSeed(year, month, day) {
  return year * 10000 + month * 100 + day;
}

/**
 * Select a random item from weighted options.
 * @param {object} weights - Object mapping IDs to weights
 * @param {function} [randomFn=Math.random] - Random function
 * @returns {string} Selected ID
 */
function weightedSelect(weights, randomFn = Math.random) {
  const entries = Object.entries(weights);
  if (entries.length === 0) return null;

  const totalWeight = entries.reduce((sum, [, w]) => sum + w, 0);
  if (totalWeight <= 0) return entries[0][0];

  let roll = randomFn() * totalWeight;

  for (const [id, weight] of entries) {
    roll -= weight;
    if (roll <= 0) return id;
  }

  return entries[entries.length - 1][0];
}

/**
 * Generate weather for a given climate and season.
 * @param {object} options - Generation options
 * @param {string} options.climate - Climate zone ID
 * @param {string} [options.season] - Season name
 * @param {number} [options.seed] - Random seed for deterministic generation
 * @param {object[]} [options.customPresets=[]] - Custom weather presets
 * @returns {object} Generated weather { preset, temperature }
 */
export function generateWeather({ climate, season, seed, customPresets = [] }) {
  const randomFn = seed != null ? seededRandom(seed) : Math.random;

  // Get weather probabilities for this climate/season
  const probabilities = getWeatherProbabilities(climate, normalizeSeasonName(season));

  // Select weather type
  const weatherId = weightedSelect(probabilities, randomFn);

  // Get the preset
  const preset = getPreset(weatherId, customPresets);

  // Generate temperature
  const tempRange = getTemperatureRange(climate, normalizeSeasonName(season));
  const temperature = Math.round(tempRange.min + randomFn() * (tempRange.max - tempRange.min));

  return {
    preset: preset || { id: weatherId, label: weatherId, icon: 'fa-question', color: '#888888' },
    temperature
  };
}

/**
 * Generate weather for a specific date.
 * Uses date-based seeding for consistent results.
 * @param {object} options - Generation options
 * @param {string} options.climate - Climate zone ID
 * @param {string} [options.season] - Season name
 * @param {number} options.year - Year
 * @param {number} options.month - Month (0-indexed)
 * @param {number} options.day - Day of month
 * @param {object[]} [options.customPresets=[]] - Custom weather presets
 * @returns {object} Generated weather
 */
export function generateWeatherForDate({ climate, season, year, month, day, customPresets = [] }) {
  const seed = dateSeed(year, month, day);
  return generateWeather({ climate, season, seed, customPresets });
}

/**
 * Generate a forecast for multiple days.
 * @param {object} options - Generation options
 * @param {string} options.climate - Climate zone ID
 * @param {string} [options.season] - Season name (assumed constant for forecast period)
 * @param {number} options.startYear - Starting year
 * @param {number} options.startMonth - Starting month (0-indexed)
 * @param {number} options.startDay - Starting day
 * @param {number} [options.days=7] - Number of days to forecast
 * @param {object[]} [options.customPresets=[]] - Custom weather presets
 * @param {function} [options.getSeasonForDate] - Function to get season for a date
 * @returns {object[]} Array of weather forecasts
 */
export function generateForecast({
  climate,
  season,
  startYear,
  startMonth,
  startDay,
  days = 7,
  customPresets = [],
  getSeasonForDate
}) {
  const forecast = [];

  // Simple date iteration (doesn't handle month boundaries perfectly)
  // In production, use calendar's date math
  let year = startYear;
  let month = startMonth;
  let day = startDay;

  for (let i = 0; i < days; i++) {
    const currentSeason = getSeasonForDate ? getSeasonForDate(year, month, day) : season;
    const weather = generateWeatherForDate({
      climate,
      season: currentSeason,
      year,
      month,
      day,
      customPresets
    });

    forecast.push({
      year,
      month,
      day,
      ...weather
    });

    // Increment day (simplified - proper implementation uses calendar)
    day++;
  }

  return forecast;
}

/**
 * Apply weather transition smoothing.
 * Reduces jarring weather changes by considering previous weather.
 * @param {string} currentWeatherId - Current weather ID
 * @param {object} probabilities - Base probabilities
 * @param {number} [inertia=0.3] - How much to favor current weather (0-1)
 * @returns {object} Adjusted probabilities
 */
export function applyWeatherInertia(currentWeatherId, probabilities, inertia = 0.3) {
  if (!currentWeatherId || !probabilities[currentWeatherId]) return probabilities;

  const adjusted = { ...probabilities };
  const currentWeight = adjusted[currentWeatherId] || 0;
  const totalOther = Object.values(adjusted).reduce((sum, w) => sum + w, 0) - currentWeight;

  // Boost current weather, reduce others proportionally
  if (totalOther > 0) {
    const boost = totalOther * inertia;
    adjusted[currentWeatherId] = currentWeight + boost;

    for (const id of Object.keys(adjusted)) {
      if (id !== currentWeatherId) {
        adjusted[id] *= 1 - inertia;
      }
    }
  }

  return adjusted;
}
