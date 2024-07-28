import { React, useState, useEffect } from 'react';
import { Button, Text, View } from 'react-native';
import wodTypes from '../static/wod_types.json';
import exercises from '../static/exercises.json';

const WodGenerator = ({ equipment }) => {
  const [wodDescription, setWodDescription] = useState();

  useEffect(() => {
      setWodDescription(generateWorkout(equipment));
  }, [equipment]);

  const updateWodDescription = () => {
      setWodDescription(generateWorkout(equipment));
  };

  return (
      <View>
          <Text>{wodDescription}</Text>
          <Button title="Generate another workout" onPress={updateWodDescription} />
      </View>
  );
};

const generateWorkout = (equipment) => {
  const {
    equipmentExercises,
    weightliftingExercises,
    gymnasticsExercises,
    monostructuralExercises,
    miscExercises
  } = filterExercisesByEquipment(equipment);

  const wodType = getWodType(wodTypes);
  console.log("wodType:", wodType);
  let selectedExercises, repScheme, rounds, workoutTime, totalWorkoutEstimatedTime;

  do {
    const numOfExercises = generateNumberOfExercises(wodType);
    selectedExercises = getRandomExercises(equipmentExercises, numOfExercises, equipment, wodType);
    repScheme = getRepScheme(wodType, selectedExercises, monostructuralExercises);
    rounds = getRounds(wodType);
    weightScheme = getWeightScheme(wodType, selectedExercises, repScheme);
    if(isWorkoutFixedTiming(wodType)) {
      workoutTime = getTime(wodType, selectedExercises, rounds, totalWorkoutEstimatedTime);
      break;
    }
    totalWorkoutEstimatedTime = estimateWorkoutDuration(selectedExercises, repScheme, rounds);
    workoutTime = getTime(wodType, selectedExercises, rounds, totalWorkoutEstimatedTime);

    workoutTimeInSec = workoutTime * 60;
    console.log("workout time:", workoutTime);
    console.log("workout time(sec):", workoutTimeInSec);
    console.log("totalWorkoutEstimatedTime:", totalWorkoutEstimatedTime);
    console.log("\n\n");
  } while ((totalWorkoutEstimatedTime > workoutTimeInSec || workoutTime > 45 || workoutTime < 5));

  return getWorkoutDescription(wodType, workoutTime, rounds, repScheme, selectedExercises, weightScheme);
};

const isWorkoutFixedTiming = (wodType) => {
  return wodType === "Tabata" || wodType === "EMOM";
}

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
  return arrayOfStrings.some(existingStr => {
      const existingWords = existingStr.split(/\s+/).filter(word => !equipment.includes(word)); // Split existing string into words and remove exception words
      return existingWords.some(word => words.has(word));  // Check if any word exists in the set of words
  });
};

const getRandomExercises = (equipmentExercises, numOfExercises, equipment, wodType) => {
  const randomIndexes = new Set();
  const selectedExercises = [];

  while (randomIndexes.size < numOfExercises && randomIndexes.size < equipmentExercises.length) {
      const randomIndex = Math.floor(Math.random() * equipmentExercises.length);
      const exerciseDescription = equipmentExercises[randomIndex];
      
      if (!hasCommonWordWithArray(exerciseDescription, selectedExercises, equipment) && !isExerciseWodTypeExcluded(exerciseDescription, wodType)) {
          randomIndexes.add(randomIndex);
          selectedExercises.push(exerciseDescription);
      }
  }
  return Array.from(randomIndexes).map(index => equipmentExercises[index]);
};

const isExerciseWodTypeExcluded = (exerciseDescription, wodType) => {
  switch(wodType) {
    case "For Time":
      return false;
    case "AMRAP":
      return false;
    case "EMOM":
      return false;
    case "Tabata":
      if(exerciseDescription === "Running")
        return true;
      return false;
    case "Ladder":
      if(exerciseDescription === "Running")
        return true;
      return false;
    default:
      return false;
  }
};

