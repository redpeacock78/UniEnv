"use strict";

class _Result<T, E extends Error> {
  isOk(): this is Ok<T> {
    return this instanceof Ok;
  }
  isNg(): this is Ng<E> {
    return this instanceof Ng;
  }
}

export class Ok<T> extends _Result<T, Error> {
  #value: T;
  constructor(value: T) {
    super();
    this.#value = value;
  }
  get value() {
    return this.#value;
  }
}

export class Ng<E extends Error> extends _Result<unknown, E> {
  #error: E;
  constructor(error: E) {
    super();
    this.#error = error;
  }
  get error() {
    return this.#error;
  }
}

export type Result<T, E extends Error> = Ok<T> | Ng<E>;
export type Nullish = null | undefined;
export type Maybe<T> = T | Nullish;

export type Path = string | URL;
export type Runtimes = "node" | "bun" | "deno";
export type Platforms =
  | "aix"
  | "android"
  | "darwin"
  | "freebsd"
  | "haiku"
  | "linux"
  | "openbsd"
  | "sunos"
  | "win32"
  | "cygwin"
  | "netbsd"
  | typeof DenoTypes.build.os;
export type Versions = {
  require: string;
  current: string;
};
export type PermissionDescriptor = {
  name: "run" | "read" | "write" | "net" | "env" | "hrtime" | "sys" | "ffi";
  path?: string | URL;
  host?: string;
  variable?: string;
  kind?:
    | "loadavg"
    | "hostname"
    | "systemMemoryInfo"
    | "networkInterfaces"
    | "osRelease"
    | "osUptime"
    | "uid"
    | "gid"
    | "username"
    | "cpus"
    | "homedir"
    | "statfs"
    | "getPriority"
    | "setPriority";
};
interface DenoTypes {
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
  permissions: {
    querySync: (desc: PermissionDescriptor) => {
      state: "granted" | "prompt" | "denied";
      partial?: boolean;
      onchange: null;
    };
  };
}
export declare const DenoTypes: DenoTypes;
