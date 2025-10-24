const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const routes = require("./routes");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const fs = require("fs");
const YAML = require("yaml");
const path = require("path");

// withCredentials: true, // Cho phép gửi cookie qua các domain khác nhau

// swaggerUi : "Design-First"
const swaggerUi = require("swagger-ui-express");
const file = fs.readFileSync(path.resolve("./swagger.yaml"), "utf8");
const swaggerDocument = YAML.parse(file);

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Route để hiển thị giao diện Swagger UI
app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(
  cors({
    // // 1. Cho phép yêu cầu từ nguồn của Next.js
    // origin: "http://localhost:3000",

    // // 2. Cho phép nhận cookie từ nguồn đó
    // credentials: true,
  })
);
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb" }));
app.use(bodyParser.json());
app.use(cookieParser()); // Thư viện này sẽ phân tích header Cookie và đưa các cookie vào đối tượng req.cookies.

routes(app);

mongoose
  .connect(`${process.env.MONGO_DB}`)
  .then(() => {
    console.log("Connect Db success!");
  })
  .catch((err) => {
    console.log(err);
  });

app.listen(port, () => {
  console.log("Server is running in port: ", +port);
});
