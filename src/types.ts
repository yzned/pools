type Factory = {
	id: string;
	poolCount: bigint;
	txCount: bigint;
	totalVolumeUSD: number;
	totalVolumeETH: number;
	totalFeesUSD: number;
	totalFeesETH: number;
	untrackedVolumeUSD: number;
	totalValueLockedUSD: number;
	totalValueLockedETH: number;
	totalValueLockedUSDUntracked: number;
	totalValueLockedETHUntracked: number;
	owner: string;
};

type Bundle = {
	id: string;
	ethPriceUSD: number;
};

type Token = {
	id: string;
	symbol: string;
	name: string;
	decimals: bigint;
	totalSupply: bigint;
	volume: number;
	volumeUSD: number;
	untrackedVolumeUSD: number;
	feesUSD: number;
	txCount: bigint;
	poolCount: bigint;
	totalValueLocked: number;
	totalValueLockedUSD: number;
	totalValueLockedUSDUntracked: number;
	derivedETH: number;
	whitelistPools: Pool[];
	tokenDayData: TokenDayData[];
};

export type Pool = {
	id: string;
	createdAtTimestamp: bigint;
	createdAtBlockNumber: bigint;
	token0: Token;
	token1: Token;
	feeTier: bigint;
	liquidity: bigint;
	sqrtPrice: bigint;
	///how much token 0 do you need to give to get 1 token 1
	token0Price: number;
	///how much token 1 do you need to give to get 1 token 0
	token1Price: number;
	tick: bigint;
	observationIndex: bigint;
	volumeToken0: number;
	volumeToken1: number;
	volumeUSD: number;
	untrackedVolumeUSD: number;
	feesUSD: number;
	txCount: bigint;
	collectedFeesToken0: number;
	collectedFeesToken1: number;
	collectedFeesUSD: number;
	totalValueLockedToken0: number;
	totalValueLockedToken1: number;
	totalValueLockedETH: number;
	totalValueLockedUSD: number;
	totalValueLockedUSDUntracked: number;
	poolHourData: PoolHourData[];
	poolDayData: PoolDayData[];
	mints: Mint[];
	burns: Burn[];
	swaps: Swap[];
	collects: Collect[];
	ticks: Tick[];
};

type Tick = {
	id: string;
	poolAddress: string;
	tickIdx: bigint;
	pool: Pool;
	liquidityGross: bigint;
	liquidityNet: bigint;
	price0: number;
	price1: number;
	createdAtTimestamp: bigint;
	createdAtBlockNumber: bigint;
};

type Transaction = {
	id: string;
	blockNumber: bigint;
	timestamp: bigint;
	gasUsed: bigint;
	gasPrice: bigint;
	mints: Mint[];
	burns: Burn[];
	swaps: Swap[];
	flashed: Flash[];
	collects: Collect[];
};

type Mint = {
	id: string;
	transaction: Transaction;
	timestamp: bigint;
	pool: Pool;
	token0: Token;
	token1: Token;
	owner: string;
	sender: string | null;
	amount: bigint;
	amount0: number;
	amount1: number;
	amountUSD: number | null;
	tickLower: bigint;
	tickUpper: bigint;
	logIndex: bigint;
};

type Burn = {
	id: string;
	transaction: Transaction;
	pool: Pool;
	token0: Token;
	token1: Token;
	timestamp: bigint;
	owner: string | null;
	amount: bigint;
	amount0: number;
	amount1: number;
	amountUSD: number | null;
	tickLower: bigint;
	tickUpper: bigint;
	logIndex: bigint;
};

type Swap = {
	id: string;
	transaction: Transaction;
	timestamp: bigint;
	pool: Pool;
	token0: Token;
	token1: Token;
	sender: string;
	recipient: string;
	amount0: number;
	amount1: number;
	amountUSD: number;
	sqrtPriceX96: bigint;
	tick: bigint;
	logIndex: bigint;
};

type Collect = {
	id: string;
	transaction: Transaction;
	timestamp: bigint;
	pool: Pool;
	owner: string;
	amount0: number;
	amount1: number;
	amountUSD: number | null;
	tickLower: bigint;
	tickUpper: bigint;
	logIndex: bigint;
};

type Flash = {
	id: string;
	transaction: Transaction;
	timestamp: bigint;
	pool: Pool;
	sender: string;
	recipient: string;
	amount0: number;
	amount1: number;
	amountUSD: number;
	amount0Paid: number;
	amount1Paid: number;
	logIndex: bigint;
};

type UniswapDayData = {
	id: string;
	date: number;
	volumeETH: number;
	volumeUSD: number;
	volumeUSDUntracked: number;
	feesUSD: number;
	txCount: bigint;
	tvlUSD: number;
};

type PoolDayData = {
	id: string;
	date: number;
	pool: Pool;
	liquidity: bigint;
	sqrtPrice: bigint;
	token0Price: number;
	token1Price: number;
	tick: bigint;
	tvlUSD: number;
	volumeToken0: number;
	volumeToken1: number;
	volumeUSD: number;
	feesUSD: number;
	txCount: bigint;
	open: number;
	high: number;
	low: number;
	close: number;
};

type PoolHourData = {
	id: string;
	periodStartUnix: number;
	pool: Pool;
	liquidity: bigint;
	sqrtPrice: bigint;
	token0Price: number;
	token1Price: number;
	tick: bigint;
	tvlUSD: number;
	volumeToken0: number;
	volumeToken1: number;
	volumeUSD: number;
	feesUSD: number;
	txCount: bigint;
	open: number;
	high: number;
	low: number;
	close: number;
};

type TokenDayData = {
	id: string;
	date: number;
	token: Token;
	volume: number;
	volumeUSD: number;
	untrackedVolumeUSD: number;
	totalValueLocked: number;
	totalValueLockedUSD: number;
	priceUSD: number;
	feesUSD: number;
	open: number;
	high: number;
	low: number;
	close: number;
};
