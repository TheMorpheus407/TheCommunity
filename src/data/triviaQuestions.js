/**
 * @fileoverview German trivia questions database for the quiz minigame
 * @module data/triviaQuestions
 *
 * Questions are organized by category with multiple-choice answers.
 * Each question has exactly 4 options with one correct answer.
 */

/**
 * @typedef {Object} TriviaQuestion
 * @property {string} question - The question text
 * @property {string[]} options - Array of 4 possible answers
 * @property {number} correctAnswer - Index (0-3) of the correct answer
 * @property {string} category - Category of the question
 */

/**
 * Complete trivia question pool (German language)
 * @type {TriviaQuestion[]}
 * @constant
 */
export const TRIVIA_QUESTIONS = [
  // Geographie
  {
    question: 'Welche ist die Hauptstadt von Deutschland?',
    options: ['München', 'Berlin', 'Hamburg', 'Frankfurt'],
    correctAnswer: 1,
    category: 'Geographie'
  },
  {
    question: 'Welcher ist der längste Fluss Deutschlands?',
    options: ['Elbe', 'Donau', 'Rhein', 'Main'],
    correctAnswer: 2,
    category: 'Geographie'
  },
  {
    question: 'Wie viele Bundesländer hat Deutschland?',
    options: ['12', '14', '16', '18'],
    correctAnswer: 2,
    category: 'Geographie'
  },
  {
    question: 'Welches Land grenzt NICHT an Deutschland?',
    options: ['Frankreich', 'Niederlande', 'Italien', 'Polen'],
    correctAnswer: 2,
    category: 'Geographie'
  },
  {
    question: 'In welcher Stadt steht der Kölner Dom?',
    options: ['Köln', 'Düsseldorf', 'Bonn', 'Aachen'],
    correctAnswer: 0,
    category: 'Geographie'
  },

  // Geschichte
  {
    question: 'In welchem Jahr fiel die Berliner Mauer?',
    options: ['1987', '1989', '1990', '1991'],
    correctAnswer: 1,
    category: 'Geschichte'
  },
  {
    question: 'Wer war der erste Bundeskanzler der Bundesrepublik Deutschland?',
    options: ['Willy Brandt', 'Konrad Adenauer', 'Helmut Schmidt', 'Ludwig Erhard'],
    correctAnswer: 1,
    category: 'Geschichte'
  },
  {
    question: 'In welchem Jahr wurde die Bundesrepublik Deutschland gegründet?',
    options: ['1945', '1947', '1949', '1950'],
    correctAnswer: 2,
    category: 'Geschichte'
  },
  {
    question: 'Wer erfand den Buchdruck mit beweglichen Lettern?',
    options: ['Johannes Gutenberg', 'Martin Luther', 'Albrecht Dürer', 'Leonardo da Vinci'],
    correctAnswer: 0,
    category: 'Geschichte'
  },
  {
    question: 'Wann begann der Erste Weltkrieg?',
    options: ['1912', '1914', '1916', '1918'],
    correctAnswer: 1,
    category: 'Geschichte'
  },

  // Wissenschaft
  {
    question: 'Welches chemische Element hat das Symbol "O"?',
    options: ['Gold', 'Silber', 'Sauerstoff', 'Osmium'],
    correctAnswer: 2,
    category: 'Wissenschaft'
  },
  {
    question: 'Wie viele Planeten hat unser Sonnensystem?',
    options: ['7', '8', '9', '10'],
    correctAnswer: 1,
    category: 'Wissenschaft'
  },
  {
    question: 'Wer entwickelte die Relativitätstheorie?',
    options: ['Isaac Newton', 'Albert Einstein', 'Galileo Galilei', 'Max Planck'],
    correctAnswer: 1,
    category: 'Wissenschaft'
  },
  {
    question: 'Was ist die Lichtgeschwindigkeit im Vakuum?',
    options: ['150.000 km/s', '200.000 km/s', '300.000 km/s', '400.000 km/s'],
    correctAnswer: 2,
    category: 'Wissenschaft'
  },
  {
    question: 'Welches ist das größte Organ des menschlichen Körpers?',
    options: ['Leber', 'Herz', 'Haut', 'Gehirn'],
    correctAnswer: 2,
    category: 'Wissenschaft'
  },

  // Kultur & Kunst
  {
    question: 'Wer schrieb "Faust"?',
    options: ['Friedrich Schiller', 'Johann Wolfgang von Goethe', 'Heinrich Heine', 'Thomas Mann'],
    correctAnswer: 1,
    category: 'Kultur & Kunst'
  },
  {
    question: 'Welcher Komponist wurde taub?',
    options: ['Mozart', 'Bach', 'Beethoven', 'Wagner'],
    correctAnswer: 2,
    category: 'Kultur & Kunst'
  },
  {
    question: 'In welcher Stadt befindet sich die "Mona Lisa"?',
    options: ['Rom', 'Berlin', 'Paris', 'London'],
    correctAnswer: 2,
    category: 'Kultur & Kunst'
  },
  {
    question: 'Wer malte "Die Sternennacht"?',
    options: ['Pablo Picasso', 'Vincent van Gogh', 'Claude Monet', 'Salvador Dalí'],
    correctAnswer: 1,
    category: 'Kultur & Kunst'
  },
  {
    question: 'Welches Instrument spielte Mozart?',
    options: ['Nur Klavier', 'Klavier und Violine', 'Nur Violine', 'Flöte'],
    correctAnswer: 1,
    category: 'Kultur & Kunst'
  },

  // Sport
  {
    question: 'Wie oft hat Deutschland die Fußball-WM gewonnen?',
    options: ['2 Mal', '3 Mal', '4 Mal', '5 Mal'],
    correctAnswer: 2,
    category: 'Sport'
  },
  {
    question: 'Welche Sportart wird beim "Wimbledon" ausgetragen?',
    options: ['Fußball', 'Tennis', 'Golf', 'Cricket'],
    correctAnswer: 1,
    category: 'Sport'
  },
  {
    question: 'Wie viele Spieler hat eine Fußballmannschaft auf dem Feld?',
    options: ['9', '10', '11', '12'],
    correctAnswer: 2,
    category: 'Sport'
  },
  {
    question: 'In welchem Land fanden die Olympischen Spiele 2020 statt?',
    options: ['China', 'Japan', 'Südkorea', 'Brasilien'],
    correctAnswer: 1,
    category: 'Sport'
  },
  {
    question: 'Wie viele Ringe hat das Olympische Symbol?',
    options: ['4', '5', '6', '7'],
    correctAnswer: 1,
    category: 'Sport'
  },

  // Natur & Tiere
  {
    question: 'Welches ist das schnellste Landtier?',
    options: ['Löwe', 'Gepard', 'Leopard', 'Tiger'],
    correctAnswer: 1,
    category: 'Natur & Tiere'
  },
  {
    question: 'Wie viele Beine hat eine Spinne?',
    options: ['6', '8', '10', '12'],
    correctAnswer: 1,
    category: 'Natur & Tiere'
  },
  {
    question: 'Welches ist das größte Säugetier der Welt?',
    options: ['Elefant', 'Blauwal', 'Giraffe', 'Nashorn'],
    correctAnswer: 1,
    category: 'Natur & Tiere'
  },
  {
    question: 'Welcher Planet ist der Sonne am nächsten?',
    options: ['Venus', 'Merkur', 'Mars', 'Erde'],
    correctAnswer: 1,
    category: 'Natur & Tiere'
  },
  {
    question: 'Wie nennt man ein Tier, das Pflanzen und Fleisch frisst?',
    options: ['Herbivore', 'Karnivore', 'Omnivore', 'Insektivore'],
    correctAnswer: 2,
    category: 'Natur & Tiere'
  },

  // Technologie
  {
    question: 'Was bedeutet "WWW" im Internet?',
    options: ['World Wide Web', 'World Wide Wireless', 'World Web Width', 'Wireless World Web'],
    correctAnswer: 0,
    category: 'Technologie'
  },
  {
    question: 'Wer gründete Microsoft?',
    options: ['Steve Jobs', 'Bill Gates', 'Mark Zuckerberg', 'Elon Musk'],
    correctAnswer: 1,
    category: 'Technologie'
  },
  {
    question: 'In welchem Jahr wurde das erste iPhone vorgestellt?',
    options: ['2005', '2007', '2009', '2010'],
    correctAnswer: 1,
    category: 'Technologie'
  },
  {
    question: 'Was ist HTML?',
    options: ['Eine Programmiersprache', 'Eine Markup-Sprache', 'Ein Betriebssystem', 'Eine Datenbank'],
    correctAnswer: 1,
    category: 'Technologie'
  },
  {
    question: 'Welches Unternehmen entwickelte Android?',
    options: ['Apple', 'Microsoft', 'Google', 'Samsung'],
    correctAnswer: 2,
    category: 'Technologie'
  },

  // Allgemeinwissen
  {
    question: 'Wie viele Sekunden hat eine Stunde?',
    options: ['3000', '3200', '3600', '4000'],
    correctAnswer: 2,
    category: 'Allgemeinwissen'
  },
  {
    question: 'Welche Farbe entsteht, wenn man Rot und Blau mischt?',
    options: ['Grün', 'Lila', 'Orange', 'Braun'],
    correctAnswer: 1,
    category: 'Allgemeinwissen'
  },
  {
    question: 'Wie viele Tage hat ein Schaltjahr?',
    options: ['364', '365', '366', '367'],
    correctAnswer: 2,
    category: 'Allgemeinwissen'
  },
  {
    question: 'Welcher ist der kleinste Knochen im menschlichen Körper?',
    options: ['Steigbügel (im Ohr)', 'Fingerknochen', 'Zehenknochen', 'Nasenbein'],
    correctAnswer: 0,
    category: 'Allgemeinwissen'
  },
  {
    question: 'Wie viele Kontinente gibt es?',
    options: ['5', '6', '7', '8'],
    correctAnswer: 2,
    category: 'Allgemeinwissen'
  },
  {
    question: 'Was ist die häufigste Blutgruppe in Deutschland?',
    options: ['A', 'B', 'AB', '0'],
    correctAnswer: 0,
    category: 'Allgemeinwissen'
  },
  {
    question: 'Welches Gas atmen Menschen ein?',
    options: ['Kohlendioxid', 'Sauerstoff', 'Stickstoff', 'Helium'],
    correctAnswer: 1,
    category: 'Allgemeinwissen'
  },
  {
    question: 'Wie nennt man die Wissenschaft der Sterne und Planeten?',
    options: ['Astrologie', 'Astronomie', 'Geologie', 'Biologie'],
    correctAnswer: 1,
    category: 'Allgemeinwissen'
  }
];

/**
 * Shuffles an array using Fisher-Yates algorithm
 * @param {Array} array - Array to shuffle
 * @returns {Array} Shuffled array
 */
function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Gets a random selection of trivia questions
 * @param {number} count - Number of questions to retrieve
 * @returns {TriviaQuestion[]} Array of random questions
 */
export function getRandomQuestions(count) {
  const shuffled = shuffleArray(TRIVIA_QUESTIONS);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

/**
 * Gets questions by specific seed for synchronization
 * @param {number} count - Number of questions to retrieve
 * @param {number} seed - Random seed for reproducible selection
 * @returns {TriviaQuestion[]} Array of questions
 */
export function getQuestionsBySeed(count, seed) {
  // Simple seeded random number generator
  let currentSeed = seed;
  const seededRandom = () => {
    currentSeed = (currentSeed * 9301 + 49297) % 233280;
    return currentSeed / 233280;
  };

  // Create a shuffled copy using seeded random
  const shuffled = [...TRIVIA_QUESTIONS];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(seededRandom() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled.slice(0, Math.min(count, shuffled.length));
}
