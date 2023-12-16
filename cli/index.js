#! /usr/bin/env node --no-warnings
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"

const commander = require("commander");
const axios = require ('axios');
const program = new commander.Command();

program 
    .version('1.0.0')
    .description('Command Line Interface Software Engineering NTUA 2023');

//CLI "admin" commands
program 
    .command('healthcheck')
    .showHelpAfterError('add --help for additional information')
    .helpOption('-h, --help', 'Display help for command')
    .action(function(){
        let url='https://localhost:9876/ntuaflix/api/admin/healthcheck';
        axios.get(url).then( resp=>{
            console.log(resp.data);
        })
    });

// CLI options for admin users
program 
    .command('admin')
    .showHelpAfterError('add --help for additional information')
    .helpOption('-h, --help', 'Display help for command')
    .requiredOption('--passesupd',               'Don\'t give any argument           ->      {}')
    .requiredOption('--source <path>',                  'Give the path to the file         ->      \"/data/newXXXX.csv\"')
    .action((options)=>{
        if(options.passesupd!=undefined && options.source==undefined)
            console.error('Argument \'--pasesupd\' must be followes by \'--source\'');
        else if(options.passesupd!=undefined)
            apu(options.source);
    });
    
program.parse(process.argv);