const estimateWorkoutDuration = (selectedExercises, repScheme, rounds) => {
  let roundDuration = 0;
  selectedExercises.forEach((selectedExerciseName, index) => {
    let exerciseData;
    let isMonostructural = exercises["Monostructural"].find(exercise => exercise.name === selectedExerciseName);

    for (const category in exercises) {
      const found = exercises[category].find(exercise => exercise.name === selectedExerciseName);
      if (found) {
        exerciseData = found;
        break;
      }
    }

    if (!exerciseData) {
      console.warn("Exercise not found:", selectedExerciseName);
      return; // Skip the current iteration
    }

    let reps = repScheme[index];
    
    
    console.log("exerciseData:", exerciseData);
    console.log("repScheme[index]:", reps);

    if(isMonostructural) {
      reps = repScheme[index].replace(/\D/g, '');
      if(repScheme[index].includes("cal")){
        reps = reps / 5;//reps are per 5 cal duration
      }
      else {
        reps = reps / 100;//reps are per 100 meters duration
      }
    }
    roundDuration += exerciseData.averageTime * reps;
    console.log("roundDuration:", roundDuration);

  });

  //assume fatigue and transition time increasing round by round
  let totalEstimatedWorkoutTime = 0;
  let transitionTime = 3;
  let estimatedRoundDuration = roundDuration;
  for(i = 0; i < rounds; i++){
    transitionTime = selectedExercises.length * transitionTime ;//Added 3 seconds transition time
    
    totalEstimatedWorkoutTime = estimatedRoundDuration + transitionTime;
    
    estimatedRoundDuration = estimatedRoundDuration * 1.2;//increasing round time accumulating fatigue
    transitionTime = transitionTime * 1.2;//increasing transition time
  }

  return Math.floor(totalEstimatedWorkoutTime);
};

function getWodType(wodTypes) {
  let weights = [0.30, 0.50, 0.20, 0.10, 0.00];
  let randomIndex = generateWeightedRandom(0, wodTypes.length-1, weights);

  return wodTypes[randomIndex];
}

function getRounds(wodType) {
  switch(wodType) {
    case "For Time":
      return 5;
    case "AMRAP":
      return 1;
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
      // Get random parameters for the ladder pattern
      const min = Math.floor(Math.random() * 10);
      const max = min + 10 + Math.floor(Math.random() * 10);  // Ensures max is at least 10 more than min
      const difference = max - min;
      const step = Math.ceil(Math.random() * difference);     // Ensures step is never greater than difference
      const direction = Math.random() < 0.5 ? 'ascending' : 'descending';

      return getRandomLadder(min, max, step, direction);
    default:
      return [];
  }
}

const getWeightScheme = (wodType, selectedExercises, repScheme) => {
  let scheme = [];

  selectedExercises.map( (selectedExerciseName, index) => {
    let exerciseData;
    for (const category in exercises) {
      const found = exercises[category].find(exercise => exercise.name === selectedExerciseName);
      if (found) {
        exerciseData = found;
        break;
      }
    }
    const weight = getWeightForRepScheme(wodType, exerciseData, repScheme[index]);//TODO: Get same weight for dumbbell movements
    scheme.push(weight);
  });

  return scheme;

}

const getWeightForRepScheme = (wodType, exerciseData, reps) => {
  if(!exerciseData.weights){ return "";}
  switch(wodType) {
    case "For Time":
    case "AMRAP":
      if( reps < 10) {
        exerciseData.weights.max
        const numbers = [exerciseData.weights.heavy, exerciseData.weights.extra_heavy, exerciseData.weights.maximum];
        const weights = [0.50, 0.30, 0.20];
        return weightedRandomSelection(numbers, weights);
      }
      else if( reps <= 20) {
        exerciseData.weights.max
        const numbers = [exerciseData.weights.default, exerciseData.weights.medium_heavy, exerciseData.weights.heavy];
        const weights = [0.60, 0.10, 0.30];
        return weightedRandomSelection(numbers, weights);
      }
      else if( reps > 20) {
        exerciseData.weights.max
        const numbers = [exerciseData.weights.light, exerciseData.weights.light_medium, exerciseData.weights.default];
        const weights = [0.50, 0.30, 0.20];
        return weightedRandomSelection(numbers, weights);
      }
      else {
        return exerciseData.weights.default;
      }
    case "EMOM":
      return exerciseData.weights.default;
    case "Tabata":
      return exerciseData.weights.light;
    case "Ladder":
      return exerciseData.weights.default;
    default:
      return exerciseData.weights.default;
  }
}

