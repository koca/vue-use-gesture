declare module '*.json' {
  const value: any;
  export default value;
}
declare module '*.scss' {
  const content: any;
  export default content;
}
declare module '*.css' {
  interface IClassNames {
    [className: string]: string;
  }
  const classNames: IClassNames;
  export = classNames;
}
