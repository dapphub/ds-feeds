/// feeds.sol --- simple feed-oriented data access pattern

// Copyright (C) 2015-2016  Nexus Development <https://nexusdev.us>
// Copyright (C) 2015-2016  Nikolai Mushegian <nikolai@nexusdev.us>
// Copyright (C) 2016       Daniel Brockman   <daniel@brockman.se>

// This file is part of DSFeeds.

// DSFeeds is free software; you can redistribute and/or modify it
// under the terms of the GNU General Public License as published by
// the Free Software Foundation; either version 3 of the License, or
// (at your option) any later version.
//
// DSFeeds is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty
// of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
//
// See the GNU General Public License for more details.
// You should have received a copy of the GNU General Public License
// along with DSFeeds.  If not, see <http://www.gnu.org/licenses/>.

/// Commentary:

// One reason why we use `bytes12' for feed IDs is to help prevent
// accidentally confusing different values of the same integer type:
// because `bytes12' is an unusual type, it becomes a lot less likely
// for someone to confuse a feed ID with some other kind of value.
//
// (For example, this is very error-prone when dealing with functions
// that take long lists of various parameters or return many values.)
//
// Another reason is simply to avoid wasting storage, and a third is
// to make the IDs fit in other contexts (such as JavaScript numbers).
//
// Finally, for programming convenience, feeds start at 1 (not 0).

/// Code:

pragma solidity ^0.4.8;

import "./interface.sol";


contract DSFeeds is DSFeedsInterface, DSFeedsEvents
{
    mapping (bytes12 => Feed) feeds;
    bytes12 next = 0x1;

    function time() internal returns (uint40) {
        return uint40(now);
    }

    function assert(bool ok) internal {
        if (!ok) throw;
    }

    struct Feed {
        address    owner;
        bytes32    label;

        bytes32    value;
        uint40     timestamp;
        uint40     expiration;
    }

    function owner(bytes12 id) constant returns (address) {
        return feeds[id].owner;
    }
    function label(bytes12 id) constant returns (bytes32) {
        return feeds[id].label;
    }
    function timestamp(bytes12 id) constant returns (uint40) {
        return feeds[id].timestamp;
    }
    function expiration(bytes12 id) constant returns (uint40) {
        return feeds[id].expiration;
    }
    function expired(bytes12 id) constant returns (bool) {
        return time() >= expiration(id);
    }

    //------------------------------------------------------------------
    // Creating feeds
    //------------------------------------------------------------------

    function claim() returns (bytes12 id) {
        id = next;
        assert(id != 0x0);

        next = bytes12(uint96(next)+1);

        feeds[id].owner = msg.sender;

        LogClaim(id, msg.sender);
        return id;
    }

    modifier feed_auth(bytes12 id) {
        assert(msg.sender == owner(id));
        _;
    }

    //------------------------------------------------------------------
    // Updating feeds
    //------------------------------------------------------------------

    function set(bytes12 id, bytes32 value, uint40 expiration)
        feed_auth(id)
    {
        feeds[id].value      = value;
        feeds[id].timestamp  = uint40(time());
        feeds[id].expiration = expiration;

        LogSet(id, value, expiration);
    }

    function set(bytes12 id, bytes32 value)
    {
        set(id, value, uint40(-1));
    }

    function set_owner(bytes12 id, address owner)
        feed_auth(id)
    {
        feeds[id].owner = owner;
        LogSetOwner(id, owner);
    }

    function set_label(bytes12 id, bytes32 label)
        feed_auth(id)
    {
        feeds[id].label = label;
        LogSetLabel(id, label);
    }

    //------------------------------------------------------------------
    // Reading feeds
    //------------------------------------------------------------------

    function has(bytes12 id) returns (bool) {
        if (expired(id)) {
            return false;
        } else {
            return true;
        }
    }

    function get(bytes12 id) returns (bytes32 value) {
        var (val, ok) = tryGet(id);
        if(!ok) throw;
        return val;
    }

    function tryGet(bytes12 id) returns (bytes32 value, bool ok) {
        if (can_get(msg.sender, id)) {
            return (feeds[id].value, true);
        }
    }

    // Override for PaidDSFeeds
    function can_get(address user, bytes12 id)
        internal returns (bool)
    {
        return has(id);
    }

}
