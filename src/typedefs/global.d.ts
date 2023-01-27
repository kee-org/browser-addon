declare const __DEV__: boolean

declare module '*.vue' {
  const component: any
  export default component
}
// declare global {
//     interface Window {
//       //TODO: See if it is possible to manage the persistent external connection and
//       // in-memory caches without a global var nowadays
//         kee: Kee;
//     }
// }
// interface Window {
//     //TODO: See if it is possible to manage the persistent external connection and
//     // in-memory caches without a global var nowadays
//       kee: Kee;
//   }

declare module 'vue' {
    import { CompatVue } from '@vue/runtime-dom'
    const Vue: CompatVue
    export default Vue
    export * from '@vue/runtime-dom'
    const { configureCompat } = Vue
    export { configureCompat }
  }
