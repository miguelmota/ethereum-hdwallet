'use strict';

var _require = require('table'),
    table = _require.table,
    getBorderCharacters = _require.getBorderCharacters;

var meow = require('meow');

var _require2 = require('ethereum-checksum-address'),
    toChecksumAddress = _require2.toChecksumAddress;

var HDWallet = require('./index');

var cli = meow('\n    Usage\n  $ ethereum_hdwallet [options]\n\n    Options\n      -i, --index Account Index (e.g. 4)\n      -c, --columns Columns to display (e.g. address, publickey, privatekey, hdpath)\n      -r, --range Account Index Range (e.g 1-100)\n      -m, --mnemonic Mnemonic\n      -s, --seed Seed in hex format\n      -p, --hdpath HD Path\n\n    Examples\n      $ ethereum_hdwallet -m "tag volcano eight thank tide danger coast health ab\nove argue embrace heavy" -r 0-10\n  ', {
  string: ['property', 'range', 'mnemonic', 'seed', 'hdpath'],
  number: ['index'],
  alias: {
    i: 'index',
    c: 'columns',
    r: 'range',
    m: 'mnemonic',
    s: 'seed',
    p: 'hdpath'
  }
});

var args = process.argv;
var flags = cli.flags,
    input = cli.input;


var options = {
  mnemonic: flags.mnemonic || flags.m || input[0],
  seed: flags.seed || flags.s,
  hdpath: flags.hdpath || flags.p || HDWallet.DefaultHDPath,
  index: flags.index || flags.i,
  range: flags.range || flags.r,
  columns: flags.columns || flags.c
};

if (process.stdin) {
  process.stdin.setEncoding('utf8');
  process.stdin.resume();
  var content = '';
  process.stdin.on('data', function (buf) {
    content += buf.toString();
  });
  setTimeout(function () {
    options.mnemonic = (content || options.mnemonic || '').trim();
    run(options);
    process.exit(0);
  }, 10);
} else {
  run(options);
}

function run(_ref) {
  var mnemonic = _ref.mnemonic,
      seed = _ref.seed,
      index = _ref.index,
      range = _ref.range,
      hdpath = _ref.hdpath,
      columns = _ref.columns;

  if (!mnemonic && !seed) {
    console.error('Error: mnemonic or seed is required');
    return;
  }

  var hdwallet = (seed ? HDWallet.fromSeed(Buffer.from(seed, 'hex')) : HDWallet.fromMnemonic(mnemonic)).derive(hdpath);

  var start = 0;
  var end = 10;

  if (index != undefined) {
    start = index;
    if (start < 0) {
      start = 0;
    }
    end = start + 1;
    if (end < 0) {
      end = start + 1;
    }
    if (start > end) {
      end = start + 1;
    }
    if (end < start) {
      end = start + 1;
    }
  } else if (range) {
    var parts = range.split('-');
    start = parts[0] | 0;
    end = (parts[1] | 0) + 1;
    if (start < 0) {
      start = 0;
    }
    if (end < 0) {
      end = start + 1;
    }
    if (start > end) {
      end = start + 1;
    }
    if (end < start) {
      end = start + 10;
    }
    if (start > end) {
      start = 0;
    }
  }

  var columnsList = (columns || 'address').split(',').map(function (x) {
    return x.trim().toLowerCase();
  });

  var headerKeys = {
    address: 'address',
    private: 'private key',
    public: 'public key',
    hdpath: 'hd path'
  };

  var props = [];

  for (var i = 0; i < columnsList.length; i++) {
    var property = columnsList[i];
    var prop = null;
    if (/address|(public.*address)|addr/.test(property)) {
      prop = 'address';
    } else if (/private|priv/.test(property)) {
      prop = 'private';
    } else if (/public|pub/.test(property)) {
      prop = 'public';
    } else if (/hdpath|hd/.test(property)) {
      prop = 'hdpath';
    }

    if (prop && props.indexOf(prop) === -1) {
      props.push(prop);
    }
  }

  var headers = [];

  for (var i = 0; i < props.length; i++) {
    headers.push(headerKeys[props[i]]);
  }

  var result = [['account'].concat(headers)];

  for (var i = start; i < end; i++) {
    var wallet = hdwallet.derive(i);
    var values = [];
    for (var j = 0; j < props.length; j++) {
      var _prop = props[j];
      var value = null;
      if (_prop === 'address') {
        value = toChecksumAddress('0x' + wallet.getAddress().toString('hex'));
      } else if (_prop === 'private') {
        value = wallet.getPrivateKey().toString('hex');
      } else if (_prop === 'public') {
        value = wallet.getPublicKey().toString('hex');
      } else if (_prop === 'hdpath') {
        value = wallet.hdpath();
      }

      if (value) {
        values.push(value);
      }
    }

    result.push([i].concat(values));
  }

  console.log(table(result, {
    border: getBorderCharacters('void'),
    columnDefault: {
      paddingTop: 0,
      paddingBottom: 0,
      paddingLeft: 0,
      paddingRight: 1
    },
    drawHorizontalLine: function drawHorizontalLine() {
      return false;
    }
  }));
}