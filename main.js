#! /bin/node

import figlet from "figlet";
import gradient from "gradient-string";
import inquirer from "inquirer";
import chalk from "chalk";

const showIntroduction = async () =>
  figlet("Coin Flip!", { horizontalLayout: "fitted" }, (error, data) => {
    if (error) {
      return console.log(error);
    }

    console.log(gradient.pastel.multiline(data));
  });

const flipCoin = () => {
  const sides = ["Heads", "Tails"];

  return sides[Math.floor(Math.random() * 2)];
};

const askPlayerChoice = async () => {
  const { playerChoice } = await inquirer.prompt({
    name: "playerChoice",
    type: "list",
    message: "Want to bet heads or tails:",
    choices: ["Heads", "Tails"],
  });

  return playerChoice;
};
const handlePlayerChoice = isPlayerChoiceCorrect => {
  if (isPlayerChoiceCorrect) {
    return console.log("You won 😎😎😎\n");
  }

  console.log("You lost 💀💀💀\n");
};

const askPlayerToContinue = async () => {
  const { continuePlaying } = await inquirer.prompt({
    name: "continuePlaying",
    type: "confirm",
    message: "wants to keep playing?",
  });

  return continuePlaying;
};

const randomizeStringBackground = string => {
  const { bgBlue, bgCyan, bgGreen, bgRed, bgMagenta, bgYellow } = chalk;

  const possibleBackgrounds = [
    bgBlue,
    bgCyan,
    bgGreen,
    bgRed,
    bgMagenta,
    bgYellow,
  ];

  const randomBackground =
    possibleBackgrounds[Math.floor(Math.random() * possibleBackgrounds.length)];

  return randomBackground(string);
};

const main = async () => {
  const randomChoice = flipCoin();
  const playerChoice = await askPlayerChoice();
  const isPlayerChoiceCorrect = randomChoice === playerChoice;

  console.log(`The coin landed on: ${randomizeStringBackground(randomChoice)}`);
  handlePlayerChoice(isPlayerChoiceCorrect);

  const continuePlaying = await askPlayerToContinue();

  if (continuePlaying) {
    main();
  }
};

await showIntroduction();
main();
