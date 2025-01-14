import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Active, DataRef, Over } from '@dnd-kit/core';
import { ColumnDragData } from '@/components/kanban/board-column';
import { TaskDragData } from '@/components/kanban/task-card';
import { REWARD_PERIODE } from "@/constants";
import axios, { AxiosError } from "axios";
import { FetchAllStargazeTokensOptions, OwnedTokensResponse, Token } from "@/types";
import getConfig from '@/config/config';
import { mst_attributes_reward } from '@prisma/client';
import moment from 'moment';
import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";
import { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { GasPrice } from "@cosmjs/stargate";

const config = getConfig();

type DraggableData = ColumnDragData | TaskDragData;

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function hasDraggableData<T extends Active | Over>(
  entry: T | null | undefined
): entry is T & {
  data: DataRef<DraggableData>;
} {
  if (!entry) {
    return false;
  }

  const data = entry.data.current;

  if (data?.type === 'Column' || data?.type === 'Task') {
    return true;
  }

  return false;
}


export function formatAmount(amount: number | undefined | null) {
  if (!amount) return '0';
  return amount.toLocaleString('en-US'); // Menggunakan lokasi 'en-US' untuk memastikan koma sebagai pemisah ribuan
}


export default function calculatePoint(
  attrreward: mst_attributes_reward,
  lastClaimDate?: Date | null
): number {
  // Validate input
  if (!attrreward) return 0;

  // Get current time
  const currentTime = new Date();

  // If lastClaimDate is undefined, calculate for 1 full period
  if (!lastClaimDate) {
    switch (attrreward.attr_periode) {
      case REWARD_PERIODE.MINUTE:
      case REWARD_PERIODE.HOUR:
      case REWARD_PERIODE.DAY:
        return attrreward.attr_reward || 0;

      default:
        return 0;
    }
  }

  // Calculate time difference
  const timeDifferenceMs = currentTime.getTime() - lastClaimDate.getTime();

  // Calculate points based on reward period
  switch (attrreward.attr_periode) {
    case REWARD_PERIODE.MINUTE:
      // Calculate points for minute-based rewards
      const minutesPassed = timeDifferenceMs / (1000 * 60);
      const minuteReward = minutesPassed * (attrreward.attr_reward || 0) / 60;
      return Math.min(minuteReward, attrreward.attr_reward || 0);

    case REWARD_PERIODE.HOUR:
      // Calculate points for hour-based rewards
      const hoursPassed = timeDifferenceMs / (1000 * 60 * 60);
      const hourReward = hoursPassed * (attrreward.attr_reward || 0) / 24;
      return Math.min(hourReward, attrreward.attr_reward || 0);

    case REWARD_PERIODE.DAY:
      // Calculate points for day-based rewards
      const daysPassed = timeDifferenceMs / (1000 * 60 * 60 * 24);
      const dayReward = daysPassed * (attrreward.attr_reward || 0);
      return Math.min(dayReward, attrreward.attr_reward || 0);

    default:
      // If an unknown period is provided, return 0
      return 0;
  }
}

interface FetchStargazeTokensOptions {
  owner: string;
  collectionAddress?: string;
  maxTokens?: number;
  sortBy?: string;
  limit?: number;
  offset?: number;
  filterForSale?: string; // Add this new option
}

export async function fetchStargazeTokens(options: FetchStargazeTokensOptions): Promise<OwnedTokensResponse> {
  if (!config) throw Error("Config not found");

  const {
    owner,
    collectionAddress,
    maxTokens = Infinity,
    sortBy = 'ACQUIRED_DESC',
    limit = 10,
    offset = 0,
    filterForSale // Extract the new option
  } = options;

  const query = `
    query OwnedTokens(
      $owner: String, 
      $limit: Int, 
      $offset: Int, 
      $filterByCollectionAddrs: [String!], 
      $sortBy: TokenSort,
      $filterForSale: SaleType
    ) {
      tokens(
        ownerAddrOrName: $owner
        limit: $limit
        offset: $offset
        filterByCollectionAddrs: $filterByCollectionAddrs
        sortBy: $sortBy
        filterForSale: $filterForSale
      ) {
        tokens {
          id
          tokenId
          name
          mintedAt
          collection {
            name
            contractAddress
          }
          traits {
            name 
            value
            rarityPercent
            rarity
          }
          media {
            url
            type
          }
        }
        pageInfo {
          total
          limit
          offset
        }
      }
    }
  `;

  const variables = {
    owner,
    limit: Math.min(limit, maxTokens),
    offset,
    filterByCollectionAddrs: collectionAddress ? [collectionAddress] : undefined,
    sortBy,
    filterForSale // Add to variables
  };

  try {
    const response = await axios.post(config.graphql_url, {
      query,
      variables
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    return response.data?.data?.tokens || {};
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function fetchAllStargazeTokens(options: FetchAllStargazeTokensOptions): Promise<Token[]> {

  if (!config) throw Error("Config not found");

  const {
    owner,
    collectionAddress,
    sortBy = 'ACQUIRED_DESC',
    filterForSale
  } = options;

  let allTokens: Token[] = [];
  let offset = 0;
  const limit = 100; // Recommended batch size

  while (true) {
    const resp: OwnedTokensResponse = await fetchStargazeTokens({
      owner,
      collectionAddress,
      maxTokens: limit,
      sortBy,
      limit,
      offset,
      filterForSale
    });

    // Add fetched tokens to the collection
    allTokens = [...allTokens, ...resp.tokens];

    // Check if we've reached the end or maxTokens limit
    if (resp.tokens.length === 0 || allTokens.length >= resp.pageInfo.total) {
      break;
    }

    // Increment offset for next iteration
    offset += limit;

    // Optional: Add a small delay to prevent rate limiting
    await new Promise(resolve => setTimeout(resolve, 250));
  }

  return allTokens;
}

export async function getCollection(collection_address: string) {
  if (!config) throw Error("Config not found");

  const query = `
  query CollectionHeaderStats($collectionAddr: String!) {
    collection(address: $collectionAddr) {
      __typename
      creationTime
      contractAddress
      floor {
        ...fragmentCoinAmountWithConversion
        __typename
      }
      highestOffer {
        offerPrice {
          ...fragmentCoinAmountWithConversion
          __typename
        }
        __typename
      }
      startTradingTime
      tokenCounts {
        listed
        active
        __typename
      }
      stats {
        bestOffer
        bestOfferUsd
        collectionAddr
        change24HourPercent
        change7DayPercent
        volume24Hour
        volume7Day
        volumeUsd24hour
        volumeUsd7day
        numOwners
        uniqueOwnerPercent
        __typename
      }
      provenance {
        chainId
        __typename
      }
    }
  }

  fragment fragmentCoinAmountWithConversion on CoinAmount {
    id
    amount
    amountUsd
    denom
    symbol
    rate
    nativeConversion {
      amount
      amountUsd
      denom
      symbol
      rate
      __typename
    }
    __typename
  }
`;


  try {
    const response = await fetch(config.graphql_url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        variables: {
          collectionAddr: collection_address
        },
        operationName: 'CollectionHeaderStats'
      })
    });

    const data = await response.json();
    return data.data.collection;
  } catch (error) {
    console.error('Error fetching collection stats:', error);
    throw error;
  }
}

export async function getAssosiatedName(associated_address: string) {
  if (!config) throw Error("Config not found");

  const query = `
    query AssociatedName($associatedAddr: String!) {
      names(associatedAddr: $associatedAddr) {
        names {
          name
          associatedAddr
          ownerAddr
          media {
            ...MediaFields
            __typename
          }
          records {
            name
            value
            verified
            __typename
          }
          __typename
        }
        __typename
      }
    }

    fragment MediaFields on Media {
      type
      url
      height
      width
      visualAssets {
        xs {
          type
          url
          height
          width
          staticUrl
          __typename
        }
        sm {
          type
          url
          height
          width
          staticUrl
          __typename
        }
        md {
          type
          url
          height
          width
          staticUrl
          __typename
        }
        lg {
          type
          url
          height
          width
          staticUrl
          __typename
        }
        xl {
          type
          url
          height
          width
          staticUrl
          __typename
        }
        __typename
      }
      __typename
    }`;

  try {
    const response = await fetch(config.graphql_url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        variables: {
          associatedAddr: associated_address
        },
        operationName: 'AssociatedName'
      })
    });

    const data = await response.json();
    return data.data.names;
  } catch (error) {
    console.error('Error fetching associated name:', error);
    throw error;
  }
}

