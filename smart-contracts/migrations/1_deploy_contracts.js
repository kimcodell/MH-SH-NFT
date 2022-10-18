// const ConvertLib = artifacts.require("ConvertLib");
// const MetaCoin = artifacts.require("MetaCoin");
const MhShNft = artifacts.require("MhShNft");

module.exports = function(deployer) {
  deployer.deploy(MhShNft);
  // deployer.deploy(ConvertLib);
  // deployer.link(ConvertLib, MetaCoin);
  // deployer.deploy(MetaCoin);
};
