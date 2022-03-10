#!/usr/bin/env node
'use strict';

// ###################
//      Imports
// ###################
const yaml = require('js-yaml');
const fs = require('fs');
const assert = require('assert').strict;
const stock = require('./lib/stock');

const { ArgumentParser } = require('argparse');
const { version } = require('./package.json');

// Global
const TOKEN = process.env.TOKEN;
assert.ok(TOKEN, 'The "TOKEN" env variable is required');

class HelpFormatter extends ArgumentParser {
    // executes parent _split_lines for each line of the help, then flattens the results
    _split_lines(text, width) {
        return [].concat(...text.split('\n').map(line => super._split_lines(line, width)));
    }
}
// Setup ArugmentParser object
const parser = new ArgumentParser({
    description: 'A simple stock tracking app to pull back data on stock symbols.',
    add_help: true
});
// Args
parser.add_argument('-v', '--version', { action: 'version', version });
parser.add_argument('-c', '--config', { help: 'Config file', default: 'stocktracker.yaml'});
parser.add_argument('-q', '--query', { help: 'Stock function to call from config file', default: "TIME_SERIES_DAILY" });
var args = parser.parse_args();

// Load config
try{
    var config = yaml.load(fs.readFileSync(args.config, 'utf-8'));
} catch (e) {
    console.log(e);
}

const s = new stock.Stock(config, TOKEN);
const query = args.query

for (let c in config.tracker.query) {
    if (query === config.tracker.query[c].function) {
        s.fetch(config.tracker.query[c]);
    }
}