const lib = require('./fcwp-lib.js');

const RUNNING_AS_SCRIPT = require.main === module;
const OUTPUT_TO_FILE = true;

const usageMsg = `
Usage:
cat sample/input1.txt | node ./src/index.js
node ./src/index.js sample/input1.txt
`;

const main = () => {

    // if module is required by other module, don't read stdin or arguments
    if (!RUNNING_AS_SCRIPT) {
        return;
    }

    // If no STDIN and no arguments
    if (process.stdin.isTTY && process.argv.length <= 2) {
        process.stderr.write('Argument with file path, or stdin data required.');
        process.stdout.write(usageMsg);
        process.exit(1);
    }
    // If no STDIN but arguments given
    else if (process.stdin.isTTY && process.argv.length > 2) {
        lib.processInputData('argument', process.argv[2], RUNNING_AS_SCRIPT, OUTPUT_TO_FILE);
    }
    // read from STDIN
    else {
        let data = '';
        process.stdin.on('readable', () => {
            data += process.stdin.read() || '';
        });
        process.stdin.on('end', () => {
            lib.processInputData('stdin', data, RUNNING_AS_SCRIPT, OUTPUT_TO_FILE);
        });
    }
}

main();