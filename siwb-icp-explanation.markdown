# Sign-In with Bitcoin (SIWB) and ICP Delegation Identity

Sign-In with Bitcoin (SIWB) enables users to authenticate to dApps using their Bitcoin wallets, leveraging Bitcoin's cryptographic signatures for secure, passwordless login. In SIWB, a user signs a predefined message (e.g., a nonce and timestamp) with their Bitcoin private key. The application verifies the signature against the user's Bitcoin address, confirming their identity without relying on centralized servers. This enhances security and user control, aligning with blockchain decentralized ethos.

On the Internet Computer (ICP), SIWB integrates with Internet Identity, a privacy-preserving authentication system. When a user authenticates via SIWB, Internet Identity generates a unique Principal for the dApp, preventing cross-dApp tracking. The system then creates a Delegation Identity, a temporary session key that signs on behalf of the user's main identity. This delegation, signed by the Internet Identity Service Canister, is unscoped and valid for up to 30 days (default 30 minutes), ensuring secure, time-limited access without exposing the main private key.

Delegation Identity is created by the canister signing a delegation chain from the user's identity to the session key, using chain-key cryptography. The session key is used for subsequent dApp interactions, such as transaction approvals, without requiring repeated authentication. Typical use cases include browser wallets and session-based dApps, where users authenticate once per session, streamlining user experience while maintaining security.

SIWB verification happens through specialized ICP canisters (smart contracts) like `ic_siwb_provider` that directly verify Bitcoin signatures on-chain. The authentication process supports both Bitcoin mainnet and testnet, offering flexibility for developers while maintaining strong security guarantees. Once validated through the Bitcoin Adapter, sessions typically last up to seven days, eliminating the need for frequent re-authentication while accessing dApps across the ICP ecosystem.

SIWB and ICP's Delegation Identity together provide a robust, decentralized authentication framework, combining Bitcoin's widespread adoption with ICP's scalable, privacy-focused infrastructure, ideal for secure and user-friendly dApp access.

## References

1. [Internet Computer: Authentication Overview](https://internetcomputer.org/docs/building-apps/authentication/overview)
2. [DFINITY Forum: Sign-In with Bitcoin on ICP](https://forum.dfinity.org/t/sign-in-with-bitcoin-on-icp/32734)
3. [GitHub: AstroxNetwork/ic-siwb](https://github.com/AstroxNetwork/ic-siwb)
4. [Loka Mining: Bitcoin as Your Key - How SIWB Is Redefining Web3 Authentication](https://blog.lokamining.com/bitcoin-as-your-key-how-siwb-is-redefining-web3-authentication/)
5. [Internet Computer: Internet Identity Specification](https://internetcomputer.org/docs/references/ii-spec)
