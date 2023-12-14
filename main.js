#! /bin/node

import figlet from "figlet";
import gradient from "gradient-string";
import inquirer from "inquirer";
import chalk from "chalk";

let money = 200;

const isNumber = value => {
  return value ? !Number.isNaN(Number(value)) : false;
};

const getRandomElement = array => {
  return array[Math.floor(Math.random() * array.length)];
};

const showIntroduction = async () =>
  figlet("Coin Flip!", { horizontalLayout: "fitted" }, (error, data) => {
    if (error) {
      return console.log(error);
    }

    console.log(gradient.pastel.multiline(data));
  });

const randomizeStringBackground = string => {
  const { bgBlue, bgCyan, bgRed, bgMagenta, bgYellow } = chalk;

  const possibleBackgrounds = [bgBlue, bgCyan, bgRed, bgMagenta, bgYellow];

  const randomBackground = getRandomElement(possibleBackgrounds);

  return randomBackground(string);
};

const flipCoin = () => {
  const sides = ["Heads", "Tails"];

  return getRandomElement(sides);
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

const askPlayerToContinue = async () => {
  const { continuePlaying } = await inquirer.prompt({
    name: "continuePlaying",
    type: "confirm",
    message: "wants to keep playing?",
  });

  return continuePlaying;
};

const askPlayerBet = async () => {
  const { amount } = await inquirer.prompt({
    name: "amount",
    type: "input",
    message: "Enter the amount you want to bet:",
    validate(amount) {
      if (!isNumber(amount)) {
        return "The amount must be a number";
      }

      if (Number(amount) > money) {
        return "The amount cannot be greater than the balance";
      }

      if (Number(amount) < 0) {
        return "The amount cannot be a negative number";
      }

      return true;
    },
  });

  return Number(amount);
};

const handlePlayerChoice = (isPlayerChoiceCorrect, playerBet) => {
  if (isPlayerChoiceCorrect) {
    money += playerBet;
    return console.log(`You won ${playerBet} dollars 😎😎😎\n`);
  }

  money -= playerBet;
  console.log(`You lost ${playerBet} dollars 💀💀💀\n`);
};

const main = async () => {
  const randomChoice = flipCoin();
  const playerChoice = await askPlayerChoice();
  const isPlayerChoiceCorrect = randomChoice === playerChoice;

  console.log(`Your current balance is ${chalk.black.bgGreen(money)} dollars`);
  const playerBet = await askPlayerBet();

  console.log(`The coin landed on: ${randomizeStringBackground(randomChoice)}`);
  handlePlayerChoice(isPlayerChoiceCorrect, playerBet);

  if (money <= 0) {
    return console.log("You are broke");
  }

  const continuePlaying = await askPlayerToContinue();

  if (continuePlaying) {
    main();
  }
};

await showIntroduction();
main();
