import app from "./app";
import logger from "./util/logger";



logger.info("Initializing express server...");

/**
 * Start Express server.
 */
const server = app.listen(app.get("port"), () => {
    console.log(
        "  App is running at http://localhost:%d in %s mode",
        app.get("port"),
        app.get("env")
    );
    console.log("  Press CTRL-C to stop\n");
});

logger.info("Initialized express server!");

export default server;
