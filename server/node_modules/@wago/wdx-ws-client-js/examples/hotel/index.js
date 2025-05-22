(async () => {

    const WDXSettings = require('./settings');
    const WDXContinue = require('./continue');
    
    try {


        WDXSettings.title();
        WDXSettings.copyright();
        WDXSettings.content();
        WDXSettings.settings();

        await WDXContinue.continue();

        await require('./initRooms').initRooms();
        await require('./initLights').initLights();
        await require('./initAlarms').initAlarms();
        await require('./initTrends').initTrends();
        await require('./review').review();
        await require('./scripts').scripts();

        process.exit(0);

    } catch (e) {
        console.error('Error: ' + e.message);
        console.error('Error: ' + e.stack);
        process.exit(1);
    }
})();