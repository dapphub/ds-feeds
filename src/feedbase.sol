/// feedbase.sol --- simple feed-oriented data access pattern

// Copyright (C) 2015-2016  Nexus Development <https://nexusdev.us>
// Copyright (C) 2015-2016  Nikolai Mushegian <nikolai@nexusdev.us>
// Copyright (C) 2016       Daniel Brockman   <daniel@brockman.se>

// This file is part of Feedbase.

// Feedbase is free software; you can redistribute and/or modify it
// under the terms of the GNU General Public License as published by
// the Free Software Foundation; either version 3 of the License, or
// (at your option) any later version.
//
// Feedbase is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty
// of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
//
// See the GNU General Public License for more details.
// You should have received a copy of the GNU General Public License
// along with Feedbase.  If not, see <http://www.gnu.org/licenses/>.

/// Commentary:

// One reason why we use `uint24' for feed IDs is to help prevent
// accidentally confusing different values of the same integer type:
// because `uint24' is an unusual type, it becomes a lot less likely
// for someone to confuse a feed ID with some other kind of value.
//
// (For example, this is very error-prone when dealing with functions
// that take long lists of various parameters or return many values.)
//
// Another reason is simply to avoid wasting storage, and a third is
// to make the IDs fit in other contexts (such as JavaScript numbers).
//
// While this means that only 16,777,215 feeds can ever be claimed,
// they should simply acquire a price if we ever start running out.
//
// Finally, for programming convenience, feeds start at 1 (not 0).

/// Code:

pragma solidity ^0.4.4;

import "erc20/erc20.sol";

contract FeedbaseEvents {
    event LogClaim     (uint24 indexed id, address owner, ERC20 token);
    event LogSet       (uint24 indexed id, bytes32 value, uint40 expiration);
    event LogSetPrice  (uint24 indexed id, uint price);
    event LogSetOwner  (uint24 indexed id, address owner);
    event LogSetLabel  (uint24 indexed id, bytes32 label);
    event LogPay       (uint24 indexed id, address user);
}

contract Feedbase is FeedbaseEvents {
    mapping (uint24 => Feed) feeds;
    uint24 next = 1;

    function time() internal returns (uint40) {
        return uint40(now);
    }

    function assert(bool ok) internal {
        if (!ok) throw;
    }

    struct Feed {
        ERC20      token;

        address    owner;
        bytes32    label;
        uint       price;

        bytes32    value;
        uint40     timestamp;
        uint40     expiration;

        bool       unpaid;
    }

    function token(uint24 id) constant returns (ERC20) {
        return feeds[id].token;
    }
    function free(uint24 id) constant returns (bool) {
        return token(id) == ERC20(0);
    }

    function owner(uint24 id) constant returns (address) {
        return feeds[id].owner;
    }
    function label(uint24 id) constant returns (bytes32) {
        return feeds[id].label;
    }
    function price(uint24 id) constant returns (uint) {
        return feeds[id].price;
    }

    function timestamp(uint24 id) constant returns (uint40) {
        return feeds[id].timestamp;
    }
    function expiration(uint24 id) constant returns (uint40) {
        return feeds[id].expiration;
    }
    function expired(uint24 id) constant returns (bool) {
        return time() >= expiration(id);
    }

    function unpaid(uint24 id) constant returns (bool) {
        return feeds[id].unpaid;
    }

    //------------------------------------------------------------------
    // Creating feeds
    //------------------------------------------------------------------

    function claim() returns (uint24 id) {
        return claim(ERC20(0));
    }

    function claim(ERC20 token) returns (uint24 id) {
        assert(next > 0);

        id = next++;

        feeds[id].token = token;
        feeds[id].owner = msg.sender;

        LogClaim(id, msg.sender, token);
    }

    modifier auth(uint24 id) {
        assert(msg.sender == owner(id));
        _;
    }

    //------------------------------------------------------------------
    // Updating feeds
    //------------------------------------------------------------------

    function set(uint24 id, bytes32 value, uint40 expiration)
        auth(id)
    {
        feeds[id].value      = value;
        feeds[id].timestamp  = uint40(time());
        feeds[id].expiration = expiration;
        feeds[id].unpaid     = !free(id);

        LogSet(id, value, expiration);
    }

    function set_price(uint24 id, uint price)
        auth(id)
    {
        assert(!free(id));
        feeds[id].price = price;
        LogSetPrice(id, price);
    }

    function set_owner(uint24 id, address owner)
        auth(id)
    {
        feeds[id].owner = owner;
        LogSetOwner(id, owner);
    }

    function set_label(uint24 id, bytes32 label)
        auth(id)
    {
        feeds[id].label = label;
        LogSetLabel(id, label);
    }

    //------------------------------------------------------------------
    // Reading feeds
    //------------------------------------------------------------------

    function get(uint24 id) returns (bytes32 value, bool ok) {
        if (can_get(msg.sender, id)) {
            return (feeds[id].value, true);
        }
    }

    function can_get(address user, uint24 id)
        internal returns (bool)
    {
        if (expired(id)) {
            return false;
        } else if (unpaid(id)) {
            return try_pay(user, id);
        } else {
            return true;
        }
    }

    function try_pay(address user, uint24 id)
        internal returns (bool)
    {
        // Convert any exceptions back into `false':
        var pay_function = bytes4(sha3("pay(address,uint24)"));
        return this.call(pay_function, user, id);
    }

    function pay(address user, uint24 id)
        pseudo_internal
    {
        feeds[id].unpaid = false;
        LogPay(id, user);

        // Convert any `false' return value into an exception:
        assert(token(id).transferFrom(user, owner(id), price(id)));
    }

    modifier pseudo_internal() {
        assert(msg.sender == address(this));
        _;
    }
}
