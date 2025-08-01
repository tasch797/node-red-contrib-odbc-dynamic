module.exports = function(RED) {
  const odbc = require('odbc');

  function OdbcDynamicNode(config) {
    RED.nodes.createNode(this, config);
    const node = this;
    const connectionConfig = RED.nodes.getNode(config.connection);

    node.on('input', async function(msg) {
      const dsn = connectionConfig?.dsn || process.env.ODBC_DSN;
      const user = connectionConfig?.username || process.env.ODBC_USER;
      const pass = connectionConfig?.password || process.env.ODBC_PASS;
      const sql = config.query || msg.query;

      try {
        const connection = await odbc.connect(`DSN=${dsn};UID=${user};PWD=${pass}`);

		node.status({
			fill: "blue",
			shape: "dot",
			text: `Requesting`
		});

        const result = await connection.query(sql);
			
        await connection.close();
		
		node.status({
			fill: "green",
			shape: "dot",
			text: `Done`
		});

        msg.payload = result;
        node.send(msg);
      } catch (err) {
        node.error("ODBC query failed: " + err.message, msg);
		
		node.error(JSON.stringify(err, null, 2));

		
		node.status({
			fill: "red",
			shape: "dot",
			text: "ODBC query failed: " + err.message
		});		
		
		
		
      }
    });
  }

  RED.nodes.registerType("odbc-dynamic", OdbcDynamicNode);
};
