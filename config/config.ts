import { env } from 'process';
require('dotenv').config();

const config = (network: string) => {
  switch(network){
    case "testnet":
      return {
        collection_address: env.NEXT_PUBLIC_COLLECTION_ADDRESS || 'stars1n3hf6qf3azpx0ml9axn9pdgypr3sm07cgcmg0es7lq26vamhnmss742w7l',
        graphql_url: env.NEXT_PUBLIC_GRAPHQL_URL_TESTNET || 'https://galaxy-graphql-testnet.lab.stargaze-apis.com/graphql',
        rpc_url: env.RPC_URL || "https://rpc.stargaze-apis.com",
        ranking_reward: env.NEXT_PUBLIC_RANKING_RWARD_TESTNET || 100,
        base_url: 'https://www.oddsgarden.io',
        price_type: {
          "WZRD": env.NEXT_PUBLIC_COLLECTION_ADDRESS || 'stars1n3hf6qf3azpx0ml9axn9pdgypr3sm07cgcmg0es7lq26vamhnmss742w7l',
        },
        owners: ["stars1eqjmq52czppu4y7vy2qn0dvfjuyqelrwny4alg"],
        mnemonic_reward_wallet: env.REWARD_WALLET_MNEMONIC || ''
      }
    case "mainnet":
      return {
        collection_address: env.NEXT_PUBLIC_COLLECTION_ADDRESS || 'stars1vjxr6hlkjkh0z5u9cnktftdqe8trhu4agcc0p7my4pejfffdsl5sd442c7',
        graphql_url: env.NEXT_PUBLIC_GRAPHQL_URL_MAINNET || 'https://graphql.mainnet.stargaze-apis.com/graphql',
        rpc_url: env.RPC_URL || "https://rpc.stargaze-apis.com",
        ranking_reward: env.NEXT_PUBLIC_RANKING_RWARD_MAINNET || 100,
        base_url: 'https://www.oddsgarden.io',
        price_type: {
          "WZRD": env.NEXT_PUBLIC_COLLECTION_ADDRESS || 'stars1vjxr6hlkjkh0z5u9cnktftdqe8trhu4agcc0p7my4pejfffdsl5sd442c7',
        },
        owners: ["stars1eqjmq52czppu4y7vy2qn0dvfjuyqelrwny4alg", "stars1tc6prqsj5s3qqpkpam3jpjxh8gf8exgf7vp8z0", "stars130tcpz6l0j9f382prlj67r29jmr25cgpacmd7r"],
        mnemonic_reward_wallet: env.REWARD_WALLET_MNEMONIC || ''
      }
  }
}

const getConfig = () => {
  return config(env.NEXT_PUBLIC_NETWORK || 'mainnet');
};

export default getConfig;
