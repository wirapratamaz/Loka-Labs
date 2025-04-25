import { Actor, HttpAgent } from '@dfinity/agent';
import { Principal } from '@dfinity/principal';
import fetch from 'isomorphic-fetch';

const ICP_HOST = process.env.ICP_HOST || 'https://ic0.app';
const CANISTER_ID = process.env.ICP_CANISTER_ID || 'ypo2z-ayaaa-aaaam-qdjka-cai';

export const createPrincipal = (principalId: string): Principal => {
  try {
    return Principal.fromText(principalId);
  } catch (error) {
    throw new Error(`Invalid Principal ID format: ${principalId}`);
  }
};

// Cached agent here
let cachedAgent: HttpAgent | null = null;

export const createAgent = (): HttpAgent => {
  if (cachedAgent) {
    return cachedAgent;
  }

  const agent = new HttpAgent({
    host: ICP_HOST,
    fetch
  });

  // Only needed when working with local canisters
  if (ICP_HOST.includes('localhost')) {
    agent.fetchRootKey().catch(err => {
      console.warn('Unable to fetch root key. Check your local replica is running');
      console.error(err);
    });
  }

  cachedAgent = agent;
  return agent;
};

export const createActor = (
  agent: HttpAgent, 
  interfaceFactory: any, 
  canisterId = CANISTER_ID
): any => {
  return Actor.createActor(interfaceFactory, {
    agent,
    canisterId
  });
}; 