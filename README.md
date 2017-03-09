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

More information
----------------

For more details, take a look at the following files:

    src/feeds.sol
    src/paid_feeds.t.sol

You can also check out Keeper (<https://github.com/nexusdev/keeper>),
an "admin toolkit for incentive-following software daemons," designed
to do things like publishing price feeds to blockchains.

Happy hacking!
