import { config, Token } from "../../config/config";

export const toUpperCase = (s: string): string => s.toUpperCase();

export const toProperCase = (str: string): string => {
  return str.replace(/\w\S*/g, (str: string): string => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  });
};

export const validateInput = (chain: string, token: string): boolean => {
  const configPair: Token = config.networks[chain].tokens[token];

  return !(configPair == undefined);
};

export const convertMilliSecondsToHMS = (milliseconds: number): string => {
  let seconds = Math.floor(milliseconds / 1000);
  let minutes = Math.floor(seconds / 60);
  let hours = Math.floor(minutes / 60);

  seconds = seconds % 60;
  minutes = minutes % 60;
  hours = hours % 24;

  return `${padTo2Digits(hours)}:${padTo2Digits(minutes)}:${padTo2Digits(seconds)}`;
};

export const padTo2Digits = (num: number): string => {
  return num.toString().padStart(2, "0");
};
