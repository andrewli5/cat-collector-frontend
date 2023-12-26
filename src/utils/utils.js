import { ERRORS } from "../constants";

export function importAll(r) {
  let images = {};
  r.keys().map((item) => {
    images[item.replace("./", "")] = r(item);
  });
  return images;
}

export function generateErrorMessage(message, username) {
  console.log("error message from node: ", message);
  if (message.includes(ERRORS.UsernameExists)) {
    return `username "${username}" is already taken!`;
  }
  if (message.includes(ERRORS.UsernameEmpty)) {
    return "username is a required field.";
  }
  if (message.includes(ERRORS.FirstNameEmpty)) {
    return "first name is a required field.";
  }
  if (message.includes(ERRORS.LastNameEmpty)) {
    return "last name is a required field.";
  }
  if (message.includes(ERRORS.InvalidCoins)) {
    return "coins must be a positive integer.";
  } else {
    return message;
  }
}
