#! /bin/node

import figlet from "figlet";
import gradient from "gradient-string";
import inquirer from "inquirer";
import chalk from "chalk";

const playerData = (() => {
  let money = 200;

  const getMoney = () => money;
  const setMoney = newMoney => {
    money = newMoney;

    return money;
  };

  return {
    getMoney,
    setMoney,
  };
})();

const isNumber = value => {
  return value ? !Number.isNaN(Number(value)) : false;
};

const getRandomElement = array => {
  return array[Math.floor(Math.random() * array.length)];
};

const showIntro = async () =>
  figlet("Coin Flip!", { horizontalLayout: "fitted" }, (error, data) => {
    if (error) {
      return console.log(error);
    }

    console.log(gradient.pastel.multiline(data));
  });

const handleChoiceBackground = choice => {
  const { bgMagenta, bgCyan } = chalk;

  if (choice === "Heads") {
    return bgMagenta(choice);
  }

  return bgCyan(choice);
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

const askPlayerBet = async money => {
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

const handlePlayerChoice = (isPlayerChoiceCorrect, money, playerBet) => {
  const { setMoney } = playerData;

  if (isPlayerChoiceCorrect) {
    setMoney(money + playerBet);
    return console.log(`You won ${playerBet} dollars 😎😎😎\n`);
  }

  setMoney(money - playerBet);
  console.log(`You lost ${playerBet} dollars 💀💀💀\n`);
};

const isBroke = () => {
  const { getMoney } = playerData;
  const money = getMoney();

  return money <= 0;
};

const execGame = async () => {
  const { getMoney, setMoney } = playerData;
  const money = getMoney();
  const randomChoice = flipCoin();
  const playerChoice = await askPlayerChoice();
  const isPlayerChoiceCorrect = randomChoice === playerChoice;

  console.log(`Your current balance is ${chalk.black.bgGreen(money)} dollars`);
  const playerBet = await askPlayerBet(money);

  console.log(`The coin landed on: ${handleChoiceBackground(randomChoice)}`);
  handlePlayerChoice(isPlayerChoiceCorrect, money, playerBet);

  if (isBroke()) {
    console.log(chalk.white.bgRed("You are broke"));

    const { reset } = await inquirer.prompt({
      name: "reset",
      type: "confirm",
      message: "Want to restart the game?",
    });

    if (!reset) {
      console.log("Bye!");
      return process.exit();
    }

    setMoney(200);
    return execGame();
  }

  const continuePlaying = await askPlayerToContinue();

  if (continuePlaying) {
    execGame();
  }
};

await showIntro();
execGame();
