pragma solidity ^0.4.4;

import "dapple/script.sol";
import "./feeds.sol";

contract DeployDSFeeds is Script {
  function DeployDSFeeds () {
    exportObject("feeds", new DSFeeds200());
  }
}
