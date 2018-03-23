module.exports = {
	db: {
		url: 'mongodb://netvice-admin:berlin@ds121999.mlab.com:21999/netmax',
		options: {
			useMongoClient: true,
			autoIndex: false, // Don't build indexes
			reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
			reconnectInterval: 500, // Reconnect every 500ms
			poolSize: 10, // Maintain up to 10 socket connections
			// If not connected, return errors immediately rather than waiting for reconnect
			bufferMaxEntries: 0
		}
	},
	logger: {
		fileLevel: "error",
		filename: "error_log",
	},
	secret: {
		key: "B3rl1n",
		salt: 10
	},
	roles: {
		1: "Admin",
		2: "Operator"
	}
};