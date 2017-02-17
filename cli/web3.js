const Web3 = require('web3');

const web3 = new Web3(this.web3 ? this.web3.currentProvider : (
  new Web3.providers.HttpProvider('http://localhost:8545')
));

module.exports = web3;
