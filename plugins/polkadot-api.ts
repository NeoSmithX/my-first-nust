
import { defineNuxtPlugin } from '#app';
import { ApiPromise, WsProvider } from '@polkadot/api';

export default defineNuxtPlugin(async (nuxtApp) => {
  // const wsProvider = new WsProvider('wss://rpc.astar.network');
  const wsProvider = new WsProvider('wss://fraa-flashbox-4274-rpc.a.stagenet.tanssi.network');
  const api = await ApiPromise.create({ provider: wsProvider });

  // Use `nuxtApp.provide` to inject globally
  nuxtApp.provide('polkadotApi', api);
});
