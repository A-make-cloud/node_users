import chalk from "chalk";

export const debug = (optionalValue) => {
  console.log(chalk.bgGray("Context actuel => "));
  console.log("====================");
  console.log(this);
  console.log("====================");

  if (optionalValue) {
    console.log(chalk.cyanBright("Valeurs => "));
    console.log("====================");
    console.log(optionalValue);
    console.log("====================");
  }
};
