function toBytes(number, bytes) {
  let hex = number.toString(16);
  while (hex.length < bytes * 2) hex = `0${hex}`;
  return `0x${hex}`;
}

function toBytes12(number) {
  return toBytes(number, 12);
}

module.exports = {
  toBytes,
  toBytes12,

  getNetwork: web3 => (
    new Promise((resolve, reject) => {
      web3.version.getNetwork((error, result) => {
        if (error) {
          reject(error);
        } else {
          // Private network
          const network = result > 3 ? 4 : result;
          const env = [null, 'live', 'morden', 'ropsten', 'develop'][network];
          resolve(env);
        }
      });
    })
  ),

  detectMethodArgs: (object, argsQuantity) => {
    let subMethod = null;
    Object.keys(object).forEach((key) => {
      if (key.indexOf('bytes') ||
        key.indexOf('uint') ||
        key.indexOf('string')) {

        if (argsQuantity === (key.match(/,/g) || []).length + 1) {
          subMethod = key;
        }
      }
    });
    return subMethod;
  },

  prepareArgs: (args, format) => {
    const argsType = format.split(',');
    let val = null;

    if (args.length !== argsType.length) return [];

    const returnArgs = [];
    for (let i = 0; i < args.length; i += 1) {
      if (argsType[i] === 'bytes12') {
        val = toBytes12(args[i]);
      } else if (argsType[i] === 'bytes32' && /^\d+$/.test(args[i])) {
        // It also checks that the bytes32 is a number. Otherwise we do send it as string
        val = toBytes(args[i], 32);
      } else {
        val = args[i];
      }
      returnArgs.push(val);
    }

    return returnArgs;
  },

  unique: (value, index, self) => {
    return self.indexOf(value) === index;
  },
};
