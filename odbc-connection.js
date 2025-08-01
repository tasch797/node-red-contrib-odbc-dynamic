module.exports = function(RED) {
  function OdbcConnectionConfigNode(config) {
    RED.nodes.createNode(this, config);
    this.dsn = config.dsn;
    this.username = this.credentials.username;
    this.password = this.credentials.password;
  }

  RED.nodes.registerType("odbc-connection", OdbcConnectionConfigNode, {
    credentials: {
      username: { type: "text" },
      password: { type: "password" }
    }
  });
};
