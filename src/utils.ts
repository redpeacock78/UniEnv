"use strict";
import Commons from "./commons.ts";
import { Maybe } from "./types.ts";

let envLoaded = false;
const Utils = {
  versioning: {
    /**
     * Compares two version strings and returns true if the second version is greater than or equal to the first version.
     *
     * @param {string} require - The first version string to compare.
     * @param {string} current - The second version string to compare.
     * @return {boolean} Returns true if the second version is greater than or equal to the first version, otherwise returns false.
     */
    moreThan: (require: string, current: string): boolean =>
      !Array.from(
        new Set(
          [require, current].sort((q: string, w: string): number =>
            w.localeCompare(q, [], { numeric: true })
          )
        )
      ).indexOf(current)
        ? true
        : false,
  },
  /**
   * A function that recursively searches for an environment file starting from a specified directory.
   *
   * @param {string} startDir - The directory path to start the search from.
   * @return {Maybe<string>} The path of the found environment file if it exists, otherwise null.
   */
  findEnvFile: (startDir: string): Maybe<string> => {
    const separator = Commons.platform().startsWith("win") ? "\\" : "/";
    let currentDir = startDir;
    while (true) {
      const envFilePath = `${currentDir}${separator}.env`;
      let existsFile = false;
      try {
        existsFile = Commons.existsSync(envFilePath);
      } catch {
        existsFile = false;
      }
      if (existsFile) return envFilePath;
      const parentDir = currentDir.split(separator).splice(-1).join(separator);
      if (parentDir === currentDir) break;
      currentDir = parentDir;
    }
    return null;
  },
  /**
   * Replaces variables in a string with their corresponding values from an object of environment variables.
   *
   * @param {string} value - The string containing variables to be replaced.
   * @param {Object.<string, string>} envVariables - An object containing key-value pairs of environment variables.
   * @return {string} The string with variables replaced by their corresponding values.
   */
  replaceVariables: (
    value: string,
    envVariables: { [key: string]: string }
  ): string => {
    const replacedValue = value.replace(
      /\${([^}:-]+)(?::-(.*?))?(?::-?(.*?))?}/g,
      (_, name, defaultValue1, defaultValue2) => {
        const envValue = envVariables[name] ?? Commons.env.get(name);
        if (envValue !== undefined) return envValue;
        if (defaultValue1 !== undefined) return defaultValue1;
        if (defaultValue2 !== undefined) return defaultValue2;
        return "";
      }
    );
    return replacedValue ? replacedValue.replace(/\\\$/g, "$") : replacedValue;
  },
  /**
   * Sets key-value pairs in the environment variables based on the content of a file.
   *
   * @param {string} envFilePath - The path of the file containing the environment variables.
   * @return {void} This function does not return a value.
   */
  setKey2Value: (envFilePath: string): void => {
    const envFileContent = Commons.readTextFileSync(envFilePath);
    const envVariables: { [key: string]: string } = {};
    let currentKey: string | null = null;
    let currentValue: string[] = [];
    envFileContent.split("\n").forEach((line: string): void => {
      let trimmedLine = line.trim();
      if (trimmedLine.startsWith("#")) return;
      const commentIndex = trimmedLine.indexOf(" #");
      if (commentIndex !== -1)
        trimmedLine = trimmedLine.substring(0, commentIndex).trim();
      const keyValueMatch = trimmedLine.match(/^([^=]+)=(.*)$/);
      if (keyValueMatch) {
        if (currentKey)
          envVariables[currentKey] = currentValue.join("\n").trim();
        currentKey = keyValueMatch[1].trim();
        currentValue = [keyValueMatch[2].replace(/(^['"]|['"]$)/g, "")];
      } else if (currentKey) {
        currentValue.push(trimmedLine.replace(/(^['"]|['"]$)/g, ""));
      }
    });
    if (currentKey) envVariables[currentKey] = currentValue.join("\n").trim();
    Object.entries(envVariables).forEach(
      ([key, value]: [string, string]): void =>
        Commons.env.set(key, value.replace(/\\n/g, "\n"))
    );
  },
  /**
   * Loads the environment variables from a file if they have not already been loaded.
   *
   * @return {void} This function does not return a value.
   */
  loadEnvIfNeeded: (): void => {
    if (!envLoaded) {
      const envFilePath = Utils.findEnvFile(Commons.cwd());
      if (envFilePath) {
        Utils.setKey2Value(envFilePath);
        envLoaded = true;
      }
    }
  },
  /**
   * Capitalizes the first letter of a string.
   *
   * @param {string} str - The input string.
   * @return {string} The string with the first letter capitalized.
   */
  ucFirst: (str: string): string =>
    `${str.charAt(0).toUpperCase()}${str.slice(1)}`,
} as const;

export default Utils;
