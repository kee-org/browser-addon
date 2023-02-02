declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $app: {
      context: string
    },
    $i18n: (messageName: string, substitutions?: any) => string
  }
}

// https://stackoverflow.com/a/64189046/479957
export {}
