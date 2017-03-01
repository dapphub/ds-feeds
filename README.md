**Note:**  DSFeeds is still under development.

DSFeeds
========

This small, self-contained Ethereum contract lets you create "feeds"
that you can use to publish arbitrary 32-byte values, with attached
expiration dates to prevent consumers from reading stale data.

Perhaps most interestingly, the owner of a feed has the ability to tax
on-chain consumers (i.e., smart contracts) for making use of the feed.
This happens at most once for each feed value (to the first consumer).
The reason for this is that you couldn't really prevent anyone from
creating a simple contract that would repeat your feed values anyway.
However, you're free to publish new values again as often as you want.

The prices can be changed at any time, although for security reasons
the address of the underlying ERC20 token can only ever be set once.

One obvious application of DSFeeds is publishing financial data to
smart contracts that rely on "oracles" in a nice, standardized way.
Another interesting use case is for configuration of smart contracts.

Think of DSFeeds as a piece of low-level Ethereum infrastructure:
it's free for anyone to use, and not owned or controlled by anyone.


Getting started
---------------

Before starting, make sure to have installed:
- node (https://nodejs.org/en/) 
- geth (https://www.ethereum.org/cli) or parity (https://ethcore.io/parity.html).

DSFeeds has a command line tool which can be used by two different ways:

1- Downloading this repository and following the next steps.

- install solc (http://solidity.readthedocs.io/en/develop/installing-solidity.html)
- install dapple (npm install -g dapple)
- git clone git@github.com:dapphub/ds-feeds.git
- cd ds-feeds/
- git submodule update --init --recursive
- cd cli/
- npm install
- npm run build

Command line tool can be called on ds-feeds/cli directory:


    node dsfeeds [command] [args] 

2- Downloading commmand-line tool directly from npm:

- npm install -g dsfeeds

In this case, command line toold can be called globally using:
    

    dsfeeds [command] [args]

For anything to happen, you need to run an RPC-enabled Ethereum node:

    geth --testnet --rpc --unlock 0x1234567890123456789012345678901234567890

    or

    parity --testnet (Using Signer for approving transactions)

**Important:** Make sure your chain is synced before using `dsfeeds`.


Working with feeds
------------------

To start publishing your values, first claim a feed ID:

    dsfeeds claim

If nothing goes wrong (sad to say, the CLI is a bit flaky sometimes),
within a minute you should see something like this:

    {
      "id": 7302,
      "owner": "0x34e510285d96cdc6063d5447763afea0acd61baa",
      "label": "",
      "price": 0,
      "available": false,
      "value": 0,
      "timestamp": 0,
      "expiration": 0,
      "unpaid": false
    }

Now you can do a few things.  You can inspect the feed at will:

    dsfeeds inspect 7302

You can set an arbitrary label (32 bytes maximum):

    dsfeeds set_label 7302 "Temperature in Central Park"

You can transfer ownership of the feed to another account:

    dsfeeds set_owner 7302 0x4b51d646f0e3677411b27101d2a3f09223a8372e

You can also continuously watch the blockchain for all DSFeeds events:

    dsfeeds watch

Now, to actually update the feed value, you'd use a command like this:

    dsfeeds set 7302 73 1467204471

Here, we're setting the value of feed number 7302 to the number 73.
The expiration date is set to June 29 12:47:51 UTC 2016 (represented in standard Unix time).

Again, the values can be anything as long as they fit within 32 bytes.

**Note:** This command line tool automatically transforms the integer value to bytes32 (type of parameter that contract expects).

To have a complete overview of the possible commands, you can run:

    dsfeeds --help

That's it!

More information
----------------

For more details, take a look at the following files:

    src/feeds.sol
    src/paid_feeds_test.sol

You can also check out Keeper (<https://github.com/nexusdev/keeper>),
an "admin toolkit for incentive-following software daemons," designed
to do things like publishing price feeds to blockchains.

Happy hacking!
