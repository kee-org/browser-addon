declare const __DEV__: boolean

declare module '*.vue' {
  const component: any
  export default component
}

declare module '@grapoza/vue-tree';
