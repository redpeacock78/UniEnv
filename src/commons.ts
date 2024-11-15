"use strict";
import * as fs from "fs";
import process from "process";
import {
  Maybe,
  Path,
  Runtimes,
  Platforms,
  Versions,
  DenoTypes,
  PermissionDescriptor,
} from "./types.ts";

export declare const Deno: typeof DenoTypes;

let permissionLoaded: boolean = false;
let permissionResult: Maybe<"granted" | "prompt" | "denied">;
const Commons = {
  runtime: {
    name:
      typeof process === "undefined"
        ? "deno"
        : typeof process.title === "undefined"
        ? "deno"
        : (process.title.split("/").pop() as Runtimes),
    /**
     * Retrieves the required and current versions of the runtime.
     *
     * @return {Version} An object containing the required and current versions of the runtime.
     *                  - `require`: A string representing the required version of the runtime.
     *                              - For Node.js, it is set to "14.0.0".
     *                              - For Deno, it is set to "1.30.0".
     *                              - For Bun, it is set to "1.0".
     *                  - `current`: A string representing the current version of the runtime.
     *                              - For Node.js & Bun, it is set to the value of `process.versions.node`.
     *                              - For Deno, it is set to the value of `Deno.version.deno`.
     */
    version: (): Versions => {
      return {
        require:
          RuntimeName === "node"
            ? "14.0.0" // Node.js
            : RuntimeName === "deno"
            ? "1.30.0" // Deno
            : "1.0", // Bun
        current:
          RuntimeName !== "deno"
            ? process.versions.node // Node.js & Bun
            : Deno.version.deno !== ""
            ? Deno.version.deno // Deno
            : "1.30.0", // Deno Deploy
      };
    },
  },
  /**
   * Retrieves the platform based on the runtime.
   *
   * @return {Platforms} The platform based on the runtime.
   */
  platform: (): Platforms =>
    RuntimeName !== "deno" ? process.platform : Deno.build.os,
  /**
   * Returns the current working directory based on the runtime.
   *
   * @return {string} The current working directory.
   */
  cwd: (): string => (RuntimeName !== "deno" ? process.cwd() : Deno.cwd()),
  /**
   * Determines if a file exists synchronously based on the runtime.
   *
   * @param {Path} path - The path to the file.
   * @return {boolean} Whether the file exists or not.
   */
  existsSync: (path: Path): boolean =>
    RuntimeName !== "deno" ? fs.existsSync(path) : Deno.statSync(path).isFile,
  /**
   * Reads the content of a file synchronously based on the runtime.
   *
   * @param {Path} path - The path to the file.
   * @return {string} The content of the file as a string.
   */
  readTextFileSync: (path: Path): string =>
    RuntimeName !== "deno"
      ? fs.readFileSync(path).toString("utf8")
      : Deno.readTextFileSync(path),
  env: {
    /**
     * Retrieves the value of an environment variable based on the runtime.
     *
     * @param {string} name - The name of the environment variable.
     * @return {Maybe<string>} The value of the environment variable, or undefined if it does not exist.
     */
    get: (name: string): Maybe<string> =>
      RuntimeName !== "deno" ? process.env[name] : Deno.env.get(name),
    /**
     * Sets the value of an environment variable based on the runtime.
     *
     * @param {string} name - The name of the environment variable.
     * @param {string} value - The value to set for the environment variable.
     * @return {void} This function does not return a value.
     */
    set: (name: string, value: string): void => {
      RuntimeName !== "deno"
        ? (process.env[name] = value)
        : Deno.env.set(name, value);
    },
    /**
     * Deletes an environment variable based on the runtime.
     *
     * @param {string} name - The name of the environment variable to delete.
     * @return {void} The result of deleting the environment variable.
     */
    delete: (name: string): void => {
      RuntimeName !== "deno" ? delete process.env[name] : Deno.env.delete(name);
    },
  },
  /**
   * Checks the permission for the given `desc` and returns the result.
   *
   * @param {PermissionDescriptor} desc - The description of the permission to check.
   * @return {"granted" | "prompt" | "denied"} The result of the permission check. It contains the state of the permission,
   *                  whether it is partial, and the onchange event handler.
   */
  permissions: (
    desc: PermissionDescriptor
  ): Maybe<"granted" | "prompt" | "denied"> => {
    if (!permissionLoaded) {
      if (RuntimeName !== "deno") {
        permissionResult = null;
      } else {
        if (typeof Deno.permissions.querySync === "function") {
          permissionResult = Deno.permissions.querySync(desc).state; // Deno
        } else {
          permissionResult = "denied"; // Deno Deploy
        }
      }
      permissionLoaded = true;
    }
    return permissionResult;
  },
} as const;
const RuntimeName: Runtimes = Commons.runtime.name;

export default Commons;
export { RuntimeName };
