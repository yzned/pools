import { request, gql } from "graphql-request";
import type { Pool } from "./types";

type Token = {
	assetAddress: string;
	amount?: number;
};
const ETH_COURSE = 3207.4;

const getPools = async () => {
	const endpoint =
		"https://gateway.thegraph.com/api/ec28c7ffc5693194cea068c6523459d0/subgraphs/id/5zvR82QoaXYFyDEKLZ9t6v9adgnptxYpKpSbxtgVENFV";

	const query = gql`{
  	pools(first:1000 , orderBy: totalValueLockedUSD, orderDirection: desc){
	token0{
		id 
		name
		derivedETH
	}
	feeTier
	token1{
		id 
		name
		derivedETH
	}
  	totalValueLockedUSD
    token0Price
    token1Price
  	}
	}`;
	try {
		const data = (await request(endpoint, query)) as { pools: Pool[] };
		return data;
	} catch (error) {
		console.error("Error", error);
	}
};

const getBetterPoolChain = async (tokenIn: Token, tokenOut: Token) => {
	// const data = {
	// 	pools: [
	// 		{
	// 			feeTier: "3000",
	// 			token0: {
	// 				derivedETH: "0.004081414913742245853097969070349471",
	// 				id: "0x1f9840a85d5af5bf1d1762f925bdaddc4201f984",
	// 				name: "Uniswap",
	// 			},
	// 			token0Price: "245.0130704998823197240231205222925",
	// 			token1: {
	// 				derivedETH: "1",
	// 				id: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
	// 				name: "Wrapped Ether",
	// 			},
	// 			token1Price: "0.004110874477544253612848641192523429",
	// 			totalValueLockedUSD: "74467840.31463499723057385209709219",
	// 		},
	// 		{
	// 			feeTier: "10000",
	// 			token0: {
	// 				derivedETH: "0.004081414913742245853097969070349471",
	// 				id: "0x1f9840a85d5af5bf1d1762f925bdaddc4201f984",
	// 				name: "Uniswap",
	// 			},
	// 			token0Price: "243.2572450125935493384535313767488",
	// 			token1: {
	// 				derivedETH: "1",
	// 				id: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
	// 				name: "Wrapped Ether",
	// 			},
	// 			token1Price: "0.004110874477544253612848641192523429",
	// 			totalValueLockedUSD: "8773117.893332440416886533650954554",
	// 		},
	// 	],
	// };
	const data = await getPools();
	let minDifference = Number.POSITIVE_INFINITY;
	let bestPool: Pool;

	for (const pool of data?.pools || []) {
		const token0 = pool?.token0;
		const token1 = pool?.token1;

		if (
			(token0.id === tokenIn.assetAddress &&
				token1.id === tokenOut.assetAddress) ||
			(token1.id === tokenIn.assetAddress &&
				token0.id === tokenOut.assetAddress)
		) {
			const fee = pool?.feeTier / 10000;

			// Курс обмена токенов
			const exchangeRate =
				tokenIn.assetAddress === token0.id
					? pool.token1Price
					: pool.token0Price;

			// Рассчёт количества tokenOut после учета комиссии
			const amountInAfterFee = tokenIn.amount - (tokenIn.amount / 100) * fee;

			const tokenOutAmount = amountInAfterFee * exchangeRate;

			const tokenInDerivedETH =
				tokenIn.assetAddress === token0.id
					? token0.derivedETH
					: token1.derivedETH;

			const tokenOutDerivedETH =
				tokenIn.assetAddress === token0.id
					? token1.derivedETH
					: token0.derivedETH;

			const tokenInUSD = tokenIn.amount * tokenInDerivedETH * ETH_COURSE;

			// console.log("tokenInUSD: ", tokenInUSD);

			const tokenOutInUSD = tokenOutAmount * tokenOutDerivedETH * ETH_COURSE;
			// console.log("tokenOutInUSD: ", tokenOutInUSD);

			const difference = tokenInUSD - tokenOutInUSD;

			if (difference <= minDifference) {
				minDifference = difference;
				bestPool = pool;
			}

			// console.log("weight: ", weight);

			// console.log("Amount In (USD):", tokenInUSD);
			// console.log("Amount In (after fee):", amountInAfterFee);
			// console.log("Token Out Amount:", tokenOutAmount);
			// console.log("Token Out in USD:", tokenOutInUSD);
			// console.log("Weight (USD):", weight);
		}
	}
	console.log("minDifference: ", minDifference);
	console.log("bestPool: ", bestPool);
};

getBetterPoolChain(
	{
		amount: 1,
		assetAddress: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
	},
	{
		assetAddress: "0xdac17f958d2ee523a2206206994597c13d831ec7",
	},
);
