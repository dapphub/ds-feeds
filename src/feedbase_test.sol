/// feedbase_test.sol --- functional tests for `feedbase.sol'

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
// See the GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Feedbase.  If not, see <http://www.gnu.org/licenses/>.

/// Code:

pragma solidity ^0.4.4;

import "dapple/test.sol";
import "erc20/erc20.sol";
import "feedbase.sol";

contract FeedbaseTest is Test,
    FeedbaseEvents
{
    FakePerson  assistant  = new FakePerson();
    FakeToken   token      = new FakeToken();
    Feedbase    feedbase   = new Feedbase();

    uint24      id;

    function setUp() {
        assistant._target(feedbase);
        id = feedbase.claim(token);
    }

    function time() returns (uint40) {
        return uint40(now);
    }

    function test_claim() {
        assertEq(uint(id), 1);
        assertEq(uint(feedbase.claim()), 2);
    }

    function test_get() {
        expectEventsExact(feedbase);

        id = feedbase.claim();
        LogClaim(id, address(this), ERC20(0x0));

        feedbase.set(id, 0x1234, time() + 1);
        LogSet(id, 0x1234, time() + 1);

        var (value, ok) = assistant.get(id);
        assertEq32(value, 0x1234);
        assertTrue(ok);
    }

    function test_get_expired() {
        expectEventsExact(feedbase);

        feedbase.set(id, 0x1234, 123);
        LogSet(id, 0x1234, 123);

        var (value, ok) = feedbase.get(id);
        assertEq32(value, 0);
        assertFalse(ok);
    }

    function test_payment() {
        expectEventsExact(feedbase);

        feedbase.set_price(id, 50);
        LogSetPrice(id, 50);

        feedbase.set(id, 0x1234, time() + 1);
        LogSet(id, 0x1234, time() + 1);

        token.set_balance(assistant, 2000);

        var (value, ok) = assistant.get(id);
        LogPay(id, assistant);
        assertEq32(value, 0x1234);
        assertTrue(ok);

        assertEq(token.balances(assistant), 1950);
    }

    function test_already_paid() {
        expectEventsExact(feedbase);

        feedbase.set_price(id, 50);
        LogSetPrice(id, 50);

        feedbase.set(id, 0x1234, time() + 1);
        LogSet(id, 0x1234, time() + 1);

        token.set_balance(assistant, 2000);

        var (value_1, ok_1) = assistant.get(id);
        LogPay(id, assistant);
        assertEq32(value_1, 0x1234);
        assertTrue(ok_1);

        var (value_2, ok_2) = assistant.get(id);
        assertEq32(value_2, 0x1234);
        assertTrue(ok_2);

        assertEq(token.balances(assistant), 1950);
    }

    function test_failed_payment_throwing_token() {
        expectEventsExact(feedbase);

        feedbase.set_price(id, 50);
        LogSetPrice(id, 50);

        feedbase.set(id, 0x1234, time() + 1);
        LogSet(id, 0x1234, time() + 1);

        token.set_balance(assistant, 49);

        var (value, ok) = assistant.get(id);
        assertEq32(value, 0);
        assertFalse(ok);

        assertEq(token.balances(assistant), 49);
    }

    function test_failed_payment_nonthrowing_token() {
        expectEventsExact(feedbase);

        feedbase.set_price(id, 50);
        LogSetPrice(id, 50);

        feedbase.set(id, 0x1234, time() + 1);
        LogSet(id, 0x1234, time() + 1);

        token.set_balance(assistant, 49);
        token.disable_throwing();

        var (value, ok) = assistant.get(id);
        assertEq32(value, 0);
        assertFalse(ok);

        assertEq(token.balances(assistant), 49);
    }

    function testFail_set_price_without_token() {
        feedbase.set_price(feedbase.claim(), 50);
    }

    function testFail_set_price_unauth() {
        Feedbase(assistant).set_price(id, 50);
    }

    function test_set_owner() {
        expectEventsExact(feedbase);

        feedbase.set_owner(id, assistant);
        LogSetOwner(id, assistant);

        Feedbase(assistant).set_price(id, 50);
        LogSetPrice(id, 50);

        assertEq(feedbase.price(id), 50);
    }

    function testFail_set_owner_unauth() {
        Feedbase(assistant).set_owner(id, assistant);
    }

    function test_set_label() {
        expectEventsExact(feedbase);

        feedbase.set_label(id, "foo");
        LogSetLabel(id, "foo");

        assertEq32(feedbase.label(id), "foo");
    }

    function testFail_set_label_unauth() {
        Feedbase(assistant).set_label(id, "foo");
    }
}

contract FakePerson is Tester {
    function get(uint24 id) returns (bytes32, bool) {
        return Feedbase(_t).get(id);
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
