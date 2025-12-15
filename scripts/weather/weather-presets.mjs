/**
 * Built-in weather presets for the Calendaria weather system.
 * GMs can add custom presets via settings.
 *
 * @module Weather/WeatherPresets
 * @author Tyler
 */

/**
 * Standard weather conditions - common everyday weather.
 * @type {object[]}
 */
export const STANDARD_WEATHER = [
  {
    id: 'clear',
    label: 'CALENDARIA.Weather.Clear',
    description: 'CALENDARIA.Weather.ClearDesc',
    icon: 'fa-sun',
    color: '#FFEE88',
    category: 'standard'
  },
  {
    id: 'partly-cloudy',
    label: 'CALENDARIA.Weather.PartlyCloudy',
    description: 'CALENDARIA.Weather.PartlyCloudyDesc',
    icon: 'fa-cloud-sun',
    color: '#D0E8FF',
    category: 'standard'
  },
  {
    id: 'cloudy',
    label: 'CALENDARIA.Weather.Cloudy',
    description: 'CALENDARIA.Weather.CloudyDesc',
    icon: 'fa-cloud',
    color: '#B0C4DE',
    category: 'standard'
  },
  {
    id: 'overcast',
    label: 'CALENDARIA.Weather.Overcast',
    description: 'CALENDARIA.Weather.OvercastDesc',
    icon: 'fa-smog',
    color: '#CCCCCC',
    category: 'standard'
  },
  {
    id: 'drizzle',
    label: 'CALENDARIA.Weather.Drizzle',
    description: 'CALENDARIA.Weather.DrizzleDesc',
    icon: 'fa-cloud-rain',
    color: '#CDEFFF',
    category: 'standard'
  },
  {
    id: 'rain',
    label: 'CALENDARIA.Weather.Rain',
    description: 'CALENDARIA.Weather.RainDesc',
    icon: 'fa-cloud-showers-heavy',
    color: '#A0D8EF',
    category: 'standard'
  },
  {
    id: 'fog',
    label: 'CALENDARIA.Weather.Fog',
    description: 'CALENDARIA.Weather.FogDesc',
    icon: 'fa-smog',
    color: '#E6E6E6',
    category: 'standard'
  },
  {
    id: 'mist',
    label: 'CALENDARIA.Weather.Mist',
    description: 'CALENDARIA.Weather.MistDesc',
    icon: 'fa-water',
    color: '#F0F8FF',
    category: 'standard'
  },
  {
    id: 'windy',
    label: 'CALENDARIA.Weather.Windy',
    description: 'CALENDARIA.Weather.WindyDesc',
    icon: 'fa-wind',
    color: '#E0F7FA',
    category: 'standard'
  },
  {
    id: 'sunshower',
    label: 'CALENDARIA.Weather.Sunshower',
    description: 'CALENDARIA.Weather.SunshowerDesc',
    icon: 'fa-cloud-sun-rain',
    color: '#FCEABB',
    category: 'standard'
  }
];

/**
 * Severe weather conditions - dangerous or extreme weather.
 * @type {object[]}
 */
export const SEVERE_WEATHER = [
  {
    id: 'thunderstorm',
    label: 'CALENDARIA.Weather.Thunderstorm',
    description: 'CALENDARIA.Weather.ThunderstormDesc',
    icon: 'fa-bolt',
    color: '#FFD966',
    category: 'severe'
  },
  {
    id: 'blizzard',
    label: 'CALENDARIA.Weather.Blizzard',
    description: 'CALENDARIA.Weather.BlizzardDesc',
    icon: 'fa-snowman',
    color: '#E0F7FF',
    category: 'severe'
  },
  {
    id: 'snow',
    label: 'CALENDARIA.Weather.Snow',
    description: 'CALENDARIA.Weather.SnowDesc',
    icon: 'fa-snowflake',
    color: '#FFFFFF',
    category: 'severe'
  },
  {
    id: 'hail',
    label: 'CALENDARIA.Weather.Hail',
    description: 'CALENDARIA.Weather.HailDesc',
    icon: 'fa-cloud-meatball',
    color: '#D1EFFF',
    category: 'severe'
  },
  {
    id: 'tornado',
    label: 'CALENDARIA.Weather.Tornado',
    description: 'CALENDARIA.Weather.TornadoDesc',
    icon: 'fa-poo-storm',
    color: '#FFD1DC',
    category: 'severe'
  },
  {
    id: 'hurricane',
    label: 'CALENDARIA.Weather.Hurricane',
    description: 'CALENDARIA.Weather.HurricaneDesc',
    icon: 'fa-hurricane',
    color: '#FFE599',
    category: 'severe'
  }
];

/**
 * Environmental weather conditions - location-specific phenomena.
 * @type {object[]}
 */
export const ENVIRONMENTAL_WEATHER = [
  {
    id: 'ashfall',
    label: 'CALENDARIA.Weather.Ashfall',
    description: 'CALENDARIA.Weather.AshfallDesc',
    icon: 'fa-cloud',
    color: '#DADADA',
    category: 'environmental'
  },
  {
    id: 'sandstorm',
    label: 'CALENDARIA.Weather.Sandstorm',
    description: 'CALENDARIA.Weather.SandstormDesc',
    icon: 'fa-cloud-sun',
    color: '#F4E1A1',
    category: 'environmental'
  },
  {
    id: 'luminous-sky',
    label: 'CALENDARIA.Weather.LuminousSky',
    description: 'CALENDARIA.Weather.LuminousSkyDesc',
    icon: 'fa-star',
    color: '#E0BBFF',
    category: 'environmental'
  }
];

