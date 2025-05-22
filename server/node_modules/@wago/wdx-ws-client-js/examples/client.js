/**
 * Elrest - WDX - WS - Client - JS - Example - Connect Client
 * 
 * Connects WDX WS Client to WDX with WS client.
 *
 * @copyright 2024 Elrest AutomationsSysteme GMBH
 */

const WDXWSClient = require('@wago/wdx-ws-client-js');
const WDXWSClientConfiguration = require('./configuration/configuration.js');

let client = undefined;

const getClient = () => {
    return client;
};

const connect = async () => {
    try {
        client = new WDXWSClient.WDX.WS.Client.JS.Service.ClientService(
            WDXWSClientConfiguration.wsConfiguration
        );

        console.log('Connecting');
        await client.connect();
        console.log('Connected successfully');

        const subscription = client.status.subscribe({
            next: async (status) => {
                console.log(`Response of 'WDX - WS - Client Status': ${status}`);
            },
            error: async (error) => {
                console.error('Error Code: ' + error.code);
                console.error('Error Message: ' + error.message);
            },

            complete: async () => {
                console.log('Completed');
            }
        });

    } catch (e) {
        console.error('Error: ' + e.message);
    }
}

const disconnect = async () => {
    try {

        console.log('Disconnecting');

        if (client) {
            await client.disconnect();
        }

        console.log('Disconnected successfully');


    } catch (e) {
        console.error('Error: ' + e.message);
    }
}

module.exports.connect = connect;
module.exports.getClient = getClient;
module.exports.disconnect = disconnect;

(async () => {
    await connect();
    await disconnect();
})();
