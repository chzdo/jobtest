// import express from "express";

// import cors from "cors";
// import helmet from "helmet";
// //import "./src/databaseEngine/index";
// //import "./utils/movies";
// //import { useMorgan } from "./utils/morgan";
// //import { router } from "./src/routes/index";

// //import { logger } from "./utils/winston";

// const { PORT } = process.env;
// const app = express();

// app.use(cors());
// app.use(helmet());
// app.use(express.json());
// //app.use(useMorgan);

// app.get("/", function (req, res) {
//  console.log("hello");
// });

// //app.use("/", router);

// app.listen(PORT || 3000, () => console.log(`port running for user service at ${PORT}`));

import express from "express";

import cors from "cors";

const app = express();

app.use(cors());

app.get("/", (req, res) => res.send("hello"));

app.listen(process.env.PORT || 5000, () => console.log("listening"));
