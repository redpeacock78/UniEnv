"use strict";
import Utils from "./utils.ts";
import { Maybe, Result, Ok, Ng } from "./types.ts";
import Commons, { RuntimeName } from "./commons.ts";

class VersionError extends Error {
  constructor(runtimeName: string, require: string, current: string) {
    super(
      `${runtimeName} version ${require} or higher is required. Current version: ${current}`
    );
    this.name = "VersionError";
  }
}

const setRuntimeMap = {
  /**
   * Sets the value for a key in the Node.js runtime map.
   *
   * @param {string} key - The key to set the value for.
   * @param {string} value - The value to set for the key.
   * @return {Result<void, VersionError>} Success if the value is set successfully, otherwise a VersionError.
   */
  node: (key: string, value: string): Result<void, VersionError> => {
    const require = Commons.runtime.version().require;
    const current = Commons.runtime.version().current;
    if (!Utils.versioning.moreThan(require, current))
      return new Ng(new VersionError("Node.js", require, current));
    return new Ok(Commons.env.set(key, value));
  },
  /**
   * Sets the value for a key in the Bun runtime map.
   *
   * @param {string} key - The key to set the value for.
   * @param {string} value - The value to set for the key.
   * @return {Result<void, VersionError>} Success if the value is set successfully, otherwise a VersionError.
   */
  bun: (key: string, value: string): Result<void, VersionError> => {
    const require = Commons.runtime.version().require;
    const current = Commons.runtime.version().current;
    if (!Utils.versioning.moreThan(require, current))
      return new Ng(new VersionError("Bun", require, current));
    return new Ok(Commons.env.set(key, value));
  },
  /**
   * Sets the value for a key in the Deno runtime map.
   *
   * @param {string} key - The key to set the value for.
   * @param {string} value - The value to set for the key.
   * @return {Result<void, VersionError>} Success if the value is set successfully, otherwise a VersionError.
   */
  deno: (key: string, value: string): Result<void, VersionError> => {
    const require = Commons.runtime.version().require;
    const current = Commons.runtime.version().current;
    if (!Utils.versioning.moreThan(require, current))
      return new Ng(new VersionError("Deno", require, current));
    return new Ok(Commons.env.set(key, value));
  },
};

const getRuntimeMap = {
  /**
   * Retrieves a value from the Node.js runtime map based on the provided key.
   *
   * @param {string} key - The key to retrieve the value for.
   * @return {Result<Maybe<string>, VersionError>} The value associated with the key or a VersionError.
   */
  node: (key: string): Result<Maybe<string>, VersionError> => {
    const runtime = Utils.capitalizeFirstLetter(`${RuntimeName}.js`);
    const require = Commons.runtime.version().require;
    const current = Commons.runtime.version().current;
    if (!Utils.versioning.moreThan(require, current))
      return new Ng(new VersionError(runtime, require, current));
    const envFileSpecified: string[] = process.execArgv.filter(
      (execArg: string): boolean => execArg.startsWith("--env-file=")
    );
    if (envFileSpecified.length)
      try {
        return new Ok<Maybe<string>>(Commons.env.get(key));
      } catch {
        return new Ng(new VersionError(runtime, "20.6.0", current));
      }
    Utils.loadEnvIfNeeded();
    return new Ok(Commons.env.get(key));
  },
  /**
   * Retrieves a value from the Bun runtime map based on the provided key.
   *
   * @param {string} key - The key to retrieve the value for.
   * @return {Result<Maybe<string>, VersionError>} The value associated with the key or a VersionError.
   */
  bun: (key: string): Result<Maybe<string>, VersionError> => {
    const runtime = Utils.capitalizeFirstLetter(RuntimeName);
    const require = Commons.runtime.version().require;
    const current = Commons.runtime.version().current;
    if (!Utils.versioning.moreThan(require, current))
      return new Ng(new VersionError(runtime, require, current));
    return new Ok(Commons.env.get(key));
  },
  /**
   * Retrieves a value from the Deno runtime map based on the provided key.
   *
   * @param {string} key - The key to retrieve the value for.
   * @return {Result<Maybe<string>, VersionError>} The value associated with the key or a VersionError.
   */
  deno: (key: string): Result<Maybe<string>, VersionError> => {
    const runtime = Utils.capitalizeFirstLetter(RuntimeName);
    const require = Commons.runtime.version().require;
    const current = Commons.runtime.version().current;
    if (!Utils.versioning.moreThan(require, current))
      return new Ng(new VersionError(runtime, require, current));
    Utils.loadEnvIfNeeded();
    return new Ok(Commons.env.get(key));
  },
};