export async function getToken(collectionAddr: string, tokenId: string) {
  if (!config) throw Error("Config not found");

  const query = `query Token($collectionAddr: String!, $tokenId: String!) {
    token(collectionAddr: $collectionAddr, tokenId: $tokenId) {
      id
      name
      description
      tokenId
      isExplicit
      media {
        type
        url
        height
        width
        visualAssets {
          xs {
            type
            url
            height
            width
            staticUrl
          }
          sm {
            type
            url
            height
            width
            staticUrl
          }
          md {
            type
            url
            height
            width
            staticUrl
          }
          lg {
            type
            url
            height
            width
            staticUrl
          }
          xl {
            type
            url
            height
            width
            staticUrl
          }
        }
      }
      collection {
        contractAddress
        contractUri
        name
        tradingAsset {
          exponent
          denom
          price
          symbol
        }
        startTradingTime
        tokenCounts {
          active
          total
        }
        mintStatus
        floorPrice
        royaltyInfo {
          sharePercent
        }
      }
      traits {
        name
        value
        rarityPercent
        rarity
        floorPrice {
          amount
          amountUsd
          denom
          symbol
        }
      }
      listPrice {
        amount
        amountUsd
        denom
        symbol
        rate
      }
      owner {
        address
        name {
          name
        }
      }
      saleType
      expiresAtDateTime
      rarityOrder
      rarityScore
      isEscrowed
      onlyOwner
      lastSalePrice {
        amount
        amountUsd
        denom
        symbol
      }
      auction {
        duration
        startTime
        endTime
        highestBid {
          id
          type
          offerPrice {
            amount
            amountUsd
            denom
            symbol
          }
          from {
            address
            name {
              name
            }
          }
        }
        seller {
          address
          name {
            name
          }
        }
      }
    }
  }`;

  try {
    const response = await fetch(config.graphql_url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        variables: {
          collectionAddr,
          tokenId
        },
        operationName: 'Token'
      })
    });

    const data = await response.json();
    return data.data.token;
  } catch (error) {
    console.error('Error fetching token:', error);
    throw error;
  }
}


