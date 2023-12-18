const { shutdown } = require('./redis');

const gracefulShutdown = (server) => {
    ['SIGINT', 'SIGTERM', 'SIGQUIT'].forEach( signal => {
        process.on(signal, () => {
            server.close(() => {
                console.warn('HTTP server closing')
                shutdown()
                console.warn('Redis disconnected')
            })
        })
    })
}

module.exports = gracefulShutdown;