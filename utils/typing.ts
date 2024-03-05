export type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;
export type Arguments<T> = T extends (...args: infer A) => any ? A : never;
