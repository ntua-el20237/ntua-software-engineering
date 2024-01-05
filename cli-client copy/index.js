#! /usr/bin/env node 
//--no-warnings
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"

const commander = require("commander");
const axios = require ('axios');
const program = new commander.Command();
const fs = require('fs');

program 
    .version('1.0.0')
    .description('Command Line Interface Software Engineering NTUA 2023');


// Handle unknown commands
program
    .arguments('<command...>')
    .action((command) => {
    console.error(`Unknown command: ${command.join(' ')}`);
    console.error(`type --help for additional information`);
  });

//CLI "admin" commands
program 
    .command('healthcheck')
    .showHelpAfterError('add --help for additional information')
    .action(function(){
        let url='https://localhost:9876/ntuaflix/api/admin/healthcheck';
        axios.get(url)
            .then(resp => {
                console.log(resp.data);
            })
            .catch(error => {
                console.error("Error during healthcheck:", error);
            });
    });

program 
    .command('resetall')
    .showHelpAfterError('add --help for additional information')
    .action(function(){
        let url='https://localhost:9876/ntuaflix/api/admin/resetall';
        axios.get(url)
            .then(resp => {
                console.log(resp.data);
            })
            .catch(error => {
                console.error("Error during healthcheck:", error);
            });
    });

//CLI "api" commands 
program
    .command('title')
    .description('Set or display the title')
    .option('--titleID <titleID>', 'Specify the text for the title')
    .action((options) => {
      const titleID = options.titleID || '';
      const url = `https://localhost:9876/ntuaflix/api/title/:${titleID}`;

    axios.get(url)
      .then(response => {
        console.log('Response:', response.data);
      })
      .catch(error => {
        console.error('Error:', error.message);
      });
    });

//CLI "upload" commands
//den einai sigoura swsto
program
    .command('newakas')
    .description('Upload movie titles')
    .requiredOption('--filename <path>', 'Path to the file to upload')
    
    .action(async (options) => {
    const filePath = options.filename;
    const endpoint = `https://localhost:9876/ntuaflix/api/upload/titleakas`;

    try {
        // Read the file as a buffer
        const fileBuffer = fs.readFileSync(filePath);

        // Make a POST request to the API endpoint with the file as FormData
        const response = await axios.post(endpoint, fileBuffer, {
        headers: {
            'Content-Type': 'text/plain', // Set the content type based on the file type
        },
        });

        console.log('Upload successful. Response:', response.data);
    } catch (error) {
        console.error('Error during upload:', error.message);
    }
    });

program
    .command('newtitles')
    .description('Upload new titles')
    .requiredOption('--filename <path>', 'Path to the file to upload')
    
    .action(async (options) => {
    const filePath = options.filename;
    const endpoint = `https://localhost:9876/ntuaflix/api/upload/titlebasics`;

    try {
        // Read the file as a buffer
        const fileBuffer = fs.readFileSync(filePath);

        // Make a POST request to the API endpoint with the file as FormData
        const response = await axios.post(endpoint, fileBuffer, {
        headers: {
            'Content-Type': 'text/plain', // Set the content type based on the file type
        },
        });

        console.log('Upload successful. Response:', response.data);
    } catch (error) {
        console.error('Error during upload:', error.message);
    }
    });

program
    .command('newnames')
    .description('Upload actor names')
    .requiredOption('--filename <path>', 'Path to the file to upload')
    
    .action(async (options) => {
    const filePath = options.filename;
    const endpoint = `https://localhost:9876/ntuaflix/api/upload/namebasics`;

    try {
        // Read the file as a buffer
        const fileBuffer = fs.readFileSync(filePath);

        // Make a POST request to the API endpoint with the file as FormData
        const response = await axios.post(endpoint, fileBuffer, {
        headers: {
            'Content-Type': 'text/plain', // Set the content type based on the file type
        },
        });

        console.log('Upload successful. Response:', response.data);
    } catch (error) {
        console.error('Error during upload:', error.message);
    }
    });

//help command
program
    .helpOption('-h, --help', 'Display help for commands')

program.parse(process.argv);
