import app from './app';
import { envConfig } from "./shared/config";

app.listen(envConfig.port, () => {
  console.log(`Started server on port: ${envConfig.port}`);
});
