"use strict";
import * as fs from "fs";
import { Maybe } from "./types.ts";

type Path = string | URL;
interface process {
  title: string;
  versions: { node: string };
  platform:
    | "aix"
    | "darwin"
    | "freebsd"
    | "linux"
    | "openbsd"
    | "sunos"
    | "win32";
  env: { [key: string]: Maybe<string> };
  execArgv: string[];
  cwd(): string;
}
interface Deno {
  version: { deno: string };
  build: { os: "darwin" | "linux" | "windows" };
  env: {
    get(name: string): Maybe<string>;
    set(name: string, value: string): void;
    delete(name: string): void;
  };
  cwd(): string;
  readTextFileSync(path: Path): string;
  statSync(path: Path): {
    isFile: boolean;
  };
}
type Runtimes = "node" | "bun" | "deno";
type Versions = {
  require: string;
  current: string;
};
type Platforms = typeof process.platform | typeof Deno.build.os;
interface Commons {
  runtime: {
    name: Runtimes;
    version: () => Versions;
  };
  platform: () => Platforms;
  cwd: () => string;
  existsSync: (path: Path) => boolean;
  readTextFileSync: (path: Path) => string;
  env: {
    get: (name: string) => Maybe<string>;
    set: (name: string, value: string) => void;
    delete: (name: string) => void;
  };
}
declare const process: process;
declare const Deno: Deno;

const Commons = {
  runtime: {
    name:
      typeof process === "undefined"
        ? "deno"
        : (process.title.split("/").at(-1) as Runtimes),
    /**
     * Retrieves the required and current versions of the runtime.
     *
     * @return {Version} An object containing the required and current versions of the runtime.
     *                  - `require`: A string representing the required version of the runtime.
     *                              - For Node.js, it is set to "12.0.0".
     *                              - For Deno, it is set to "1.30.0".
     *                              - For Bun, it is set to "1.0".
     *                  - `current`: A string representing the current version of the runtime.
     *                              - For Node.js & Bun, it is set to the value of `process.versions.node`.
     *                              - For Deno, it is set to the value of `Deno.version.deno`.
     */
    version: (): Versions => {
      return {
        require:
          Commons.runtime.name === "node"
            ? "12.0.0" // Node.js
            : Commons.runtime.name === "deno"
            ? "1.30.0" // Deno
            : "1.0", // Bun
        current:
          Commons.runtime.name !== "deno"
            ? process.versions.node // Node.js & Bun
            : Deno.version.deno, // Deno
      };
    },
  },
  /**
   * Retrieves the platform based on the runtime.
   *
   * @return {Platforms} The platform based on the runtime.
   */
  platform: function (this: Commons): Platforms {
    return this.runtime.name !== "deno" ? process.platform : Deno.build.os;
  },
  /**
   * Returns the current working directory based on the runtime.
   *
   * @return {string} The current working directory.
   */
  cwd: function (this: Commons): string {
    return this.runtime.name !== "deno" ? process.cwd() : Deno.cwd();
  },
  /**
   * Determines if a file exists synchronously based on the runtime.
   *
   * @param {Path} path - The path to the file.
   * @return {boolean} Whether the file exists or not.
   */
  existsSync: function (this: Commons, path: Path): boolean {
    return this.runtime.name !== "deno"
      ? fs.existsSync(path)
      : Deno.statSync(path).isFile;
  },
  /**
   * Reads the content of a file synchronously based on the runtime.
   *
   * @param {Path} path - The path to the file.
   * @return {string} The content of the file as a string.
   */
  readTextFileSync: function (this: Commons, path: Path): string {
    return this.runtime.name !== "deno"
      ? fs.readFileSync(path).toString("utf8")
      : Deno.readTextFileSync(path);
  },
  env: {
    /**
     * Retrieves the value of an environment variable based on the runtime.
     *
     * @param {string} name - The name of the environment variable.
     * @return {Maybe<string>} The value of the environment variable, or undefined if it does not exist.
     */
    get: (name: string): Maybe<string> => {
      return Commons.runtime.name !== "deno"
        ? process.env[name]
        : Deno.env.get(name);
    },
    /**
     * Sets the value of an environment variable based on the runtime.
     *
     * @param {string} name - The name of the environment variable.
     * @param {string} value - The value to set for the environment variable.
     * @return {void} This function does not return a value.
     */
    set: (name: string, value: string): void => {
      Commons.runtime.name !== "deno"
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
      Commons.runtime.name !== "deno"
        ? delete process.env[name]
        : Deno.env.delete(name);
    },
  },
};

export default Commons;