function weightedRandomSelection(numbers, weights) {
  // Filter out undefined numbers and their corresponding weights
  const validEntries = numbers
      .map((number, index) => ({ number, weight: weights[index] }))
      .filter(entry => entry.number !== undefined);

  // If only one valid number remains, return it
  if (validEntries.length === 1) {
      return validEntries[0].number;
  }

  // Calculate the total weight for random selection
  const totalWeight = validEntries.reduce((acc, entry) => acc + entry.weight, 0);
  let randomNum = Math.random() * totalWeight;

  for (const entry of validEntries) {
      if (randomNum < entry.weight) {
          return entry.number;
      }
      randomNum -= entry.weight;
  }
}

function getWorkoutDescription(wodType, time, rounds, repScheme, selectedExercises, weightScheme) {
  switch(wodType) {
    case "For Time":
      let header = "For Time";
      let roundLiteral = `Perform ${rounds} rounds of:\n`;
      let exercisesLiteral = "";
      selectedExercises.map( (x, i) => exercisesLiteral += repScheme[i] + " " + x + (weightScheme[i] ? " " + weightScheme[i] + "kg" : "")  + "\n");
      let cap = `CAP: ${time} minutes\n`;
      let score = "Score is the total time to complete the workout";
      let wodDescription = header + "\n" + roundLiteral + exercisesLiteral + cap + "\n" + score;
      return wodDescription;
    case "AMRAP":
      header = `In ${time} minutes perform As Many Reps As Possible of:\n`;
      exercisesLiteral = "";
      selectedExercises.map( (x, i) => exercisesLiteral += repScheme[i] + " " + x + (weightScheme[i] ? " " + weightScheme[i] + "kg" : "")  + "\n");
      score = "Score is the total reps in all sets";
      wodDescription = header + "\n" + exercisesLiteral + "\n" + score;
      return wodDescription;
    case "EMOM":
      header = `Every Minute on the minute for ${time} minutes:\n`;
      exercisesLiteral = "";
      selectedExercises.map( (x, i) => exercisesLiteral += repScheme[i] + " " + x + (weightScheme[i] ? " " + weightScheme[i] + "kg" : "")  + "\n");
      score = "Score is the total reps in all sets";
      wodDescription = header + "\n" + exercisesLiteral + "\n" + score;
      return wodDescription;
    case "Tabata":
      header = `For 8 Sets, Work 20\", rest 10\"\n`;
      exercisesLiteral = "";
      selectedExercises.map( (x, i) => exercisesLiteral += x +  (weightScheme[i] ? " " + weightScheme[i] + "kg" : "")  + "\n");
      score = "Score is the total reps in all sets";
      wodDescription = header + "\n" + exercisesLiteral + "\n" + score;
      return wodDescription;
    case "Ladder":
      header = "For Time";
      const reps = repScheme.join(", ");
      roundLiteral = `Perform ${reps} reps of:\n`;
      exercisesLiteral = "";
      selectedExercises.map( (x, i) => exercisesLiteral += x + (weightScheme[i] ? " " + weightScheme[i] + "kg" : "")  + "\n");
      cap = "CAP:" + time + "\n";
      score = "Score is the total time to complete the workout";
      wodDescription = header + "\n" + roundLiteral + exercisesLiteral + cap + "\n" + score;
      return wodDescription;
    default:
      return "None";
  }
}

function getTime(wodType, selectedExercises, rounds, totalWorkoutEstimatedTime) {
  let randomTime = getRandomTimeWeighted(10, 25);
  switch(wodType) {
    case "For Time":
      return Math.floor((totalWorkoutEstimatedTime + (totalWorkoutEstimatedTime * 0.3))/60);;
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
  if (weights.length !== max - min + 1) {
    throw new Error('Weights array length must be equal to max - min + 1');
  }

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
  let weights = [0.00, 0.25, 0.35, 0.27, 0.13];
  let randomNumber = generateWeightedRandom(1, 5, weights);

  return randomNumber;
}

function getRandomMonostructural(exercise, wodType) {
  switch(exercise) {
    case "Running":
      if( wodType === "EMOM")
        return "200m";
      else
        return "400m";
    default:
      return "15 cal";
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
      let weights = [0.50, 0, 0.20, 0, 0.20, 0.10];
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
