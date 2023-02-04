import { ThirdwebSDK } from "@thirdweb-dev/sdk";
import dotenv from "dotenv";
dotenv.config();
import fs from "fs";
import { ThirdwebStorage } from "@thirdweb-dev/storage";

(async () => {

    //define contract address
const packAddress ="0x68B5e9B4710583c3F6722541a574Af123F3111B2";
const tokenAddress = "0x9122e7F15E07f25De7c6ab75a73CF20301b8811f";
const editionAddress = "0x32675ca8F7Fd9686e5D5fd9975b58AC9DC848133";

//use private keys to instantiate thirdweb sdk

const sdk = ThirdwebSDK.fromPrivateKey(process.env.PRIVATE_KEY, "goerli");

const pack = await sdk.getContract(packAddress, 'pack');

// Set approval for the pack contract to act upon token and edition contracts
const token = await sdk.getContract(tokenAddress, 'token');
await token.setAllowance(packAddress, 100);

console.log("Set approval for token");

const edition = await sdk.getContract(editionAddress, 'edition');
await edition.setApprovalForAll(packAddress, true);

console.log("Set Approval for edition");

// Read in the chest.png as a File using fs
const chestFile = fs.readFileSync("./scripts/chest.jpeg");

// Upload the Chest to IPFS
const storage = new ThirdwebStorage();
const uri = await storage.upload(chestFile);

console.log("Uploaded chest asset to IPFS");

console.log("Creating packs now...");

const packNfts = await pack.create({
  packMetadata: {
    name: "Treasure Chest",
    description:
      "A chest containing tools and treasure to help you on your voyages.",
    image: uri,
  },

  // Gold coin ERC-20 Tokens
  erc20Rewards: [
    {
      contractAddress: tokenAddress,
      quantityPerReward: 2,
      quantity: 45,
      totalRewards: 20,
    },
  ],

  erc1155Rewards: [
   
    // Sword
    {
      contractAddress: editionAddress,
      tokenId:0,
      quantityPerReward: 5,
      totalRewards: 20,
    },
    
    // Gold sword
    {
      contractAddress: editionAddress,
      tokenId: 1,
      quantityPerReward: 1,
      totalRewards: 5,
    },
  ],
  rewardsPerPack: 1,
});

console.log(`====== Success: Pack NFTs =====`);

console.log(packNfts);
})();