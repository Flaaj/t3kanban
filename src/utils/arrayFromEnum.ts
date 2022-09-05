const arrayFromEnum = <T extends Object>(Enum: T) => Object.keys(Enum) as Array<keyof typeof Enum>;

export default arrayFromEnum;
