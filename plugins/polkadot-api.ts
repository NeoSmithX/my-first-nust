
// plugins/polkadot-api.js
import Vue from 'vue';
import { ApiPromise, WsProvider } from '@polkadot/api';

export default async (context: any, inject: (arg0: string, arg1: ApiPromise) => void) => {
  // Connect to the Polkadot node
  const wsProvider = new WsProvider('wss://rpc.astar.network');
  
  // Create the API instance
  const api = await ApiPromise.create({ provider: wsProvider });

  // Inject the API instance into all components and the context
  // so it can be accessed as this.$polkadotApi inside components
  // and context.$polkadotApi inside asyncData, fetch, plugins, middleware, etc.
  inject('polkadotApi', api);

  // Optional: Make the API instance available in the Vue prototype
  // Vue.prototype.$polkadotApi = api; // For Vue 2.x compatibility
};
