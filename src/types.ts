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
