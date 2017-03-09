/// paid_feeds.t.sol --- functional tests for `paid_feeds.sol'

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
// See the GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with DSFeeds.  If not, see <http://www.gnu.org/licenses/>.

/// Code:

pragma solidity ^0.4.8;

import "ds-test/test.sol";
import "erc20/erc20.sol";
import "./interface.sol";
import "./paid_feeds.sol";

contract PaidDSFeedsTest is DSTest,
    PaidDSFeedsEvents
{
    PaidDSFeeds   feeds;
    FakeToken     token;
    FakePerson    assistant;

    bytes12       id;

    function setUp() {
        feeds = new PaidDSFeeds();
        token = new FakeToken();
        assistant = new FakePerson(feeds);
        id = feeds.claim(token);
    }

    function time() returns (uint40) {
        return uint40(now);
    }

    function test_claim() {
        assertEq(uint(id), 1);
        assertEq(uint(feeds.claim()), 2);
    }

    function test_get() {
        expectEventsExact(feeds);

        id = feeds.claim();
        LogClaim(id, address(this));

        feeds.set(id, 0x1234, time() + 1);
        LogSet(id, 0x1234, time() + 1);

        var (value, ok) = assistant.tryGet(id);
        assertEq32(value, 0x1234);
        assert(ok);
    }

    function test_get_expired() {
        expectEventsExact(feeds);

        feeds.set(id, 0x1234, 123);
        LogSet(id, 0x1234, 123);

        var (value, ok) = feeds.tryGet(id);
        assertEq32(value, 0);
        assert(!ok);
    }

    function test_payment() {
        expectEventsExact(feeds);

        feeds.set_price(id, 50);
        LogSetPrice(id, 50);

        feeds.set(id, 0x1234, time() + 1);
        LogSet(id, 0x1234, time() + 1);

        token.set_balance(assistant, 2000);

        var (value, ok) = assistant.tryGet(id);
        LogPay(id, assistant);
        assertEq32(value, 0x1234);
        assert(ok);

        assertEq(token.balances(assistant), 1950);
    }

    function test_already_paid() {
        expectEventsExact(feeds);

        feeds.set_price(id, 50);
        LogSetPrice(id, 50);

        feeds.set(id, 0x1234, time() + 1);
        LogSet(id, 0x1234, time() + 1);

        token.set_balance(assistant, 2000);

        var (value_1, ok_1) = assistant.tryGet(id);
        LogPay(id, assistant);
        assertEq32(value_1, 0x1234);
        assert(ok_1);

        var (value_2, ok_2) = assistant.tryGet(id);
        assertEq32(value_2, 0x1234);
        assert(ok_2);

        assertEq(token.balances(assistant), 1950);
    }

    function test_failed_payment_throwing_token() {
        expectEventsExact(feeds);

        feeds.set_price(id, 50);
        LogSetPrice(id, 50);

        feeds.set(id, 0x1234, time() + 1);
        LogSet(id, 0x1234, time() + 1);

        token.set_balance(assistant, 49);

        var (value, ok) = assistant.tryGet(id);
        assertEq32(value, 0);
        assert(!ok);

        assertEq(token.balances(assistant), 49);
    }

    function test_failed_payment_nonthrowing_token() {
        expectEventsExact(feeds);

        feeds.set_price(id, 50);
        LogSetPrice(id, 50);

        feeds.set(id, 0x1234, time() + 1);
        LogSet(id, 0x1234, time() + 1);

        token.set_balance(assistant, 49);
        token.disable_throwing();

        var (value, ok) = assistant.tryGet(id);
        assertEq32(value, 0);
        assert(!ok);

        assertEq(token.balances(assistant), 49);
    }

    function testFail_set_price_without_token() {
        feeds.set_price(feeds.claim(), 50);
    }

    function testFail_set_price_unauth() {
        assistant.set_price(id, 50);
    }

    function test_set_owner() {
        expectEventsExact(feeds);

        feeds.set_owner(id, assistant);
        LogSetOwner(id, assistant);

        assistant.set_price(id, 50);
        LogSetPrice(id, 50);

        assertEq(feeds.price(id), 50);
    }

    function testFail_set_owner_unauth() {
        assistant.set_owner(id, assistant);
    }

    function test_set_label() {
        expectEventsExact(feeds);

        feeds.set_label(id, "foo");
        LogSetLabel(id, "foo");

        assertEq32(feeds.label(id), "foo");
    }

    function testFail_set_label_unauth() {
        assistant.set_label(id, "foo");
    }
}

contract FakePerson {
    PaidDSFeeds public feed;

    function FakePerson(PaidDSFeeds feed_) {
        feed = feed_;
    }

    function tryGet(bytes12 id) returns (bytes32 value, bool ok) {
        return feed.tryGet(id);
    }

    function set_price(bytes12 id, uint price) {
        feed.set_price(id, price);
    }

    function set_owner(bytes12 id, address owner) {
        feed.set_owner(id, owner);
    }

    function set_label(bytes12 id, bytes32 label) {
        feed.set_label(id, label);
    }
}

contract FakeToken is ERC20 {
    mapping (address => uint) public balances;
    bool no_throw;

    function set_balance(address account, uint balance) {
        balances[account] = balance;
    }

    function disable_throwing() {
        no_throw = true;
    }

    function transferFrom(address from, address to, uint amount)
        returns (bool)
    {
        if (amount > balances[from]) {
            if (no_throw) {
                return false;
            } else {
                throw;
            }
        }

        balances[from] -= amount;
        balances[to] += amount;

        return true;
    }

    function totalSupply() constant returns (uint) {}
    function balanceOf(address a) constant returns (uint) {}
    function allowance(address a, address b) constant returns (uint) {}
    function approve(address a, uint x) returns (bool) {}
    function transfer(address a, uint x) returns (bool) {}
}