const deleteRuntimeMap = {
  /**
   * Deletes a key from the Node.js runtime map if the runtime version is greater than or equal to the required version.
   *
   * @param {string} key - The key to delete from the Node.js runtime map.
   * @return {Result<void, VersionError>} - Returns a Result object containing a void value if the key is successfully deleted, or a VersionError if the runtime version is less than the required version.
   */
  node: (key: string): Result<void, VersionError | Error> => {
    const runtime = Utils.capitalizeFirstLetter(`${RuntimeName}.js`);
    const require = Commons.runtime.version().require;
    const current = Commons.runtime.version().current;
    if (!Utils.versioning.moreThan(require, current))
      return new Ng(new VersionError(runtime, require, current));
    try {
      return new Ok(Commons.env.delete(key));
    } catch (e: unknown) {
      return new Ng(new Error((e as Error).message));
    }
  },
  /**
   * Deletes a key from the Bun runtime map if the runtime version is greater than or equal to the required version.
   *
   * @param {string} key - The key to delete from the Bun runtime map.
   * @return {Result<void, VersionError>} - Returns a Result object containing a void value if the key is successfully deleted, or a VersionError if the runtime version is less than the required version.
   */
  bun: (key: string): Result<void, VersionError | Error> => {
    const runtime = Utils.capitalizeFirstLetter(RuntimeName);
    const require = Commons.runtime.version().require;
    const current = Commons.runtime.version().current;
    if (!Utils.versioning.moreThan(require, current))
      return new Ng(new VersionError(runtime, require, current));
    try {
      return new Ok(Commons.env.delete(key));
    } catch (e: unknown) {
      return new Ng(new Error((e as Error).message));
    }
  },
  /**
   * Deletes a key from the Deno runtime map if the runtime version is greater than or equal to the required version.
   *
   * @param {string} key - The key to delete from the Deno runtime map.
   * @return {Result<void, VersionError>} - Returns a Result object containing a void value if the key is successfully deleted, or a VersionError if the runtime version is less than the required version.
   */
  deno: (key: string): Result<void, VersionError> => {
    const runtime = Utils.capitalizeFirstLetter(RuntimeName);
    const require = Commons.runtime.version().require;
    const current = Commons.runtime.version().current;
    if (!Utils.versioning.moreThan(require, current))
      return new Ng(new VersionError(runtime, require, current));
    try {
      return new Ok(Commons.env.delete(key));
    } catch {
      return new Ng(new VersionError(runtime, require, current));
    }
  },
};

const UniEnv = {
  /**
   * Sets a key-value pair in the runtime map based on the runtime's name.
   *
   * @param {string} key - The key to set.
   * @param {string} value - The value to associate with the key.
   * @return {Result<void, VersionError>} The result of setting the key-value pair.
   */
  set(key: string, value: string): Result<void, VersionError> {
    return setRuntimeMap[RuntimeName]?.(key, value);
  },
  /**
   * Retrieves a value from the runtime map based on the provided key.
   *
   * @param {string} key - The key to retrieve the value for.
   * @return {Result<Maybe<string>, VersionError>} The value associated with the key or a VersionError.
   */
  get(key: string): Result<Maybe<string>, VersionError> {
    return getRuntimeMap[RuntimeName]?.(key);
  },
  /**
   * Deletes a key-value pair in the runtime map based on the runtime's name.
   *
   * @param {string} key - The key to delete.
   * @return {Result<void, VersionError | Error>} The result of deleting the key-value pair.
   */
  delete(key: string): Result<void, VersionError | Error> {
    return deleteRuntimeMap[RuntimeName]?.(key);
  },
};

export default UniEnv;
