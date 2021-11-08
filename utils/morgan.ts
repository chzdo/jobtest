import fs from "fs";
import morgan from "morgan";

let morganFormat = ":method :url :status :response-time ms - :res[content-length]";

const file_path = fs.createWriteStream("logs/request.logs", { flags: "a" });

if (process.env.NODE_ENV == "production") {
 morganFormat =
  ":remote-addr - :remote-user [:date[clf]] :method :url HTTP/:http-version :status :res[content-length] :referrer :user-agent";
}

const useMorgan = morgan(morganFormat, {
 stream: file_path,
});

export { useMorgan };
