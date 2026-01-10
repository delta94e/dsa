/**
 * A utility class that wraps a Promise and exposes its resolve and reject methods.
 * This allows the promise to be settled externally, useful for event-based or callback-based APIs.
 * * @template T The type of the value that the promise resolves to.
 */
export default class Deferred<T = unknown> {
  public promise: Promise<T>;
  public resolve!: (value: T | PromiseLike<T>) => void;
  public reject!: (reason?: unknown) => void;

  constructor() {
    this.promise = new Promise<T>((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
    });
  }
}