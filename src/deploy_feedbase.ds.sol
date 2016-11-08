pragma solidity ^0.4.4;

import "dapple/script.sol";
import "./feedbase.sol";

contract DeployFeedbase is Script {
  function DeployFeedbase () {
    exportObject("feedbase", new Feedbase());
  }
}
