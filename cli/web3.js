const Web3 = require('web3');

module.exports = (prefs) => {
  const HOST = prefs.rpcHost || 'localhost';
  const PORT = prefs.rpcPort || 8545;
  const URL = `http://${HOST}:${PORT}`;
  const web3 = new Web3(this.web3 ? this.web3.currentProvider : (
    new Web3.providers.HttpProvider(URL)
  ));

  return web3;
};
