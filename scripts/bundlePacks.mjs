import { ThirdwebSDK } from "@thirdweb-dev/sdk";
import dotenv from "dotenv";
dotenv.config();

import fs from "fs";

(async () => {

    //define contract address
const packAddress ="0x68B5e9B4710583c3F6722541a574Af123F3111B2";
const tokenAddress = "0x9122e7F15E07f25De7c6ab75a73CF20301b8811f";
const editionAddress = "0x32675ca8F7Fd9686e5D5fd9975b58AC9DC848133";

//use private keys to instantiate thirdweb sdk
const sdk = ThirdwebSDK.fromPrivateKey(process.env.PRIVATE_KEY, "goerli");

//get pack contract address
const pack = sdk.getContract(packAddress);

//set approval for the pack contract to act upon token and edition contracts
const token = sdk.getContract(tokenAddress);
await token.setAllowance(packAddress, 45);
console.log("set approval for token");

//set approval for the pack contract to act upon yhr edition contract
const edition = sdk.getContract(editionAddress);
await edition.setApprovalForAll(packAddress, true);
console.log("set approval for all");

//read in the tresurechest as a file using fs
const chestFile = fs.readFileSync("./treasure chest.jpeg");

//upload chest to ipfs
const ipfsHash = await sdk.storage.upload(chestFile);
const url = ipfs.uris[0];
console.log("Upload chest asses tp ipfs");
console.log('Creating packs now');

const packNFTs = await pack.create({
    packMatadata: {
    name: "Treasure Chest",
    description:
    "A chest containing tools and treasure to help you on your voyages",
    image: url,
   },
   erc20Rewards: [
    {
        contractAddress: tokenAddress,
        quantityPerReward: 1,
        quantity: 45,
        totalRewards: 45,
    },
   ],
   erc1155Rewards: [
    {
        //silver swords
        contractAddress: editionAddress,
        tokenId: 0,
        quantityPerReward: 2,
        totalRewards: 100,
    },

    {
        //gold swords
        contractAddress: editionAddress,
        tokenId: 1,
        quantityPerReward: 1,
        totalRewards: 5,
    },
   ],
   rewardsPerPack: 5,
});
  console.log("Packs Created!!!");
})();