import { Env, getCurrentEnv } from "@/lib/env";
import { Address } from "@/types/common";

// Mainnet addresses
const MAINNET_APP_ADDRESS: Address = "0x637E685eF29403831dE51A58Bc8230b88549745E";
const MAINNET_BASE_FEED_ADDRESS: Address = "0x3BF4Eb9725232130F5dA804cD16bBdb61171cf28";
const MAINNET_ADMIN_USER_ADDRESS: Address = "0x8aE18FfF977aCc6Dc690C288a61004a7c7D5A931"; //UpdatedWeb3Forum
const MAINNET_LENS_CONTRACT_GROUP_MANAGER_ADDRESS: Address = "0xe12543e5f917adA5aeF92B26Bc08E1925ec9F53F";

// Testnet addresses
const TESTNET_APP_ADDRESS: Address = "0x23c579e074AFf0419F9b7Fca8CC12525dA7C8d29";
const TESTNET_BASE_FEED_ADDRESS: Address = "0xAC1e58dfe673Bd258ee2065F874841ef749ef28C";
const TESTNET_ADMIN_USER_ADDRESS: Address = "0xc93947ed78d87bdeb232d9c29c07fd0e8cf0a43e";
const TESTNET_LENS_CONTRACT_GROUP_MANAGER_ADDRESS: Address = "0xC93947eD78d87bdeB232D9c29C07Fd0E8cf0A43E";

// URLs
const MAINNET_APP_URL = "https://societyprotocol.xyz";
const TESTNET_APP_URL = "http://localhost:3000";

const env = getCurrentEnv();
const isTestnet = env === Env.TESTNET;

export const APP_ADDRESS: Address = isTestnet ? TESTNET_APP_ADDRESS : MAINNET_APP_ADDRESS;
export const BASE_FEED_ADDRESS: Address = isTestnet ? TESTNET_BASE_FEED_ADDRESS : MAINNET_BASE_FEED_ADDRESS;
export const ADMIN_USER_ADDRESS: Address = isTestnet ? TESTNET_ADMIN_USER_ADDRESS : MAINNET_ADMIN_USER_ADDRESS;
export const LENS_CONTRACT_GROUP_MANAGER: Address = isTestnet
  ? TESTNET_LENS_CONTRACT_GROUP_MANAGER_ADDRESS
  : MAINNET_LENS_CONTRACT_GROUP_MANAGER_ADDRESS;

export const APP_URL = isTestnet ? TESTNET_APP_URL : MAINNET_APP_URL;

// Common URLs
export const HEY_URL = "https://hey.xyz/";
export const GROVE_API_URL = "https://api.grove.storage/";
// Usage: import { APP_ADDRESS, BASE_FEED_ADDRESS, ADMIN_USER_ADDRESS } from '@/lib/constants';

export const APP_NAME = isTestnet ? "Web3 Forum Test" : "Web3 Forum";

// Paginations
export const COMMUNITIES_PER_PAGE = 10;
export const THREADS_PER_PAGE = 10;
