export SOLC_FLAGS=--optimize
export SETH_GAS=3000000
all:; dapp build
test:; dapp test -v
deploy:; dapp create DSFeeds
