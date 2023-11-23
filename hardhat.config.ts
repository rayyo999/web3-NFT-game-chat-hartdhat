import { task } from 'hardhat/config';
import '@nomiclabs/hardhat-waffle';
import '@nomiclabs/hardhat-etherscan';
// to verify contract on etherscan
require('dotenv').config();

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task('accounts', 'Prints the list of accounts', async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: '0.8.4',
  networks: {
    rinkeby: {
      url: process.env.ALCHEMY_KEY_RINKEBY,
      accounts: [process.env.PRIVATE_KEY],
    },
    sepolia: {
      url: process.env.ALCHEMY_KEY_SEPOLIA,
      accounts: [process.env.PRIVATE_KEY],
    },
  },
  etherscan: {
    // to verify contract on etherscan
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
}

//npx hardhat verify --network rinkeby --constructor-args arguments.js 0x343D7A8676eC6FA6374C5F942Be6ef05E965FB5D
//npx hardhat verify --network goerli --constructor-args arguments.js 0x88693Fb6EB891940D44BaEC4675960405791fd4B