export function formatToStars(value?: string | number): number {
  if (!value) return 0;
  let number = typeof value === 'string' ? parseFloat(value) : value;

  number /= 1000000;

  // return formatDecimal(number, 2);
  return number;
}

export function formatDecimal(value?: string | number | null | undefined, decimal: number = 2): string {
  if (!value) return '0';
  let number = typeof value === 'string' ? parseFloat(value) : value;

  if (number >= 1_000_000) {
    return `${(number / 1_000_000).toFixed(decimal)}M`;
  } else if (number >= 1_000) {
    return `${(number / 1_000).toFixed(decimal)}K`;
  }

  return `${number.toFixed(0)}`;
}

export function formatAddress(address: string | undefined) {
  if (!address) return '';
  return `${address.substring(5, 9)}...${address.substring(address.length - 4)}`
}

export function formatDate(date: Date, format = 'YYYY-MM-DD HH:mm:ss') {
  if (date == null) return;
  return moment(date).format(format);
}

export function extractCollectionAndTokenId(url: string) {
  const regex = /\/m\/([^/]+)\/(\d+)/;
  const match = url?.match(regex);

  if (match) {
      return {
          collection: match[1],
          tokenId: match[2],
      };
  } else {
      // throw new Error("URL format is invalid");
      return {
          collection: undefined,
          tokenId: undefined,
      };
  }
}

export async function transferNFT(
  mnemonic: string, 
  contractAddress: string, 
  recipientAddress: string, 
  tokenId: string
) {
  try {
      const rpcEndpoint = config?.rpc_url ?? ""; // Ganti dengan RPC Stargaze yang valid
      // Create wallet instance from mnemonic
      const wallet = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic, {
          prefix: "stars" // Stargaze address prefix
      });

      // Get the wallet address
      const [firstAccount] = await wallet.getAccounts();
      console.log("Sender address:", firstAccount.address);

      // Create signing client
      const client = await SigningCosmWasmClient.connectWithSigner(
          rpcEndpoint,
          wallet,
          {
              gasPrice: GasPrice.fromString("0.025ustars")
          }
      );

      // Prepare transfer message
      const transferMsg = {
          transfer_nft: {
              recipient: recipientAddress,
              token_id: tokenId
          }
      };

      // Execute transfer
      const result = await client.execute(
          firstAccount.address,
          contractAddress,
          transferMsg,
          "auto", // automatic gas estimation
          "",     // memo
          []      // funds
      );

      console.log("Transfer successful!");
      console.log("Transaction hash:", result.transactionHash);
      return result;

  } catch (error) {
      console.error("Error during transfer:", error);
      throw error;
  }
}