/**
 * Fantasy weather conditions - magical or supernatural phenomena.
 * @type {object[]}
 */
export const FANTASY_WEATHER = [
  {
    id: 'black-sun',
    label: 'CALENDARIA.Weather.BlackSun',
    description: 'CALENDARIA.Weather.BlackSunDesc',
    icon: 'fa-sun',
    color: '#4A4A4A',
    category: 'fantasy'
  },
  {
    id: 'ley-surge',
    label: 'CALENDARIA.Weather.LeySurge',
    description: 'CALENDARIA.Weather.LeySurgeDesc',
    icon: 'fa-bolt',
    color: '#B3E5FC',
    category: 'fantasy'
  },
  {
    id: 'aether-haze',
    label: 'CALENDARIA.Weather.AetherHaze',
    description: 'CALENDARIA.Weather.AetherHazeDesc',
    icon: 'fa-smog',
    color: '#E6CCFF',
    category: 'fantasy'
  },
  {
    id: 'nullfront',
    label: 'CALENDARIA.Weather.Nullfront',
    description: 'CALENDARIA.Weather.NullfrontDesc',
    icon: 'fa-ban',
    color: '#808080',
    category: 'fantasy'
  },
  {
    id: 'permafrost-surge',
    label: 'CALENDARIA.Weather.PermafrostSurge',
    description: 'CALENDARIA.Weather.PermafrostSurgeDesc',
    icon: 'fa-icicles',
    color: '#D0FFFF',
    category: 'fantasy'
  },
  {
    id: 'gravewind',
    label: 'CALENDARIA.Weather.Gravewind',
    description: 'CALENDARIA.Weather.GravewindDesc',
    icon: 'fa-wind',
    color: '#C9C9FF',
    category: 'fantasy'
  },
  {
    id: 'veilfall',
    label: 'CALENDARIA.Weather.Veilfall',
    description: 'CALENDARIA.Weather.VeilfallDesc',
    icon: 'fa-water',
    color: '#E0F7F9',
    category: 'fantasy'
  },
  {
    id: 'arcane',
    label: 'CALENDARIA.Weather.Arcane',
    description: 'CALENDARIA.Weather.ArcaneDesc',
    icon: 'fa-wind',
    color: '#FFFACD',
    category: 'fantasy'
  }
];

/**
 * All built-in weather presets combined.
 * @type {object[]}
 */
export const ALL_PRESETS = [...STANDARD_WEATHER, ...SEVERE_WEATHER, ...ENVIRONMENTAL_WEATHER, ...FANTASY_WEATHER];

/**
 * Weather categories for organizing presets.
 * @type {object}
 */
export const WEATHER_CATEGORIES = {
  standard: {
    id: 'standard',
    label: 'CALENDARIA.Weather.Category.Standard'
  },
  severe: {
    id: 'severe',
    label: 'CALENDARIA.Weather.Category.Severe'
  },
  environmental: {
    id: 'environmental',
    label: 'CALENDARIA.Weather.Category.Environmental'
  },
  fantasy: {
    id: 'fantasy',
    label: 'CALENDARIA.Weather.Category.Fantasy'
  },
  custom: {
    id: 'custom',
    label: 'CALENDARIA.Weather.Category.Custom'
  }
};

/**
 * Get a weather preset by ID.
 * @param {string} id - Weather preset ID
 * @param {object[]} [customPresets=[]] - Custom presets to search
 * @returns {object|null} Weather preset or null
 */
export function getPreset(id, customPresets = []) {
  return ALL_PRESETS.find((p) => p.id === id) || customPresets.find((p) => p.id === id) || null;
}

/**
 * Get all weather presets including custom ones.
 * @param {object[]} [customPresets=[]] - Custom presets to include
 * @returns {object[]} All presets
 */
export function getAllPresets(customPresets = []) {
  return [...ALL_PRESETS, ...customPresets];
}

/**
 * Get presets by category.
 * @param {string} category - Category ID
 * @param {object[]} [customPresets=[]] - Custom presets to include
 * @returns {object[]} Presets in category
 */
export function getPresetsByCategory(category, customPresets = []) {
  const all = getAllPresets(customPresets);
  return all.filter((p) => p.category === category);
}

/**
 * STK weather ID to Calendaria ID mapping for imports.
 * @type {object}
 */
export const STK_WEATHER_MAP = {
  clear: 'clear',
  partlyCloudy: 'partly-cloudy',
  cloudy: 'cloudy',
  overcast: 'overcast',
  rain: 'rain',
  thunderstorm: 'thunderstorm',
  drizzle: 'drizzle',
  snow: 'snow',
  blizzard: 'blizzard',
  hail: 'hail',
  fog: 'fog',
  mist: 'mist',
  windy: 'windy',
  tornado: 'tornado',
  hurricane: 'hurricane',
  ashfall: 'ashfall',
  sandstorm: 'sandstorm',
  luminousSky: 'luminous-sky',
  sunshower: 'sunshower',
  // Fantasy mappings (approximate)
  bloodRain: null, // No equivalent - will create custom
  manaStorm: 'ley-surge',
  arcaneFog: 'aether-haze',
  voidstorm: 'gravewind',
  celestialEclipse: 'black-sun',
  meteorShower: null, // No equivalent - will create custom
  frozenHell: 'permafrost-surge',
  spectralStorm: 'gravewind',
  etherealDrizzle: 'veilfall',
  wildMagicWinds: 'arcane'
};
