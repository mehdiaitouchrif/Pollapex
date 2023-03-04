const dotenv = require("dotenv");
dotenv.config();

const { port } = require("./api/config");

const app = require("./api/server");

require("./api/config/database")(); // connects to mongo

app.listen(port, () => {
  console.log(`live on http://localhost:${port}`);
});
