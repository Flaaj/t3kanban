export type ArrayElement<Type> = Type extends Array<infer Item> ? Item : Type;
