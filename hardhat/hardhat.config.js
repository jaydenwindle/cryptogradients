require("@nomiclabs/hardhat-waffle");

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

const RINKEBY_PRIVATE_KEY =
  "e16e795ded582932f19a60e3e82ecd58bb83251fdf7a8b60c678f78ce57e7a84";

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.4",
  networks: {
    rinkeby: {
      url: "https://rinkeby.infura.io/v3/cdeb9df95808415ebe4e7c5a3e0606aa",
      accounts: [`0x${RINKEBY_PRIVATE_KEY}`],
    },
  },
};
