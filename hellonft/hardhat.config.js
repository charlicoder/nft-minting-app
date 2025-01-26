require("@nomicfoundation/hardhat-toolbox");
// require("@nomicfoundation/hardhat-ignition");
const PRIVATE_KEY = vars.get("PRIVATE_KEY");
const RPC_URL = vars.get("RPC_URL");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.22",
  defaultNetwork: "localhost",
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545/",
    },
    sepolia: {
      url: `${RPC_URL}`,
      accounts: [`${PRIVATE_KEY}`]
    }
  }
}