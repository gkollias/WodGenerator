import { React, useState, useEffect } from 'react';
import { Button, Text, View } from 'react-native';
import wodTypes from '../static/wod_types.json';
import exercises from '../static/exercises.json';

const WodGenerator = ({ equipment }) => {
  const [wodDescription, setWodDescription] = useState();

  useEffect(() => {
      setWodDescription(generator(equipment));
  }, [equipment]);

  const updateWodDescription = () => {
      setWodDescription(generator(equipment));
  };

  return (
      <View>
          <Text>{wodDescription}</Text>
          <Button title="Generate another workout" onPress={updateWodDescription} />
      </View>
  );
};

const generator = (equipment) => {
  const { equipmentExercises, weightliftingExercises, gymnasticsExercises, monostructuralExercises, miscExercises } = filterExercisesByEquipment(equipment);

  const wodType = "AMRAP";  // hardcoded for now; you might use getWodType(wodTypes) in the future
  const numOfExercises = generateNumberOfExercises(wodType);
  const selectedExercises = getRandomExercises(equipmentExercises, numOfExercises, equipment);
  const repScheme = getRepScheme(wodType, selectedExercises, monostructuralExercises);
  const rounds = getRounds(wodType);
  const time = getTime(wodType, selectedExercises, rounds);

  return getWorkoutDescription(wodType, time, rounds, repScheme, selectedExercises);
};

const filterExercisesByEquipment = (equipment) => {
  if (!equipment.includes("No equipment")) {
      equipment.push("No equipment");
  }

  const equipmentExercises = [];
  const weightliftingExercises = [];
  const gymnasticsExercises = [];
  const monostructuralExercises = [];
  const miscExercises = [];

  for (let category in exercises) {
    exercises[category].forEach(exercise => {
      if (equipment.includes(exercise.equipment)) {
        equipmentExercises.push(exercise.name);
        switch(category) {
          case "Weightlifting":
            weightliftingExercises.push(exercise.name);
            break;
          case "Gymnastics":
            gymnasticsExercises.push(exercise.name);
            break;
          case "Monostructural":
            monostructuralExercises.push(exercise.name);
            break;
          case "Misc":
            miscExercises.push(exercise.name);
            break;
          default:
            break;
        }
      }
    });
  }

  return {
      equipmentExercises,
      weightliftingExercises,
      gymnasticsExercises,
      monostructuralExercises,
      miscExercises
  };
};

const hasCommonWordWithArray = (str, arrayOfStrings, equipment) => {
  const words = new Set(str.split(/\s+/).filter(word => !equipment.includes(word)));  // Split string by spaces to get words, remove exceptions and convert to set
  console.log(equipment);
  console.log("w",words);
  return arrayOfStrings.some(existingStr => {
      const existingWords = existingStr.split(/\s+/).filter(word => !equipment.includes(word)); // Split existing string into words and remove exception words
      return existingWords.some(word => words.has(word));  // Check if any word exists in the set of words
  });
};

const getRandomExercises = (equipmentExercises, numOfExercises, equipment) => {
  const randomIndexes = new Set();
  const selectedExercises = [];

  while (randomIndexes.size < numOfExercises && randomIndexes.size < equipmentExercises.length) {
      const randomIndex = Math.floor(Math.random() * equipmentExercises.length);
      const exerciseDescription = equipmentExercises[randomIndex];
      
      if (!hasCommonWordWithArray(exerciseDescription, selectedExercises, equipment)) {
          randomIndexes.add(randomIndex);
          selectedExercises.push(exerciseDescription);
      }
  }
  return Array.from(randomIndexes).map(index => equipmentExercises[index]);
};


function getWodType(wodTypes) {
  let randomIndex = Math.floor(Math.random() * wodTypes.length);
  return wodTypes[randomIndex];
}

function getRounds(wodType) {
  switch(wodType) {
    case "For Time":
      return 5;
    case "AMRAP":
    case "EMOM":
      return 4;
    case "Tabata":
    case "Ladder":
    default:
      return "None";
  }
}

