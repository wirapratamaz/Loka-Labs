import { Actor, HttpAgent } from '@dfinity/agent';
import { Principal } from '@dfinity/principal';
import fetch from 'isomorphic-fetch';

const CANISTER_ID = 'ypo2z-ayaaa-aaaam-qdjka-cai';
const ICP_HOST = process.env.ICP_HOST || 'https://ic0.app';

// Define the interface factory Candid IDL
const idlFactory = ({ IDL }: { IDL: any }) => {
  return IDL.Service({
    'getUserData': IDL.Func([IDL.Text], [IDL.Record({
      'referralCode': IDL.Text,
      'referrerCode': IDL.Text,
      'queueIdx': IDL.Nat,
      'rank': IDL.Vec(IDL.Tuple([IDL.Text, IDL.Nat])),
      'referralsLevel1': IDL.Nat,
      'referralsLevel2': IDL.Nat,
      'referralsLevel3': IDL.Nat,
      'referrerWallet': IDL.Text
    })], [])
  });
};

const createActor = () => {
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

  return Actor.createActor(idlFactory, {
    agent,
    canisterId: CANISTER_ID
  });
};

export const getUserData = async (principalId: string): Promise<any> => {
  try {
    const actor = createActor();
    const principal = Principal.fromText(principalId);
    return await actor.getUserData(principal.toString());
  } catch (error) {
    console.error('Error fetching user data from ICP canister:', error);
    throw error;
  }
};
