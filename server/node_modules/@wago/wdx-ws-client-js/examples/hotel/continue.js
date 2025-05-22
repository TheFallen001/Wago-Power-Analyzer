const WDXSettings = require('./settings');

module.exports.continue = async () => {
    //process.stdin.setRawMode(true);
    console.log(`\n${WDXSettings.indentation()}Press any key to continue ...`);

    return new Promise(resolve => process.stdin.once('data', (keys) => {
        //process.stdin.setRawMode(false);
        resolve();
    }))
}