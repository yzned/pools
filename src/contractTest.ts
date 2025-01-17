import Web3 from "web3";

const web3 = new Web3(
	"https://sepolia.infura.io/v3/8d5323e8639c469ba635e548b478b3ec",
);
// d72e85ce80c5e14bcbda1ece9c8e276786f98e70cc86890731efa33e20800cbb
const account = web3.eth.accounts.wallet.add(
	"0xd72e85ce80c5e14bcbda1ece9c8e276786f98e70cc86890731efa33e20800cbb",
);

web3.eth.getBalance(account[0].address).then((data) => {
	console.log(data);
});
