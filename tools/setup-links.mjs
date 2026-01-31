/**
 * Setup script to create symlinks for Foundry VTT and dnd5e source folders.
 * These provide @client/* and @common/* path alias resolution for IDE intellisense.
 *
 * Usage:
 *   npm run setup
 *   FOUNDRY_PATH="C:/path/to/foundry" DND5E_PATH="C:/path/to/dnd5e" npm run setup
 */

import { existsSync, symlinkSync, lstatSync, readlinkSync } from 'fs';
import { resolve, join, dirname } from 'path';
import { createInterface } from 'readline';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

/** Common Foundry VTT install locations on Windows. */
const FOUNDRY_COMMON_PATHS = [
  'C:/Program Files/FoundryVTT/resources/app',
  'D:/Foundry/foundry',
  'D:/FoundryVTT/resources/app',
  `${process.env.LOCALAPPDATA}/FoundryVTT/resources/app`
];

/** Common dnd5e system locations. */
const DND5E_COMMON_PATHS = [
  'D:/Foundry/dnd5e',
  `${process.env.LOCALAPPDATA}/FoundryVTT/Data/systems/dnd5e`
];

/**
 * Prompt user for input via readline.
 * @param {string} question The prompt text
 * @returns {Promise<string>} User's response
 */
function ask(question) {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((r) => rl.question(question, (a) => { rl.close(); r(a.trim()); }));
}

/**
 * Attempt to find a path from env var, common locations, or user prompt.
 * @param {string} envVar Environment variable name to check
 * @param {string[]} commonPaths Paths to check as fallbacks
 * @param {string} name Human-readable name for prompts
 * @returns {Promise<string>} Resolved path
 */
async function resolvePath(envVar, commonPaths, name) {
  // Check env var first
  const envValue = process.env[envVar];
  if (envValue && existsSync(envValue)) {
    console.log(`  Found ${name} via ${envVar}: ${envValue}`);
    return resolve(envValue);
  }

  // Check common locations
  for (const p of commonPaths) {
    if (existsSync(p)) {
      console.log(`  Found ${name} at common location: ${p}`);
      return resolve(p);
    }
  }

  // Prompt user
  const userPath = await ask(`  ${name} not found. Enter path to ${name}: `);
  if (!userPath || !existsSync(userPath)) {
    console.error(`  Path does not exist: ${userPath || '(empty)'}`);
    process.exit(1);
  }
  return resolve(userPath);
}

/**
 * Create a directory symlink, skipping if already correct.
 * @param {string} target The source path to link to
 * @param {string} linkPath The symlink destination path
 * @param {string} name Human-readable name for logging
 */
function createLink(target, linkPath, name) {
  if (existsSync(linkPath)) {
    const stat = lstatSync(linkPath);
    if (stat.isSymbolicLink()) {
      const existing = resolve(readlinkSync(linkPath));
      if (existing === target) {
        console.log(`  ${name} symlink already correct.`);
        return;
      }
    }
    console.error(`  ${linkPath} already exists and is not the expected symlink. Remove it manually and retry.`);
    process.exit(1);
  }

  symlinkSync(target, linkPath, 'junction');
  console.log(`  Created ${name} symlink: ${linkPath} -> ${target}`);
}

// ---

console.log('Calendaria — Intellisense Setup\n');

console.log('Resolving Foundry VTT...');
const foundryPath = await resolvePath('FOUNDRY_PATH', FOUNDRY_COMMON_PATHS, 'Foundry VTT');

console.log('Resolving dnd5e...');
const dnd5ePath = await resolvePath('DND5E_PATH', DND5E_COMMON_PATHS, 'dnd5e');

console.log('\nCreating symlinks...');
createLink(foundryPath, join(ROOT, 'foundry'), 'foundry');
createLink(dnd5ePath, join(ROOT, 'dnd5e'), 'dnd5e');

console.log('\nDone! IDE intellisense for @client/* and @common/* should now work.');
