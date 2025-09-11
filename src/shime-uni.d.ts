export { }

declare module "vue" {
  type Hooks = App.AppInstance & Page.PageInstance;
  interface ComponentCustomOptions extends Hooks { }
}

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    getOpenerEventChannel: () => UniApp.EventChannel
  }
}