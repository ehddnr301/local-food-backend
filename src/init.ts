import app from "./app";
import dotenv from "dotenv";
dotenv.config();

const PORT = process.env.PORT || 4000;

const handleListening = () =>
  // tslint:disable-next-line: no-console
  console.log(`✅ Listening on: http://localhost:${PORT}`);

app.listen(process.env.PORT || 4000, handleListening);
