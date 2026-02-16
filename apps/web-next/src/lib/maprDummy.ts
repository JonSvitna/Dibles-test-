import type { Student, MapRResult, Band, Term } from './types';

// RIT score ranges by grade (realistic MAP-R data)
const RIT_RANGES: Record<number, { min: number; max: number; average: number }> = {
  1: { min: 140, max: 200, average: 170 },
  2: { min: 150, max: 210, average: 180 },
  3: { min: 160, max: 220, average: 190 },
  4: { min: 170, max: 230, average: 200 },
  5: { min: 180, max: 240, average: 210 },
  6: { min: 185, max: 245, average: 215 },
  7: { min: 190, max: 250, average: 220 },
  8: { min: 195, max: 255, average: 225 },
};

// Band assignment based on percentile
function getBandFromPercentile(percentile: number): Band {
  if (percentile >= 95) return "Blue";
  if (percentile >= 75) return "Green";
  if (percentile >= 50) return "Yellow";
  if (percentile >= 25) return "Orange";
  return "Red";
}

// Generate realistic RIT score for a grade with some variance
function generateRIT(grade: number, variance = 15): number {
  const range = RIT_RANGES[grade];
  const mean = range.average;
  // Use a simplified normal distribution approximation
  const random = (Math.random() + Math.random() + Math.random() + Math.random()) / 4;
  const score = Math.round(mean + (random - 0.5) * 2 * variance);
  return Math.max(range.min, Math.min(range.max, score));
}

// Generate correlated percentile from RIT score
function generatePercentileFromRIT(rit: number, grade: number): number {
  const range = RIT_RANGES[grade];
  const normalized = (rit - range.min) / (range.max - range.min);
  const percentile = Math.round(normalized * 100);
  return Math.max(1, Math.min(99, percentile));
}

// Generate 200 students (grades 1-8, roughly 25 per grade)
export function generateDummyStudents(): Student[] {
  const students: Student[] = [];
  const firstNames = [
    "Emma", "Liam", "Olivia", "Noah", "Ava", "Elijah", "Sophia", "James", "Isabella", "Oliver",
    "Charlotte", "Benjamin", "Mia", "Lucas", "Amelia", "Mason", "Harper", "Ethan", "Evelyn", "Alexander",
    "Abigail", "Henry", "Emily", "Jackson", "Elizabeth", "Sebastian", "Sofia", "Aiden", "Avery", "Matthew",
    "Ella", "Samuel", "Scarlett", "David", "Grace", "Joseph", "Chloe", "Carter", "Victoria", "Owen",
    "Riley", "Wyatt", "Aria", "John", "Lily", "Jack", "Aubrey", "Luke", "Zoey", "Jayden"
  ];
  const lastNames = [
    "Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez",
    "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson", "Thomas", "Taylor", "Moore", "Jackson", "Martin",
    "Lee", "Perez", "Thompson", "White", "Harris", "Sanchez", "Clark", "Ramirez", "Lewis", "Robinson",
    "Walker", "Young", "Allen", "King", "Wright", "Scott", "Torres", "Nguyen", "Hill", "Flores"
  ];

  for (let i = 0; i < 200; i++) {
    const grade = (i % 8) + 1; // Distribute across grades 1-8
    students.push({
      student_id: `STU${String(i + 1).padStart(5, '0')}`,
      first_name: firstNames[i % firstNames.length],
      last_name: lastNames[Math.floor(i / 5) % lastNames.length],
      grade,
    });
  }

  return students;
}

// Generate MAP-R results for all students (3 terms each = 600 results)
export function generateDummyMapRResults(students: Student[]): MapRResult[] {
  const results: MapRResult[] = [];
  const terms: Term[] = ["Fall", "Winter", "Spring"];

  students.forEach((student) => {
    // Generate a baseline RIT for Fall
    let fallRIT = generateRIT(student.grade);

    terms.forEach((term, index) => {
      let rit: number;
      
      if (term === "Fall") {
        rit = fallRIT;
      } else {
        // Add growth over the year (1-5 points per term on average)
        const growth = Math.round(Math.random() * 3 + 1);
        fallRIT += growth;
        rit = fallRIT;
      }

      const ach_pct = generatePercentileFromRIT(rit, student.grade);
      const band = getBandFromPercentile(ach_pct);

      results.push({
        student_id: student.student_id,
        term,
        rit,
        ach_pct,
        band,
      });
    });
  });

  return results;
}

// Export all dummy data
let cachedStudents: Student[] | null = null;
let cachedResults: MapRResult[] | null = null;

export function getDummyData() {
  if (!cachedStudents || !cachedResults) {
    cachedStudents = generateDummyStudents();
    cachedResults = generateDummyMapRResults(cachedStudents);
  }

  return {
    students: cachedStudents,
    results: cachedResults,
  };
}
