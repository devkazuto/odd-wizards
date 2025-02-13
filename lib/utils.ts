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
import { OPERATOR_CONSTANTS } from '@/constants/filterConstant';
import { UTApi } from 'uploadthing/server';

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
      return minuteReward || 0;

    case REWARD_PERIODE.HOUR:
      // Calculate points for hour-based rewards
      const hoursPassed = timeDifferenceMs / (1000 * 60 * 60);
      const hourReward = hoursPassed * (attrreward.attr_reward || 0) / 24;
      return hourReward || 0;

    case REWARD_PERIODE.DAY:
      // Calculate points for day-based rewards
      const daysPassed = timeDifferenceMs / (1000 * 60 * 60 * 24);
      const dayReward = daysPassed * (attrreward.attr_reward || 0);
      return dayReward || 0;

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


export async function getLaunchpad(address: string, walletAddress?: string) {
  if (!config) throw Error("Config not found");

  const query = `query MinterV2($address: String!, $walletAddress: String) {
    collection(address: $address) {
      __typename
      contractAddress
      contractUri
      name
      description
      website
      isExplicit
      minterAddress
      featured
      floor {
        amount
        amountUsd
        denom
        symbol
        __typename
      }
      creator {
        address
        name {
          name
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
      royaltyInfo {
        sharePercent
        __typename
      }
      minterV2(walletAddress: $walletAddress) {
        ...MinterV2Fields
        __typename
      }
      startTradingTime
      media {
        ...MediaFields
        __typename
      }
    }
  }

  fragment MinterV2Fields on MinterV2 {
    minterType
    minterAddress
    mintableTokens
    mintedTokens
    airdroppedTokens
    numTokens
    currentStage {
      id
      name
      type
      presaleType
      status
      startTime
      endTime
      salePrice {
        denom
        symbol
        amount
        amountUsd
        __typename
      }
      discountPrice {
        denom
        symbol
        amount
        amountUsd
        __typename
      }
      burnConditions {
        collectionAddress
        amountToBurn
        __typename
      }
      addressTokenCounts {
        limit
        mintable
        minted
        __typename
      }
      stageCounts {
        limit
        mintable
        minted
        __typename
      }
      numMembers
      isMember
      proofs
      __typename
    }
    mintStages {
      discountPrice {
        amount
        amountUsd
        denom
        symbol
        __typename
      }
      salePrice {
        amount
        amountUsd
        denom
        symbol
        __typename
      }
      burnConditions {
        collectionAddress
        amountToBurn
        __typename
      }
      status
      type
      id
      presaleType
      startTime
      endTime
      name
      isMember
      numMembers
      proofs
      addressTokenCounts {
        limit
        mintable
        minted
        __typename
      }
      stageCounts {
        limit
        mintable
        minted
        __typename
      }
      __typename
    }
    __typename
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
    const response = await fetch(`${config.graphql_url}?t=${new Date().getTime()}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache', // Untuk kompatibilitas dengan HTTP/1.0
        'Expires': '0' // Untuk memastikan browser lama juga tidak menyimpan cache
      },
      body: JSON.stringify({
        query,
        variables: {
          address,
          walletAddress
        },
        operationName: 'MinterV2'
      })
    });

    const data = await response.json();
    return data.data.collection;
} catch (error) {
    console.error('Error fetching launchpad data:', error);
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


export const arrayToString = (arr: any) => {
  return '[' + arr.join(', ') + ']';
}

export const addSearch = (column: any, value: any | undefined, opr: any, opr2?: any) => {
  if (!value) return;
  return {
    column,
    value,
    opr,
    opr2
  }
}

export const buildSearch = (data: any, params: any) => {
  if (!data) return;

  let filterStr = "";
  let i = 0;
  for (let filter of data) {
    if (!filter) continue;
    let comma = i > 0 ? "," : "";
    if (OPERATOR_CONSTANTS.LIKE == filter.opr) {
      filterStr += `${comma}${filter.column}=%${filter.value}%`;
    } else {

      if (Array.isArray(filter.value)) {
        if (filter.value.length == 0) continue;
        let value = encodeURIComponent("[" + buildSearch(filter.value, undefined) + "]");

        filterStr += `${comma}${filter.column}${filter.opr}${value}`;
      } else {
        filterStr += `${comma}${filter.column}${filter.opr}${filter.value}`;
      }
    }

    if (filter.opr2 != undefined && filter.opr2 != null) {
      filterStr += ":" + filter.opr2;
    }

    i++;
  }

  if (filterStr == "") return;

  if (params) {
    params["filter"] = filterStr;
  }

  return filterStr;
}

export const uploadFile = async (file: File) => {
  const utapi = new UTApi({
    token: process.env.UPLOADTHING_TOKEN // Gunakan environment variable
  });

  // uploadFiles mengembalikan Promise, jadi perlu await
  const uploadResult = await utapi.uploadFiles(file);

  return uploadResult.data?.url;
}