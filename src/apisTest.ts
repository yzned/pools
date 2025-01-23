import axios from "axios";
import { createObjectCsvWriter } from "csv-writer";

const WETH_CONTRACT_ADDRESS =
	"arbitrum_0x82af49447d8a07e3bd95bd0d56f35241523fbab1";

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const getEthPool = async (tokenId: string) => {
	const ethPoolsIds = [];

	for (let i = 1; i <= 10; i++) {
		//in this request possibly max 10 pages
		try {
			const allTokensResponse = await axios.get(
				`https://api.geckoterminal.com/api/v2/networks/arbitrum/tokens/${tokenId}/pools?page=${i}`,
				{
					headers: {
						Accept: "application/json",
					},
				},
			);

			allTokensResponse.data.data.map((pool) => {
				if (
					(pool.relationships.base_token.data.id === WETH_CONTRACT_ADDRESS ||
						pool.relationships.quote_token.data.id === WETH_CONTRACT_ADDRESS) &&
					pool.relationships.dex.data.id === "uniswap_v3_arbitrum"
				) {
					ethPoolsIds.push(pool.id);
				}
			});
		} catch (err) {
			console.log(tokenId);
		}
		await delay(2500);
	}
	return ethPoolsIds;
};

const getTokensDataCMC = async () => {
	try {
		let start = 1;
		const end = 20000;

		const csvWriter = createObjectCsvWriter({
			path: "tokens2.csv",
			header: [
				{ id: "id", title: "ID" },
				{ id: "name", title: "Name" },
				{ id: "description", title: "Description" },
				{ id: "symbol", title: "Symbol" },
				{ id: "logo", title: "Logo" },
				{ id: "contractAddress", title: "Contract Address" },
				{ id: "tags", title: "Tags" },
				{ id: "urls", title: "Urls" },
				{ id: "ethPoolsIds", title: "Ethereum pools ids" },
			],
			append: false,
		});

		while (start <= end) {
			console.log(`Fetching data with start=${start}...`);

			const allTokensResponse = await axios.get(
				`https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?start=${start}&limit=100`,
				{
					headers: {
						"X-CMC_PRO_API_KEY": "c17131cb-043d-466a-8e0f-dce435f2f06d",
						Accept: "application/json",
					},
				},
			);

			const allTokens = allTokensResponse.data.data;
			const batchSize = 100;
			const batches = [];

			for (let i = 0; i < allTokens.length; i += batchSize) {
				batches.push(allTokens.slice(i, i + batchSize));
			}

			const metadata = {};

			for (const batch of batches) {
				const ids = batch.map((token) => token.id).join(",");
				const infoUrl = `https://pro-api.coinmarketcap.com/v2/cryptocurrency/info?id=${ids}`;

				const metaDataTokensResponse = await axios.get(infoUrl, {
					headers: {
						"X-CMC_PRO_API_KEY": "c17131cb-043d-466a-8e0f-dce435f2f06d",
						Accept: "application/json",
					},
				});

				Object.assign(metadata, metaDataTokensResponse.data.data);

				await delay(2500);
			}

			const mergedTokensData = allTokens
				.map((token) => {
					const info = metadata[token.id.toString()];

					const hasArbitrum =
						info.contract_address &&
						info.contract_address.some(
							(contract) => contract.platform.name === "Arbitrum",
						);

					if (hasArbitrum) {
						const arbitrumContractAddress = info.contract_address
							? info.contract_address.find(
									(contract) => contract.platform.name === "Arbitrum",
								)
							: null;

						return {
							id: token.id,
							name: token.name,
							symbol: token.symbol,
							tags: token.tags,
							logo: info ? info.logo : null,
							description: info ? info.description : null,
							contractAddress: arbitrumContractAddress
								? arbitrumContractAddress.contract_address
								: null,
							urls: info ? info.urls : [],
						};
					}

					return null;
				})
				.filter((token) => token !== null);

			const tokensWithPools = [];

			let i = 0;

			for (const token of mergedTokensData) {
				console.log("token: ", token.contractAddress, "   step:", i);
				try {
					const ethPoolsIds = await getEthPool(token.contractAddress);

					if (ethPoolsIds.length !== 0) {
						tokensWithPools.push({
							id: token?.id,
							logo: token?.logo,
							name: token?.name,
							symbol: token?.symbol,
							description: token?.description,
							contractAddress: token.contractAddress,
							ethPoolsIds: ethPoolsIds,
							tags: token.tags,
							urls: token?.urls,
						});
					}
				} catch (error) {
					console.error(`ошибка`);
				}
				i++;
			}

			const csvData = tokensWithPools.map((token) => ({
				id: token?.id,
				logo: token?.logo,
				name: token?.name,
				symbol: token?.symbol,
				description: token?.description,
				contractAddress: token.contractAddress,
				ethPoolsIds: JSON.stringify(token.ethPoolsIds),
				tags: JSON.stringify(token.tags),
				urls: token?.urls ? JSON.stringify(token.urls) : null,
			}));

			await csvWriter.writeRecords(csvData);
			console.log(`Data with start=${start} written to CSV!`);

			start += 5000;

			await delay(2500);
		}

		console.log("All data processed successfully!");
	} catch (error) {
		console.log("Error:", error.message);
	}
};

getTokensDataCMC();
