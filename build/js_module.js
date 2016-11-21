'use strict';

// For geth
if (typeof dapple === 'undefined') {
  var dapple = {};
}

if (typeof web3 === 'undefined' && typeof Web3 === 'undefined') {
  var Web3 = require('web3');
}

dapple['feedbase'] = (function builder () {
  var environments = {
      'develop': {},
      'morden': {
        'feedbase': {
          'value': '0xc5a0ae957108b20b22b61fd799baab70e68dea52',
          'type': 'Feedbase[486f9a4a7b09eeca05a9d5a2737aab85439f13b71f624f50cdb803dbc4a1b241]'
        }
      },
      'live': {},
      'ropsten': {
        'feedbase': {
          'value': '0x39708debbc537454ca33de154669c4bf6ddef8c9',
          'type': 'Feedbase[486f9a4a7b09eeca05a9d5a2737aab85439f13b71f624f50cdb803dbc4a1b241]'
        }
      }
    };

  function ContractWrapper (headers, _web3) {
    if (!_web3) {
      throw new Error('Must supply a Web3 connection!');
    }

    this.headers = headers;
    this._class = _web3.eth.contract(headers.interface);
  }

  ContractWrapper.prototype.deploy = function () {
    var args = new Array(arguments);
    args[args.length - 1].data = this.headers.bytecode;
    return this._class.new.apply(this._class, args);
  };

  var passthroughs = ['at', 'new'];
  for (var i = 0; i < passthroughs.length; i += 1) {
    ContractWrapper.prototype[passthroughs[i]] = (function (passthrough) {
      return function () {
        return this._class[passthrough].apply(this._class, arguments);
      };
    })(passthroughs[i]);
  }

  function constructor (_web3, env) {
    if (!env) {
      env = {
      'objects': {
        'feedbase': {
          'value': '0x39708debbc537454ca33de154669c4bf6ddef8c9',
          'type': 'Feedbase[486f9a4a7b09eeca05a9d5a2737aab85439f13b71f624f50cdb803dbc4a1b241]'
        }
      },
      'type': 'ropsten'
    };
    }
    if(typeof env === "object" && !("objects" in env)) {
      env = {objects: env};
    }
    while (typeof env !== 'object') {
      if (!(env in environments)) {
        throw new Error('Cannot resolve environment name: ' + env);
      }
      env = {objects: environments[env]};
    }

    if (typeof _web3 === 'undefined') {
      if (!env.rpcURL) {
        throw new Error('Need either a Web3 instance or an RPC URL!');
      }
      _web3 = new Web3(new Web3.providers.HttpProvider(env.rpcURL));
    }

    this.headers = {
      'Callback': {
        'interface': [
          {
            'constant': false,
            'inputs': [
              {
                'name': 'addr',
                'type': 'address'
              },
              {
                'name': 'eventName',
                'type': 'string'
              },
              {
                'name': 'functioncall',
                'type': 'string'
              }
            ],
            'name': 'on',
            'outputs': [],
            'payable': false,
            'type': 'function'
          }
        ],
        'bytecode': '606060405260e78060106000396000f360606040526000357c0100000000000000000000000000000000000000000000000000000000900480636985e724146039576035565b6002565b3460025760df6004808035906020019091908035906020019082018035906020019191908080601f016020809104026020016040519081016040528093929190818152602001838380828437820191505050505050909091908035906020019082018035906020019191908080601f01602080910402602001604051908101604052809392919081815260200183838082843782019150505050505090909190505060e1565b005b5b50505056'
      },
      'DappleEnv': {
        'interface': [
          {
            'inputs': [],
            'type': 'constructor'
          }
        ],
        'bytecode': '60606040525b73c5a0ae957108b20b22b61fd799baab70e68dea52600260005060000160006101000a81548173ffffffffffffffffffffffffffffffffffffffff02191690836c010000000000000000000000009081020402179055507339708debbc537454ca33de154669c4bf6ddef8c9600660005060000160006101000a81548173ffffffffffffffffffffffffffffffffffffffff02191690836c010000000000000000000000009081020402179055507339708debbc537454ca33de154669c4bf6ddef8c9600860005060000160006101000a81548173ffffffffffffffffffffffffffffffffffffffff02191690836c010000000000000000000000009081020402179055505b600c806101186000396000f360606040526008565b600256'
      },
      'DappleLogger': {
        'interface': [],
        'bytecode': '6060604052600c8060106000396000f360606040526008565b600256'
      },
      'DeployFeedbase': {
        'interface': [
          {
            'constant': false,
            'inputs': [
              {
                'name': 'name',
                'type': 'bytes32'
              },
              {
                'name': 'addr',
                'type': 'address'
              }
            ],
            'name': 'export',
            'outputs': [],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [],
            'name': 'txoff',
            'outputs': [],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [],
            'name': 'txon',
            'outputs': [],
            'payable': false,
            'type': 'function'
          },
          {
            'inputs': [],
            'type': 'constructor'
          },
          {
            'payable': false,
            'type': 'fallback'
          },
          {
            'anonymous': false,
            'inputs': [
              {
                'indexed': false,
                'name': 'name',
                'type': 'bytes32'
              },
              {
                'indexed': false,
                'name': 'number',
                'type': 'uint256'
              }
            ],
            'name': 'exportNumber',
            'type': 'event'
          },
          {
            'anonymous': false,
            'inputs': [
              {
                'indexed': false,
                'name': 'name',
                'type': 'bytes32'
              },
              {
                'indexed': false,
                'name': 'addr',
                'type': 'address'
              }
            ],
            'name': 'exportObject',
            'type': 'event'
          },
          {
            'anonymous': false,
            'inputs': [
              {
                'indexed': false,
                'name': 'flag',
                'type': 'bool'
              }
            ],
            'name': 'setCalls',
            'type': 'event'
          },
          {
            'anonymous': false,
            'inputs': [
              {
                'indexed': false,
                'name': 'origin',
                'type': 'address'
              }
            ],
            'name': 'setOrigin',
            'type': 'event'
          },
          {
            'anonymous': false,
            'inputs': [
              {
                'indexed': false,
                'name': 'chaintype',
                'type': 'bytes32'
              }
            ],
            'name': 'assertChain',
            'type': 'event'
          },
          {
            'anonymous': false,
            'inputs': [
              {
                'indexed': false,
                'name': 'env',
                'type': 'bytes32'
              }
            ],
            'name': 'pushEnv',
            'type': 'event'
          },
          {
            'anonymous': false,
            'inputs': [
              {
                'indexed': false,
                'name': 'env',
                'type': 'bytes32'
              }
            ],
            'name': 'popEnv',
            'type': 'event'
          },
          {
            'anonymous': false,
            'inputs': [
              {
                'indexed': false,
                'name': 'addr',
                'type': 'address'
              },
              {
                'indexed': false,
                'name': 'eventName',
                'type': 'string'
              },
              {
                'indexed': false,
                'name': 'functioncall',
                'type': 'string'
              }
            ],
            'name': 'on',
            'type': 'event'
          },
          {
            'anonymous': false,
            'inputs': [
              {
                'indexed': false,
                'name': 'input',
                'type': 'bytes'
              },
              {
                'indexed': false,
                'name': 'result',
                'type': 'uint256'
              }
            ],
            'name': 'shUint',
            'type': 'event'
          }
        ],
        'bytecode': '60606040525b5b5b73c5a0ae957108b20b22b61fd799baab70e68dea52600260005060000160006101000a81548173ffffffffffffffffffffffffffffffffffffffff02191690836c010000000000000000000000009081020402179055507339708debbc537454ca33de154669c4bf6ddef8c9600660005060000160006101000a81548173ffffffffffffffffffffffffffffffffffffffff02191690836c010000000000000000000000009081020402179055507339708debbc537454ca33de154669c4bf6ddef8c9600860005060000160006101000a81548173ffffffffffffffffffffffffffffffffffffffff02191690836c010000000000000000000000009081020402179055505b727202eeaad2c871c74c094231d1a4d28028321b600a60006101000a81548173ffffffffffffffffffffffffffffffffffffffff02191690836c0100000000000000000000000090810204021790555073127202eeaad2c871c74c094231d1a4d28028321b600b60006101000a81548173ffffffffffffffffffffffffffffffffffffffff02191690836c010000000000000000000000009081020402179055505b7fdeb8643b9b3399f6925a9b6f1f780d90946f75267aaab1d59685d28dd846b9c360405161106180610255833901809050604051809103906000f080156100025760405180807f66656564626173650000000000000000000000000000000000000000000000008152602001506020018273ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390a15b610187806112b66000396000f360606040526001600160006101000a81548162ffffff02191690837d010000000000000000000000000000000000000000000000000000000000908102040217905550611011806100506000396000f3606060405236156100ed576000357c0100000000000000000000000000000000000000000000000000000000900480630646a6dc146100f2578063140f8dd31461012557806318d2e71a146101545780631e83409a146101895780631f7344fd146101bf578063363123b8146102065780633f7c79441461024d5780634112aef71461027e5780634e71d92d146102a457806356fa5449146102d1578063698f8269146102f75780637440352c1461032a5780639976b7ea14610362578063a8b8b77414610395578063a8e836b5146103cd578063c726b21a146103f3578063e1ac1a1114610419576100ed565b610002565b346100025761010d6004808035906020019091905050610457565b60405180821515815260200191505060405180910390f35b3461000257610152600480803590602001909190803590602001909190803590602001909190505061049d565b005b346100025761016f6004808035906020019091905050610682565b604051808260001916815260200191505060405180910390f35b34610002576101a460048080359060200190919050506106b5565b604051808262ffffff16815260200191505060405180910390f35b34610002576101da6004808035906020019091905050610861565b604051808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b346100025761022160048080359060200190919050506108b1565b604051808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b34610002576102686004808035906020019091905050610901565b6040518082815260200191505060405180910390f35b34610002576102a26004808035906020019091908035906020019091905050610934565b005b34610002576102b66004805050610aff565b604051808262ffffff16815260200191505060405180910390f35b34610002576102f56004808035906020019091908035906020019091905050610b15565b005b34610002576103126004808035906020019091905050610bd4565b60405180821515815260200191505060405180910390f35b34610002576103456004808035906020019091905050610c03565b604051808264ffffffffff16815260200191505060405180910390f35b346100025761037d6004808035906020019091905050610c44565b60405180821515815260200191505060405180910390f35b34610002576103b06004808035906020019091905050610c81565b604051808264ffffffffff16815260200191505060405180910390f35b34610002576103f16004808035906020019091908035906020019091905050610cc2565b005b34610002576104176004808035906020019091908035906020019091905050610db8565b005b34610002576104346004808035906020019091905050610e69565b604051808360001916815260200182151581526020019250505060405180910390f35b6000600073ffffffffffffffffffffffffffffffffffffffff1661047a836108b1565b73ffffffffffffffffffffffffffffffffffffffff16149050610498565b919050565b826104dd6104aa82610861565b73ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614610eb2565b82600060005060008662ffffff1681526020019081526020016000206000506004016000508190555061050e610ec2565b600060005060008662ffffff16815260200190815260200160002060005060050160006101000a81548164ffffffffff02191690837b0100000000000000000000000000000000000000000000000000000090810204021790555081600060005060008662ffffff16815260200190815260200160002060005060050160056101000a81548164ffffffffff02191690837b010000000000000000000000000000000000000000000000000000009081020402179055506105ce84610457565b15600060005060008662ffffff168152602001908152602001600020600050600501600a6101000a81548160ff02191690837f01000000000000000000000000000000000000000000000000000000000000009081020402179055508362ffffff167ffe89b51d84e65542b66f32d2758b4d17b94972345412e1fc7ad5b7e8fe134f83848460405180836000191681526020018264ffffffffff1681526020019250505060405180910390a25b5b50505050565b6000600060005060008362ffffff1681526020019081526020016000206000506002016000505490506106b0565b919050565b60006106d96000600160009054906101000a900462ffffff1662ffffff1611610eb2565b6001600081819054906101000a900462ffffff168092919060010191906101000a81548162ffffff02191690837d0100000000000000000000000000000000000000000000000000000000009081020402179055509050805081600060005060008362ffffff16815260200190815260200160002060005060000160006101000a81548173ffffffffffffffffffffffffffffffffffffffff02191690836c0100000000000000000000000090810204021790555033600060005060008362ffffff16815260200190815260200160002060005060010160006101000a81548173ffffffffffffffffffffffffffffffffffffffff02191690836c010000000000000000000000009081020402179055508062ffffff167fcea14795dc89572c32466e7f7d0e06bfbb114d18ece0682687e98e9e4a47e10b3384604051808373ffffffffffffffffffffffffffffffffffffffff1681526020018273ffffffffffffffffffffffffffffffffffffffff1681526020019250505060405180910390a25b919050565b6000600060005060008362ffffff16815260200190815260200160002060005060010160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1690506108ac565b919050565b6000600060005060008362ffffff16815260200190815260200160002060005060000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1690506108fc565b919050565b6000600060005060008362ffffff16815260200190815260200160002060005060030160005054905061092f565b919050565b61096b3073ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614610eb2565b6000600060005060008362ffffff168152602001908152602001600020600050600501600a6101000a81548160ff02191690837f01000000000000000000000000000000000000000000000000000000000000009081020402179055508062ffffff167f904a17421adb18a19ec538a9359a266e0e6cf0e2e0066c2640a158cd87f3974d83604051808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390a2610af9610a27826108b1565b73ffffffffffffffffffffffffffffffffffffffff166323b872dd84610a4c85610861565b610a5586610901565b600060405160200152604051847c0100000000000000000000000000000000000000000000000000000000028152600401808473ffffffffffffffffffffffffffffffffffffffff1681526020018373ffffffffffffffffffffffffffffffffffffffff1681526020018281526020019350505050602060405180830381600087803b156100025760325a03f1156100025750505060405180519060200150610eb2565b5b5b5050565b6000610b0b60006106b5565b9050610b12565b90565b81610b55610b2282610861565b73ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614610eb2565b610b67610b6184610457565b15610eb2565b81600060005060008562ffffff168152602001908152602001600020600050600301600050819055508262ffffff167fa0b8e767ae7d39fff959dadc5263fe9912c0fc3ba2736a6d2ed00640e97bddcf836040518082815260200191505060405180910390a25b5b505050565b6000610bdf82610c03565b64ffffffffff16610bee610ec2565b64ffffffffff1610159050610bfe565b919050565b6000600060005060008362ffffff16815260200190815260200160002060005060050160059054906101000a900464ffffffffff169050610c3f565b919050565b6000600060005060008362ffffff168152602001908152602001600020600050600501600a9054906101000a900460ff169050610c7c565b919050565b6000600060005060008362ffffff16815260200190815260200160002060005060050160009054906101000a900464ffffffffff169050610cbd565b919050565b81610d02610ccf82610861565b73ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614610eb2565b81600060005060008562ffffff16815260200190815260200160002060005060010160006101000a81548173ffffffffffffffffffffffffffffffffffffffff02191690836c010000000000000000000000009081020402179055508262ffffff167ff90b5dfd99eea6e1b271379d824be245f73464e4f6f553c402cc32231ae2845f83604051808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390a25b5b505050565b81610df8610dc582610861565b73ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614610eb2565b81600060005060008562ffffff168152602001908152602001600020600050600201600050819055508262ffffff167f34a122ab68f1d72c52488f56223edc131fccaefc04de16b232db21df901cfc8083604051808260001916815260200191505060405180910390a25b5b505050565b60006000610e773384610ecf565b15610eac57600060005060008462ffffff16815260200190815260200160002060005060040160005054600191509150610ead565b5b915091565b801515610ebe57610002565b5b50565b6000429050610ecc565b90565b6000610eda82610bd4565b15610eec5760009050610f1a56610f19565b610ef582610c44565b15610f0f57610f048383610f20565b9050610f1a56610f18565b60019050610f1a565b5b5b92915050565b6000600060405180807f70617928616464726573732c75696e74323429000000000000000000000000008152602001506013019050604051809103902090503073ffffffffffffffffffffffffffffffffffffffff16817c010000000000000000000000000000000000000000000000000000000090048585604051837c0100000000000000000000000000000000000000000000000000000000028152600401808373ffffffffffffffffffffffffffffffffffffffff1681526020018262ffffff168152602001925050506000604051808303816000876161da5a03f192505050915061100a565b50929150505660606040523615610053576000357c0100000000000000000000000000000000000000000000000000000000900480635067a4bd146100615780639fc288d114610087578063d900596c1461009b57610053565b346100025761005f5b5b565b005b346100025761008560048080359060200190919080359060200190919050506100af565b005b3461000257610099600480505061010d565b005b34610002576100ad600480505061014a565b005b7fdeb8643b9b3399f6925a9b6f1f780d90946f75267aaab1d59685d28dd846b9c3828260405180836000191681526020018273ffffffffffffffffffffffffffffffffffffffff1681526020019250505060405180910390a15b5050565b7fe68392b8656cb7ab571c539efc7ce5a43464478a591f773a55db9984c089f4d1600160405180821515815260200191505060405180910390a15b565b7fe68392b8656cb7ab571c539efc7ce5a43464478a591f773a55db9984c089f4d1600060405180821515815260200191505060405180910390a15b56'
      },
      'FakePerson': {
        'interface': [
          {
            'constant': false,
            'inputs': [
              {
                'name': 'target',
                'type': 'address'
              }
            ],
            'name': '_target',
            'outputs': [],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [
              {
                'name': 'id',
                'type': 'uint24'
              }
            ],
            'name': 'get',
            'outputs': [
              {
                'name': '',
                'type': 'bytes32'
              },
              {
                'name': '',
                'type': 'bool'
              }
            ],
            'payable': false,
            'type': 'function'
          },
          {
            'payable': false,
            'type': 'fallback'
          }
        ],
        'bytecode': '6060604052610222806100126000396000f360606040523615610048576000357c0100000000000000000000000000000000000000000000000000000000900480634bbb216c146100c5578063e1ac1a11146100e257610048565b34610002576100c35b600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16600036604051808383808284378201915050925050506000604051808303816000866161da5a03f191505015156100c057610002565b5b565b005b34610002576100e06004808035906020019091905050610120565b005b34610002576100fd6004808035906020019091905050610161565b604051808360001916815260200182151581526020019250505060405180910390f35b80600060006101000a81548173ffffffffffffffffffffffffffffffffffffffff02191690836c010000000000000000000000009081020402179055505b50565b60006000600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663e1ac1a1184600060405160400152604051827c0100000000000000000000000000000000000000000000000000000000028152600401808262ffffff168152602001915050604060405180830381600087803b156100025760325a03f11561000257505050604051805190602001805190602001509150915061021d565b91509156'
      },
      'FakeToken': {
        'interface': [
          {
            'constant': false,
            'inputs': [
              {
                'name': 'account',
                'type': 'address'
              },
              {
                'name': 'balance',
                'type': 'uint256'
              }
            ],
            'name': 'set_balance',
            'outputs': [],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [
              {
                'name': 'a',
                'type': 'address'
              },
              {
                'name': 'x',
                'type': 'uint256'
              }
            ],
            'name': 'approve',
            'outputs': [
              {
                'name': '',
                'type': 'bool'
              }
            ],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [],
            'name': 'totalSupply',
            'outputs': [
              {
                'name': '',
                'type': 'uint256'
              }
            ],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [
              {
                'name': 'from',
                'type': 'address'
              },
              {
                'name': 'to',
                'type': 'address'
              },
              {
                'name': 'amount',
                'type': 'uint256'
              }
            ],
            'name': 'transferFrom',
            'outputs': [
              {
                'name': '',
                'type': 'bool'
              }
            ],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [
              {
                'name': '',
                'type': 'address'
              }
            ],
            'name': 'balances',
            'outputs': [
              {
                'name': '',
                'type': 'uint256'
              }
            ],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [],
            'name': 'disable_throwing',
            'outputs': [],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [
              {
                'name': 'a',
                'type': 'address'
              }
            ],
            'name': 'balanceOf',
            'outputs': [
              {
                'name': '',
                'type': 'uint256'
              }
            ],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [
              {
                'name': 'a',
                'type': 'address'
              },
              {
                'name': 'x',
                'type': 'uint256'
              }
            ],
            'name': 'transfer',
            'outputs': [
              {
                'name': '',
                'type': 'bool'
              }
            ],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [
              {
                'name': 'a',
                'type': 'address'
              },
              {
                'name': 'b',
                'type': 'address'
              }
            ],
            'name': 'allowance',
            'outputs': [
              {
                'name': '',
                'type': 'uint256'
              }
            ],
            'payable': false,
            'type': 'function'
          },
          {
            'anonymous': false,
            'inputs': [
              {
                'indexed': true,
                'name': 'from',
                'type': 'address'
              },
              {
                'indexed': true,
                'name': 'to',
                'type': 'address'
              },
              {
                'indexed': false,
                'name': 'value',
                'type': 'uint256'
              }
            ],
            'name': 'Transfer',
            'type': 'event'
          },
          {
            'anonymous': false,
            'inputs': [
              {
                'indexed': true,
                'name': 'owner',
                'type': 'address'
              },
              {
                'indexed': true,
                'name': 'spender',
                'type': 'address'
              },
              {
                'indexed': false,
                'name': 'value',
                'type': 'uint256'
              }
            ],
            'name': 'Approval',
            'type': 'event'
          }
        ],
        'bytecode': '60606040526103fc806100126000396000f360606040523615610095576000357c0100000000000000000000000000000000000000000000000000000000900480630776e4fa1461009a578063095ea7b3146100c057806318160ddd146100fc57806323b872dd1461012457806327e235e31461016957806352929a0c1461019a57806370a08231146101ae578063a9059cbb146101df578063dd62ed3e1461021b57610095565b610002565b34610002576100be6004808035906020019091908035906020019091905050610255565b005b34610002576100e4600480803590602001909190803590602001909190505061028e565b60405180821515815260200191505060405180910390f35b346100025761010e6004805050610297565b6040518082815260200191505060405180910390f35b3461000257610151600480803590602001909190803590602001909190803590602001909190505061029d565b60405180821515815260200191505060405180910390f35b34610002576101846004808035906020019091905050610386565b6040518082815260200191505060405180910390f35b34610002576101ac60048050506103a1565b005b34610002576101c960048080359060200190919050506103e2565b6040518082815260200191505060405180910390f35b346100025761020360048080359060200190919080359060200190919050506103ea565b60405180821515815260200191505060405180910390f35b346100025761023f60048080359060200190919080359060200190919050506103f3565b6040518082815260200191505060405180910390f35b80600060005060008473ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600050819055505b5050565b60005b92915050565b60005b90565b6000600060005060008573ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600050548211156102fe57600160009054906101000a900460ff16156102f8576000905061037f566102fd565b610002565b5b81600060005060008673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008282825054039250508190555081600060005060008573ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000828282505401925050819055506001905061037f565b9392505050565b60006000506020528060005260406000206000915090505481565b6001600160006101000a81548160ff02191690837f01000000000000000000000000000000000000000000000000000000000000009081020402179055505b565b60005b919050565b60005b92915050565b60005b9291505056'
      },
      'Feedbase': {
        'interface': [
          {
            'constant': true,
            'inputs': [
              {
                'name': 'id',
                'type': 'uint24'
              }
            ],
            'name': 'free',
            'outputs': [
              {
                'name': '',
                'type': 'bool'
              }
            ],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [
              {
                'name': 'id',
                'type': 'uint24'
              },
              {
                'name': 'value',
                'type': 'bytes32'
              },
              {
                'name': 'expiration',
                'type': 'uint40'
              }
            ],
            'name': 'set',
            'outputs': [],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [
              {
                'name': 'id',
                'type': 'uint24'
              }
            ],
            'name': 'label',
            'outputs': [
              {
                'name': '',
                'type': 'bytes32'
              }
            ],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [
              {
                'name': 'token',
                'type': 'address'
              }
            ],
            'name': 'claim',
            'outputs': [
              {
                'name': 'id',
                'type': 'uint24'
              }
            ],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [
              {
                'name': 'id',
                'type': 'uint24'
              }
            ],
            'name': 'owner',
            'outputs': [
              {
                'name': '',
                'type': 'address'
              }
            ],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [
              {
                'name': 'id',
                'type': 'uint24'
              }
            ],
            'name': 'token',
            'outputs': [
              {
                'name': '',
                'type': 'address'
              }
            ],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [
              {
                'name': 'id',
                'type': 'uint24'
              }
            ],
            'name': 'price',
            'outputs': [
              {
                'name': '',
                'type': 'uint256'
              }
            ],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [
              {
                'name': 'user',
                'type': 'address'
              },
              {
                'name': 'id',
                'type': 'uint24'
              }
            ],
            'name': 'pay',
            'outputs': [],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [],
            'name': 'claim',
            'outputs': [
              {
                'name': 'id',
                'type': 'uint24'
              }
            ],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [
              {
                'name': 'id',
                'type': 'uint24'
              },
              {
                'name': 'price',
                'type': 'uint256'
              }
            ],
            'name': 'set_price',
            'outputs': [],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [
              {
                'name': 'id',
                'type': 'uint24'
              }
            ],
            'name': 'expired',
            'outputs': [
              {
                'name': '',
                'type': 'bool'
              }
            ],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [
              {
                'name': 'id',
                'type': 'uint24'
              }
            ],
            'name': 'expiration',
            'outputs': [
              {
                'name': '',
                'type': 'uint40'
              }
            ],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [
              {
                'name': 'id',
                'type': 'uint24'
              }
            ],
            'name': 'unpaid',
            'outputs': [
              {
                'name': '',
                'type': 'bool'
              }
            ],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [
              {
                'name': 'id',
                'type': 'uint24'
              }
            ],
            'name': 'timestamp',
            'outputs': [
              {
                'name': '',
                'type': 'uint40'
              }
            ],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [
              {
                'name': 'id',
                'type': 'uint24'
              },
              {
                'name': 'owner',
                'type': 'address'
              }
            ],
            'name': 'set_owner',
            'outputs': [],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [
              {
                'name': 'id',
                'type': 'uint24'
              },
              {
                'name': 'label',
                'type': 'bytes32'
              }
            ],
            'name': 'set_label',
            'outputs': [],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [
              {
                'name': 'id',
                'type': 'uint24'
              }
            ],
            'name': 'get',
            'outputs': [
              {
                'name': 'value',
                'type': 'bytes32'
              },
              {
                'name': 'ok',
                'type': 'bool'
              }
            ],
            'payable': false,
            'type': 'function'
          },
          {
            'anonymous': false,
            'inputs': [
              {
                'indexed': true,
                'name': 'id',
                'type': 'uint24'
              },
              {
                'indexed': false,
                'name': 'owner',
                'type': 'address'
              },
              {
                'indexed': false,
                'name': 'token',
                'type': 'address'
              }
            ],
            'name': 'LogClaim',
            'type': 'event'
          },
          {
            'anonymous': false,
            'inputs': [
              {
                'indexed': true,
                'name': 'id',
                'type': 'uint24'
              },
              {
                'indexed': false,
                'name': 'value',
                'type': 'bytes32'
              },
              {
                'indexed': false,
                'name': 'expiration',
                'type': 'uint40'
              }
            ],
            'name': 'LogSet',
            'type': 'event'
          },
          {
            'anonymous': false,
            'inputs': [
              {
                'indexed': true,
                'name': 'id',
                'type': 'uint24'
              },
              {
                'indexed': false,
                'name': 'price',
                'type': 'uint256'
              }
            ],
            'name': 'LogSetPrice',
            'type': 'event'
          },
          {
            'anonymous': false,
            'inputs': [
              {
                'indexed': true,
                'name': 'id',
                'type': 'uint24'
              },
              {
                'indexed': false,
                'name': 'owner',
                'type': 'address'
              }
            ],
            'name': 'LogSetOwner',
            'type': 'event'
          },
          {
            'anonymous': false,
            'inputs': [
              {
                'indexed': true,
                'name': 'id',
                'type': 'uint24'
              },
              {
                'indexed': false,
                'name': 'label',
                'type': 'bytes32'
              }
            ],
            'name': 'LogSetLabel',
            'type': 'event'
          },
          {
            'anonymous': false,
            'inputs': [
              {
                'indexed': true,
                'name': 'id',
                'type': 'uint24'
              },
              {
                'indexed': false,
                'name': 'user',
                'type': 'address'
              }
            ],
            'name': 'LogPay',
            'type': 'event'
          }
        ],
        'bytecode': '60606040526001600160006101000a81548162ffffff02191690837d010000000000000000000000000000000000000000000000000000000000908102040217905550611011806100506000396000f3606060405236156100ed576000357c0100000000000000000000000000000000000000000000000000000000900480630646a6dc146100f2578063140f8dd31461012557806318d2e71a146101545780631e83409a146101895780631f7344fd146101bf578063363123b8146102065780633f7c79441461024d5780634112aef71461027e5780634e71d92d146102a457806356fa5449146102d1578063698f8269146102f75780637440352c1461032a5780639976b7ea14610362578063a8b8b77414610395578063a8e836b5146103cd578063c726b21a146103f3578063e1ac1a1114610419576100ed565b610002565b346100025761010d6004808035906020019091905050610457565b60405180821515815260200191505060405180910390f35b3461000257610152600480803590602001909190803590602001909190803590602001909190505061049d565b005b346100025761016f6004808035906020019091905050610682565b604051808260001916815260200191505060405180910390f35b34610002576101a460048080359060200190919050506106b5565b604051808262ffffff16815260200191505060405180910390f35b34610002576101da6004808035906020019091905050610861565b604051808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b346100025761022160048080359060200190919050506108b1565b604051808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b34610002576102686004808035906020019091905050610901565b6040518082815260200191505060405180910390f35b34610002576102a26004808035906020019091908035906020019091905050610934565b005b34610002576102b66004805050610aff565b604051808262ffffff16815260200191505060405180910390f35b34610002576102f56004808035906020019091908035906020019091905050610b15565b005b34610002576103126004808035906020019091905050610bd4565b60405180821515815260200191505060405180910390f35b34610002576103456004808035906020019091905050610c03565b604051808264ffffffffff16815260200191505060405180910390f35b346100025761037d6004808035906020019091905050610c44565b60405180821515815260200191505060405180910390f35b34610002576103b06004808035906020019091905050610c81565b604051808264ffffffffff16815260200191505060405180910390f35b34610002576103f16004808035906020019091908035906020019091905050610cc2565b005b34610002576104176004808035906020019091908035906020019091905050610db8565b005b34610002576104346004808035906020019091905050610e69565b604051808360001916815260200182151581526020019250505060405180910390f35b6000600073ffffffffffffffffffffffffffffffffffffffff1661047a836108b1565b73ffffffffffffffffffffffffffffffffffffffff16149050610498565b919050565b826104dd6104aa82610861565b73ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614610eb2565b82600060005060008662ffffff1681526020019081526020016000206000506004016000508190555061050e610ec2565b600060005060008662ffffff16815260200190815260200160002060005060050160006101000a81548164ffffffffff02191690837b0100000000000000000000000000000000000000000000000000000090810204021790555081600060005060008662ffffff16815260200190815260200160002060005060050160056101000a81548164ffffffffff02191690837b010000000000000000000000000000000000000000000000000000009081020402179055506105ce84610457565b15600060005060008662ffffff168152602001908152602001600020600050600501600a6101000a81548160ff02191690837f01000000000000000000000000000000000000000000000000000000000000009081020402179055508362ffffff167ffe89b51d84e65542b66f32d2758b4d17b94972345412e1fc7ad5b7e8fe134f83848460405180836000191681526020018264ffffffffff1681526020019250505060405180910390a25b5b50505050565b6000600060005060008362ffffff1681526020019081526020016000206000506002016000505490506106b0565b919050565b60006106d96000600160009054906101000a900462ffffff1662ffffff1611610eb2565b6001600081819054906101000a900462ffffff168092919060010191906101000a81548162ffffff02191690837d0100000000000000000000000000000000000000000000000000000000009081020402179055509050805081600060005060008362ffffff16815260200190815260200160002060005060000160006101000a81548173ffffffffffffffffffffffffffffffffffffffff02191690836c0100000000000000000000000090810204021790555033600060005060008362ffffff16815260200190815260200160002060005060010160006101000a81548173ffffffffffffffffffffffffffffffffffffffff02191690836c010000000000000000000000009081020402179055508062ffffff167fcea14795dc89572c32466e7f7d0e06bfbb114d18ece0682687e98e9e4a47e10b3384604051808373ffffffffffffffffffffffffffffffffffffffff1681526020018273ffffffffffffffffffffffffffffffffffffffff1681526020019250505060405180910390a25b919050565b6000600060005060008362ffffff16815260200190815260200160002060005060010160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1690506108ac565b919050565b6000600060005060008362ffffff16815260200190815260200160002060005060000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1690506108fc565b919050565b6000600060005060008362ffffff16815260200190815260200160002060005060030160005054905061092f565b919050565b61096b3073ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614610eb2565b6000600060005060008362ffffff168152602001908152602001600020600050600501600a6101000a81548160ff02191690837f01000000000000000000000000000000000000000000000000000000000000009081020402179055508062ffffff167f904a17421adb18a19ec538a9359a266e0e6cf0e2e0066c2640a158cd87f3974d83604051808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390a2610af9610a27826108b1565b73ffffffffffffffffffffffffffffffffffffffff166323b872dd84610a4c85610861565b610a5586610901565b600060405160200152604051847c0100000000000000000000000000000000000000000000000000000000028152600401808473ffffffffffffffffffffffffffffffffffffffff1681526020018373ffffffffffffffffffffffffffffffffffffffff1681526020018281526020019350505050602060405180830381600087803b156100025760325a03f1156100025750505060405180519060200150610eb2565b5b5b5050565b6000610b0b60006106b5565b9050610b12565b90565b81610b55610b2282610861565b73ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614610eb2565b610b67610b6184610457565b15610eb2565b81600060005060008562ffffff168152602001908152602001600020600050600301600050819055508262ffffff167fa0b8e767ae7d39fff959dadc5263fe9912c0fc3ba2736a6d2ed00640e97bddcf836040518082815260200191505060405180910390a25b5b505050565b6000610bdf82610c03565b64ffffffffff16610bee610ec2565b64ffffffffff1610159050610bfe565b919050565b6000600060005060008362ffffff16815260200190815260200160002060005060050160059054906101000a900464ffffffffff169050610c3f565b919050565b6000600060005060008362ffffff168152602001908152602001600020600050600501600a9054906101000a900460ff169050610c7c565b919050565b6000600060005060008362ffffff16815260200190815260200160002060005060050160009054906101000a900464ffffffffff169050610cbd565b919050565b81610d02610ccf82610861565b73ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614610eb2565b81600060005060008562ffffff16815260200190815260200160002060005060010160006101000a81548173ffffffffffffffffffffffffffffffffffffffff02191690836c010000000000000000000000009081020402179055508262ffffff167ff90b5dfd99eea6e1b271379d824be245f73464e4f6f553c402cc32231ae2845f83604051808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390a25b5b505050565b81610df8610dc582610861565b73ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614610eb2565b81600060005060008562ffffff168152602001908152602001600020600050600201600050819055508262ffffff167f34a122ab68f1d72c52488f56223edc131fccaefc04de16b232db21df901cfc8083604051808260001916815260200191505060405180910390a25b5b505050565b60006000610e773384610ecf565b15610eac57600060005060008462ffffff16815260200190815260200160002060005060040160005054600191509150610ead565b5b915091565b801515610ebe57610002565b5b50565b6000429050610ecc565b90565b6000610eda82610bd4565b15610eec5760009050610f1a56610f19565b610ef582610c44565b15610f0f57610f048383610f20565b9050610f1a56610f18565b60019050610f1a565b5b5b92915050565b6000600060405180807f70617928616464726573732c75696e74323429000000000000000000000000008152602001506013019050604051809103902090503073ffffffffffffffffffffffffffffffffffffffff16817c010000000000000000000000000000000000000000000000000000000090048585604051837c0100000000000000000000000000000000000000000000000000000000028152600401808373ffffffffffffffffffffffffffffffffffffffff1681526020018262ffffff168152602001925050506000604051808303816000876161da5a03f192505050915061100a565b509291505056'
      },
      'FeedbaseEvents': {
        'interface': [
          {
            'anonymous': false,
            'inputs': [
              {
                'indexed': true,
                'name': 'id',
                'type': 'uint24'
              },
              {
                'indexed': false,
                'name': 'owner',
                'type': 'address'
              },
              {
                'indexed': false,
                'name': 'token',
                'type': 'address'
              }
            ],
            'name': 'LogClaim',
            'type': 'event'
          },
          {
            'anonymous': false,
            'inputs': [
              {
                'indexed': true,
                'name': 'id',
                'type': 'uint24'
              },
              {
                'indexed': false,
                'name': 'value',
                'type': 'bytes32'
              },
              {
                'indexed': false,
                'name': 'expiration',
                'type': 'uint40'
              }
            ],
            'name': 'LogSet',
            'type': 'event'
          },
          {
            'anonymous': false,
            'inputs': [
              {
                'indexed': true,
                'name': 'id',
                'type': 'uint24'
              },
              {
                'indexed': false,
                'name': 'price',
                'type': 'uint256'
              }
            ],
            'name': 'LogSetPrice',
            'type': 'event'
          },
          {
            'anonymous': false,
            'inputs': [
              {
                'indexed': true,
                'name': 'id',
                'type': 'uint24'
              },
              {
                'indexed': false,
                'name': 'owner',
                'type': 'address'
              }
            ],
            'name': 'LogSetOwner',
            'type': 'event'
          },
          {
            'anonymous': false,
            'inputs': [
              {
                'indexed': true,
                'name': 'id',
                'type': 'uint24'
              },
              {
                'indexed': false,
                'name': 'label',
                'type': 'bytes32'
              }
            ],
            'name': 'LogSetLabel',
            'type': 'event'
          },
          {
            'anonymous': false,
            'inputs': [
              {
                'indexed': true,
                'name': 'id',
                'type': 'uint24'
              },
              {
                'indexed': false,
                'name': 'user',
                'type': 'address'
              }
            ],
            'name': 'LogPay',
            'type': 'event'
          }
        ],
        'bytecode': '6060604052600c8060106000396000f360606040526008565b600256'
      },
      'SMS': {
        'interface': [
          {
            'constant': false,
            'inputs': [
              {
                'name': 'number',
                'type': 'string'
              },
              {
                'name': 'message',
                'type': 'string'
              }
            ],
            'name': 'send',
            'outputs': [],
            'payable': false,
            'type': 'function'
          }
        ],
        'bytecode': '606060405260dd8060106000396000f360606040526000357c010000000000000000000000000000000000000000000000000000000090048063bd6de11c146039576035565b6002565b3460025760d66004808035906020019082018035906020019191908080601f016020809104026020016040519081016040528093929190818152602001838380828437820191505050505050909091908035906020019082018035906020019191908080601f01602080910402602001604051908101604052809392919081815260200183838082843782019150505050505090909190505060d8565b005b5b505056'
      },
      'Script': {
        'interface': [
          {
            'constant': false,
            'inputs': [
              {
                'name': 'name',
                'type': 'bytes32'
              },
              {
                'name': 'addr',
                'type': 'address'
              }
            ],
            'name': 'export',
            'outputs': [],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [],
            'name': 'txoff',
            'outputs': [],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [],
            'name': 'txon',
            'outputs': [],
            'payable': false,
            'type': 'function'
          },
          {
            'inputs': [],
            'type': 'constructor'
          },
          {
            'payable': false,
            'type': 'fallback'
          },
          {
            'anonymous': false,
            'inputs': [
              {
                'indexed': false,
                'name': 'name',
                'type': 'bytes32'
              },
              {
                'indexed': false,
                'name': 'number',
                'type': 'uint256'
              }
            ],
            'name': 'exportNumber',
            'type': 'event'
          },
          {
            'anonymous': false,
            'inputs': [
              {
                'indexed': false,
                'name': 'name',
                'type': 'bytes32'
              },
              {
                'indexed': false,
                'name': 'addr',
                'type': 'address'
              }
            ],
            'name': 'exportObject',
            'type': 'event'
          },
          {
            'anonymous': false,
            'inputs': [
              {
                'indexed': false,
                'name': 'flag',
                'type': 'bool'
              }
            ],
            'name': 'setCalls',
            'type': 'event'
          },
          {
            'anonymous': false,
            'inputs': [
              {
                'indexed': false,
                'name': 'origin',
                'type': 'address'
              }
            ],
            'name': 'setOrigin',
            'type': 'event'
          },
          {
            'anonymous': false,
            'inputs': [
              {
                'indexed': false,
                'name': 'chaintype',
                'type': 'bytes32'
              }
            ],
            'name': 'assertChain',
            'type': 'event'
          },
          {
            'anonymous': false,
            'inputs': [
              {
                'indexed': false,
                'name': 'env',
                'type': 'bytes32'
              }
            ],
            'name': 'pushEnv',
            'type': 'event'
          },
          {
            'anonymous': false,
            'inputs': [
              {
                'indexed': false,
                'name': 'env',
                'type': 'bytes32'
              }
            ],
            'name': 'popEnv',
            'type': 'event'
          },
          {
            'anonymous': false,
            'inputs': [
              {
                'indexed': false,
                'name': 'addr',
                'type': 'address'
              },
              {
                'indexed': false,
                'name': 'eventName',
                'type': 'string'
              },
              {
                'indexed': false,
                'name': 'functioncall',
                'type': 'string'
              }
            ],
            'name': 'on',
            'type': 'event'
          },
          {
            'anonymous': false,
            'inputs': [
              {
                'indexed': false,
                'name': 'input',
                'type': 'bytes'
              },
              {
                'indexed': false,
                'name': 'result',
                'type': 'uint256'
              }
            ],
            'name': 'shUint',
            'type': 'event'
          }
        ],
        'bytecode': '60606040525b5b73c5a0ae957108b20b22b61fd799baab70e68dea52600260005060000160006101000a81548173ffffffffffffffffffffffffffffffffffffffff02191690836c010000000000000000000000009081020402179055507339708debbc537454ca33de154669c4bf6ddef8c9600660005060000160006101000a81548173ffffffffffffffffffffffffffffffffffffffff02191690836c010000000000000000000000009081020402179055507339708debbc537454ca33de154669c4bf6ddef8c9600860005060000160006101000a81548173ffffffffffffffffffffffffffffffffffffffff02191690836c010000000000000000000000009081020402179055505b727202eeaad2c871c74c094231d1a4d28028321b600a60006101000a81548173ffffffffffffffffffffffffffffffffffffffff02191690836c0100000000000000000000000090810204021790555073127202eeaad2c871c74c094231d1a4d28028321b600b60006101000a81548173ffffffffffffffffffffffffffffffffffffffff02191690836c010000000000000000000000009081020402179055505b610187806101bc6000396000f360606040523615610053576000357c0100000000000000000000000000000000000000000000000000000000900480635067a4bd146100615780639fc288d114610087578063d900596c1461009b57610053565b346100025761005f5b5b565b005b346100025761008560048080359060200190919080359060200190919050506100af565b005b3461000257610099600480505061010d565b005b34610002576100ad600480505061014a565b005b7fdeb8643b9b3399f6925a9b6f1f780d90946f75267aaab1d59685d28dd846b9c3828260405180836000191681526020018273ffffffffffffffffffffffffffffffffffffffff1681526020019250505060405180910390a15b5050565b7fe68392b8656cb7ab571c539efc7ce5a43464478a591f773a55db9984c089f4d1600160405180821515815260200191505060405180910390a15b565b7fe68392b8656cb7ab571c539efc7ce5a43464478a591f773a55db9984c089f4d1600060405180821515815260200191505060405180910390a15b56'
      },
      'System': {
        'interface': [
          {
            'constant': false,
            'inputs': [
              {
                'name': 'input',
                'type': 'string'
              }
            ],
            'name': 'to_uint',
            'outputs': [
              {
                'name': 'output',
                'type': 'uint256'
              }
            ],
            'payable': false,
            'type': 'function'
          }
        ],
        'bytecode': '606060405260b48060106000396000f360606040526000357c01000000000000000000000000000000000000000000000000000000009004806360cfa963146039576035565b6002565b34600257608f6004808035906020019082018035906020019191908080601f01602080910402602001604051908101604052809392919081815260200183838082843782019150505050505090909190505060a5565b6040518082815260200191505060405180910390f35b6000600b905060af565b91905056'
      }
    };

    this.classes = {};
    for (var key in this.headers) {
      this.classes[key] = new ContractWrapper(this.headers[key], _web3);
    }

    this.objects = {};
    for (var i in env.objects) {
      var obj = env.objects[i];
      if(!(obj['type'].split('[')[0] in this.classes)) continue;
      this.objects[i] = this.classes[obj['type'].split('[')[0]].at(obj.value);
    }
  }

  return {
    class: constructor,
    environments: environments
  };
})();

if (typeof module !== 'undefined' && module.exports) {
  module.exports = dapple['feedbase'];
}
