/**
 * @fileoverview Morpheus T-shirt gallery data
 * @module data/morpheusTshirts
 *
 * A curated collection of Morpheus's iconic T-shirts and jumpers from videos.
 * Community members can contribute by adding new entries via pull requests.
 */

/**
 * @typedef {Object} TshirtEntry
 * @property {string} id - Unique identifier for the T-shirt
 * @property {string} description - Description of the T-shirt/jumper
 * @property {string} [color] - Primary color of the clothing
 * @property {string} [design] - Description of any design/pattern
 * @property {string} [videoRef] - Reference to the video it appeared in
 * @property {string} [imageUrl] - URL to the image (optional, for future use)
 * @property {string} [imageData] - Base64 encoded image data (optional)
 */

/**
 * Morpheus T-shirt collection
 * @type {TshirtEntry[]}
 * @constant
 *
 * Note: This initial version contains placeholder entries.
 * Community members are encouraged to replace these with actual screenshots
 * from Morpheus's YouTube channels:
 * - Main channel: https://www.youtube.com/channel/UCkZ3fSYruC0IXv6p34BHciQ
 * - Tutorial channel: https://www.youtube.com/channel/UCLGY6_j7kZfA1dmmjR1J_7w
 *
 * To add real images:
 * 1. Take a screenshot from a video
 * 2. Crop to show Morpheus and his clothing
 * 3. Resize to reasonable dimensions (e.g., 400x600)
 * 4. Either:
 *    a) Host the image and add the URL to imageUrl field, or
 *    b) Convert to base64 and add to imageData field
 * 5. Submit a pull request with the update
 */
export const MORPHEUS_TSHIRTS = [
  {
    id: 'tshirt-001',
    description: 'Classic black hoodie with tech-inspired design',
    color: 'black',
    design: 'Minimalist tech logo',
    videoRef: 'Placeholder - awaiting community contribution'
  },
  {
    id: 'tshirt-002',
    description: 'Navy blue coding-themed T-shirt',
    color: 'navy blue',
    design: 'Programming syntax print',
    videoRef: 'Placeholder - awaiting community contribution'
  },
  {
    id: 'tshirt-003',
    description: 'Dark grey jumper with subtle pattern',
    color: 'dark grey',
    design: 'Geometric pattern',
    videoRef: 'Placeholder - awaiting community contribution'
  },
  {
    id: 'tshirt-004',
    description: 'Black T-shirt with Matrix-inspired green code',
    color: 'black',
    design: 'Green matrix code',
    videoRef: 'Placeholder - awaiting community contribution'
  },
  {
    id: 'tshirt-005',
    description: 'Charcoal hoodie with developer motto',
    color: 'charcoal',
    design: 'Developer quote print',
    videoRef: 'Placeholder - awaiting community contribution'
  },
  {
    id: 'tshirt-006',
    description: 'Wine red sweater, casual style',
    color: 'wine red',
    design: 'Solid color',
    videoRef: 'Placeholder - awaiting community contribution'
  },
  {
    id: 'tshirt-007',
    description: 'Forest green T-shirt with Linux penguin',
    color: 'forest green',
    design: 'Linux Tux mascot',
    videoRef: 'Placeholder - awaiting community contribution'
  },
  {
    id: 'tshirt-008',
    description: 'Black zip-up hoodie with cybersecurity theme',
    color: 'black',
    design: 'Cybersecurity graphics',
    videoRef: 'Placeholder - awaiting community contribution'
  },
  {
    id: 'tshirt-009',
    description: 'Steel blue T-shirt with binary code pattern',
    color: 'steel blue',
    design: 'Binary code pattern',
    videoRef: 'Placeholder - awaiting community contribution'
  },
  {
    id: 'tshirt-010',
    description: 'Dark purple jumper with abstract design',
    color: 'dark purple',
    design: 'Abstract tech pattern',
    videoRef: 'Placeholder - awaiting community contribution'
  },
  {
    id: 'tshirt-011',
    description: 'Olive green military-style jacket',
    color: 'olive green',
    design: 'Military utility style',
    videoRef: 'Placeholder - awaiting community contribution'
  },
  {
    id: 'tshirt-012',
    description: 'Burgundy sweater with retro computing graphics',
    color: 'burgundy',
    design: 'Retro computer graphics',
    videoRef: 'Placeholder - awaiting community contribution'
  }
];

/**
 * Get a random T-shirt for the current day
 * Uses localStorage to ensure the same T-shirt is shown throughout the day
 * @returns {TshirtEntry} The T-shirt of the day
 * @export
 */
export function getTshirtOfTheDay() {
  const today = new Date().toDateString();
  const stored = localStorage.getItem('morpheus-tshirt-of-day');

  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      if (parsed.date === today && parsed.tshirt) {
        // Return stored T-shirt if it's still today
        return parsed.tshirt;
      }
    } catch (e) {
      // Invalid stored data, continue to select new one
    }
  }

  // Select new T-shirt for today
  // Use date as seed for deterministic randomness
  const dateNumber = new Date().setHours(0, 0, 0, 0);
  const index = dateNumber % MORPHEUS_TSHIRTS.length;
  const tshirt = MORPHEUS_TSHIRTS[index];

  // Store for the day
  localStorage.setItem('morpheus-tshirt-of-day', JSON.stringify({
    date: today,
    tshirt: tshirt
  }));

  return tshirt;
}

/**
 * Get all T-shirts in the collection
 * @returns {TshirtEntry[]} All T-shirts
 * @export
 */
export function getAllTshirts() {
  return [...MORPHEUS_TSHIRTS];
}

/**
 * Get a random T-shirt (not necessarily the daily one)
 * @returns {TshirtEntry} A random T-shirt
 * @export
 */
export function getRandomTshirt() {
  const index = Math.floor(Math.random() * MORPHEUS_TSHIRTS.length);
  return MORPHEUS_TSHIRTS[index];
}
