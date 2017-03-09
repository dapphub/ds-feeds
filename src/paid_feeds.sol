/*
   Copyright 2016 Nexus Development, LLC

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/

pragma solidity ^0.4.8;

import "erc20/erc20.sol";
import "./interface.sol";
import "./feeds.sol";

contract PaidDSFeedsEvents is DSFeedsEvents {
    event LogSetPrice  (bytes12 indexed id, uint price);
    event LogPay       (bytes12 indexed id, address indexed user);
}

contract PaidDSFeeds is PaidDSFeedsEvents, DSFeeds {
    mapping(bytes12=>FeeConfig) fee_config;
    struct FeeConfig {
        ERC20      token;
        uint       price;
        bool       unpaid;
    }
    function unpaid(bytes12 id) constant returns (bool) {
        return fee_config[id].unpaid;
    }
    function price(bytes12 id) constant returns (uint) {
        return fee_config[id].price;
    }
    function token(bytes12 id) constant returns (ERC20) {
        return fee_config[id].token;
    }
    function free(bytes12 id) constant returns (bool) {
        return token(id) == ERC20(0);
    }
    function claim(ERC20 token) returns (bytes12 id) {
        id = super.claim();
        fee_config[id].token = token;
        return id;
    }
    function can_get(address user, bytes12 id)
        internal returns (bool)
    {
        if (expired(id)) {
            return false;
        } else if (unpaid(id)) {
            return try_pay(user, id);
        }
        else {
            return true;
        }
    }

    function set(bytes12 id, bytes32 value, uint40 expiration) {
        super.set(id, value, expiration);
        fee_config[id].unpaid     = !free(id);
    }
    function set_price(bytes12 id, uint price)
        feed_auth(id)
    {
        assert(!free(id));
        fee_config[id].price = price;
        LogSetPrice(id, price);
    }
    function try_pay(address user, bytes12 id)
        internal returns (bool)
    {
        // Convert any exceptions back into `false':
        var pay_function = bytes4(sha3("pay(address,bytes12)"));
        return this.call(pay_function, user, id);
    }

    function pay(address user, bytes12 id)
        pseudo_internal
    {
        fee_config[id].unpaid = false;
        LogPay(id, user);

        // Convert any `false' return value into an exception:
        assert(token(id).transferFrom(user, owner(id), price(id)));
    }

    modifier pseudo_internal() {
        assert(msg.sender == address(this));
        _;
    }

}