function getRepScheme(wodType, selectedExercises, monostructuralExercises) {
  switch(wodType) {
    case "For Time":
    case "AMRAP":
      let scheme = [];
      
      const hasMono = selectedExercises.some(exercise => monostructuralExercises.includes(exercise));

      if(hasMono) {
      selectedExercises.map( (ex) => {
        let rep = monostructuralExercises?.includes(ex) ?
          rep = getRandomMonostructural(ex, wodType) :
          rep = getRandomReps();
        scheme.push(rep);
      });
    }
    else {
      rep = getRandomReps();
      const randomSeq = generateUniformSequence(rep, selectedExercises.length);
      scheme.push(...randomSeq);
    }
      return scheme;
    case "EMOM":
      scheme = [];
      selectedExercises.map( (ex) => {
        let rep = monostructuralExercises?.includes(ex) ?
          rep = getRandomMonostructural(ex, wodType) :
          rep = getRepsForEMOM(ex);
        scheme.push(rep);
      });
      return scheme;
    case "Ladder":
      // Get random parameters
      const min = Math.floor(Math.random() * 10);
      const max = min + Math.floor(Math.random() * 20);
      const step = Math.ceil(Math.random() * 5);
      const direction = Math.random() < 0.5 ? 'ascending' : 'descending';

      return getRandomLadder(min, max, step, direction);
    default:
      return [];
  }
}

function getWorkoutDescription(wodType, time, rounds, repScheme, selectedExercises) {
  switch(wodType) {
    case "For Time":
      let header = "For Time";
      let roundLiteral = "Perform " + rounds + " rounds of:\n";
      let exercisesLiteral = "";
      selectedExercises.map( (x, i) => exercisesLiteral += repScheme[i] + " " + x + "\n");
      let cap = "CAP:" + time + "\n";
      let score = "Score is the total time to complete the workout";
      let wodDescription = header + "\n" + roundLiteral + exercisesLiteral + cap + "\n" + score;
      return wodDescription;
    case "AMRAP":
      header = `In ${time} minutes perform As Many Reps As Possible`;
      exercisesLiteral = "";
      selectedExercises.map( (x, i) => exercisesLiteral += repScheme[i] + " " + x + "\n");
      score = "Score is the total reps in all sets";
      wodDescription = header + "\n" + exercisesLiteral + "\n" + score;
      return wodDescription;
    case "EMOM":
      header = `Every Minute on the minute for ${time} minutes:`;
      exercisesLiteral = "";
      selectedExercises.map( (x, i) => exercisesLiteral += repScheme[i] + " " + x + "\n");
      score = "Score is the total reps in all sets";
      wodDescription = header + "\n" + exercisesLiteral + "\n" + score;
      return wodDescription;
    case "Tabata":
      header = `For 8 Sets, Work 20\", rest 10\"`;
      exercisesLiteral = "";
      selectedExercises.map( (x, i) => exercisesLiteral += x + "\n");
      score = "Score is the total reps in all sets";
      wodDescription = header + "\n" + exercisesLiteral + "\n" + score;
      return wodDescription;
    case "Ladder":
      header = "For Time";
      const reps = repScheme.join(", ");
      roundLiteral = "Perform " + reps + " reps of:\n";
      exercisesLiteral = "";
      selectedExercises.map( (x, i) => exercisesLiteral += x + "\n");
      cap = "CAP:" + time + "\n";
      score = "Score is the total time to complete the workout";
      wodDescription = header + "\n" + roundLiteral + exercisesLiteral + cap + "\n" + score;
      return wodDescription;
    default:
      return "None";
  }
}

function getTime(wodType, selectedExercises, rounds) {
  let randomTime = getRandomTimeWeighted(10, 25);
  switch(wodType) {
    case "For Time":
      return randomTime;
    case "AMRAP":
      return randomTime;
    case "EMOM":
      return selectedExercises.length * rounds;
    case "Tabata":
      return randomTime;
    case "Ladder":
      return randomTime;
    default:
      return "None";
  }
}

