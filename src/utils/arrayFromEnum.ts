const arrayFromEnum = <T>(Enum: T) => Object.keys(Enum) as Array<keyof typeof Enum>;

export default arrayFromEnum;
