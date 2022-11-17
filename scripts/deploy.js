const hre = require("hardhat");
const fs = require('fs');

async function main() {
  const NFT = await hre.ethers.getContractFactory("PoulinaToken");
  const nft = await NFT.deploy();
  await nft.deployed();
  console.log("Poulina Token deployed to:", nft.address);

  const NFTMarket = await hre.ethers.getContractFactory("PoulinaMarketplace");
  const nftMarket = await NFTMarket.deploy(nft.address);
  await nftMarket.deployed();
  console.log("Poulina Marketplace deployed to:", nftMarket.address);

  await (await nft.setMarketAddress(nftMarket.address)).wait()

  let config = `
  export const nftmarketaddress = "${nftMarket.address}"
  export const nftaddress = "${nft.address}"
  `

  let data = JSON.stringify(config)
  fs.writeFileSync('config.js', JSON.parse(data))
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
