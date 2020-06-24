import express from "express";
import {AddressInfo} from "net";
import { userRouter } from "./router/UserRouter";
import { musicRouter } from "./router/MusicRouter";
const app = express();

app.use(express.json());

app.use("/users/", userRouter);
app.use("/musics/", musicRouter);


const server = app.listen(3001, () => {
  if (server) {
    const address = server.address() as AddressInfo;
    console.log(`Servidor rodando em http://localhost:${address.port}`);
  } else {
    console.error(`Falha ao rodar o servidor.`);
  }
});