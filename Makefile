all:; dapp build
test:; dapp test -v
deploy:; seth send --create 0x"`cat out/DSFeeds200.bin`" -G 3000000