function getRandomTimeWeighted(min, max) {
  const rand = Math.random();

  if (rand < 0.5) {
    // 50% chance: Generate a random multiple of 5 between min and max
    return 5 * Math.ceil((Math.random() * (max - min)) / 5) + min;
  } else if (rand < 0.8) {
    // 30% chance: Generate a random multiple of 2 between min and max
    return 2 * Math.ceil((Math.random() * (max - min)) / 2) + min;
  } else {
    // 20% chance: Generate a random integer between min and max
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}

function getRandomLadder(min, max, step, direction) {
  const ladder = [];
  const totalSteps = Math.floor((max - min) / step);

  if (direction === 'ascending') {
    for (let i = 0; i <= totalSteps; i++) {
      ladder.push(min + i * step);
    }
  } else if (direction === 'descending') {
    for (let i = totalSteps; i >= 0; i--) {
      ladder.push(min + i * step);
    }
  }

  return ladder;
}

// Function to generate weighted random numbers
function generateWeightedRandom(min, max, weights) {
  // Generate a random number between 0 and the sum of the weights
  let randomNum = Math.random() * weights.reduce((a, b) => a + b);
  let weightSum = 0;

  // Go through all the weights
  for (let i = 0; i < weights.length; i++) {
      weightSum += weights[i]; // add the weight to the sum

      // If this weight brings the sum over the random number, return the corresponding number
      if (randomNum < weightSum) {
          return i + min;
      }
  }
}

function generateNumberOfExercises(wodType) {
  let weights = [0.01, 0.25, 0.35, 0.27, 0.12];
  let randomNumber = generateWeightedRandom(1, 5, weights);

  return randomNumber;
}

function getRandomMonostructural(exercise, wodType) {
  switch(exercise) {
    case "Running":
      if( wodType === "EMOM")
        return "200m";
      else
        return "400 m";
    default:
      return "20 cal";
  }
}
function getRandomReps() {
  const limit = 100;
  const weights = [3, 15, 10, 20, 15, 10, 0, 8, 0, 8, 0, 4, 0, 4, 0, 3, 0, 2, 0, 5];

  return randomMultipleOfFive(limit, weights);
}

function getRepsForEMOM(exercise){
  switch(exercise) {
    case "Pistol Squats":
      let weights = [0.50, 0, 0.20, 0, 0.30];
      return generateWeightedRandom(10, 15, weights);
    default:
      weights = [0.50, 0.05, 0.05, 0.05, 0.05, 0.30];
      return generateWeightedRandom(10, 15, weights);
  }
}

function randomMultipleOfFive(limit, weights) {
  // Create an array of possible multiples of 5 up to the given limit
  const possibilities = [];
  for (let i = 5; i <= limit; i += 5) {
    possibilities.push(i);
  }

  // Create a weighted array where each possibility is repeated based on its weight
  const weightedPossibilities = [];
  possibilities.forEach((possibility, index) => {
    for (let j = 0; j < weights[index]; j++) {
      weightedPossibilities.push(possibility);
    }
  });

  // Randomly select an index from the weighted array
  const randomIndex = Math.floor(Math.random() * weightedPossibilities.length);
  return weightedPossibilities[randomIndex];
}

function generateUniformSequence(x, y, probSame = 0.3, probHalf = 0.3) {
  const sequence = [x];
  const randomChance = Math.random();

  let stepSize;

  if (randomChance <= probSame) {
      stepSize = 0;
  } else if (randomChance <= probSame + probHalf && !isDecimal(x / 2)) {
      stepSize = x / 2;
  } else {
      stepSize = x;
  }

  for (let i = 1; i < y; i++) {
      const nextNumber = sequence[i - 1] + stepSize;
      sequence.push(nextNumber);
  }
  return sequence;
}

function isDecimal(num) {
  return num % 1 !== 0;
}

export default WodGenerator;
