import { createAgent, createActor } from '../../utils/icp';
import { transformBigIntToNumber } from '../../utils/serialization';

const CANISTER_ID = 'ypo2z-ayaaa-aaaam-qdjka-cai';

// Define the interface factory Candid IDL
const idlFactory = ({ IDL }: { IDL: any }) => {
  return IDL.Service({
    'getUserData': IDL.Func([IDL.Text], [IDL.Record({
      'referralCode': IDL.Text,
      'referrerCode': IDL.Text,
      'queueIdx': IDL.Nat,
      'rank': IDL.Vec(IDL.Tuple(IDL.Text, IDL.Nat)),
      'referralsLevel1': IDL.Nat,
      'referralsLevel2': IDL.Nat,
      'referralsLevel3': IDL.Nat,
      'referrerWallet': IDL.Text
    })], [])
  });
};

export const getUserData = async (principalId: string): Promise<any> => {
  try {
    const agent = createAgent();
    const actor = createActor(agent, idlFactory, CANISTER_ID);
    const result = await actor.getUserData(principalId);
    
    return transformBigIntToNumber(result);
  } catch (error) {
    console.error('Error fetching user data from ICP canister:', error);
    
    if (error instanceof Error) {
      if (error.message.includes('Replica returned reject code')) {
        throw new Error(`ICP canister rejected the request. The principal ID may be invalid or the canister may be unavailable.`);
      }
      
      if (error.message.includes('Failed to fetch')) {
        throw new Error(`Failed to connect to the ICP network. Please check your network connection.`);
      }
    }
    
    throw error;
  }
};
