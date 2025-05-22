const WDXJSWSClientConfiguration = require('../../build/WDX//Client//WS/Configuration/Configuration');
const WDXJSWSClient = require('../../build/WDX//Client//WS/Service/ClientService');


(async () => {
    try {
        const c = new WDXJSWSClient.ClientService({ protocol: 'ws', host: 'localhost', port: 4282 });
        await c.connect();

        console.log('Connected successfully');

        c.scriptService.delete('1d64e8c4-53d7-11ef-b262-088fc37eff34').subscribe(
            {
                next: (instance) => {
                    console.log(instance);
                },

                error: async (error) => {
                    console.error('Error: ' + error.message);

                    await c.disconnect();
                    console.log('Disconnected successfully');
                },

                complete: async () => {
                    await c.disconnect();
                    console.log('Disconnected successfully');
                }
            },
        );

    } catch (e) {
        console.error('Error: ' + e.message);
        console.error('Error: ' + e.stack);
    }
})();
