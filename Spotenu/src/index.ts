import express from "express";
import dotenv from "dotenv";
import {AddressInfo} from "net";
import { userRouter } from "./router/UserRouter";
import { musicRouter } from "./router/MusicRouter";
import { playlistRouter } from "./router/PlaylistRouter";
import cors from "cors";
import { albumRouter } from "./router/AlbumRouter";
import { genreRouter } from "./router/GenreRouter";

dotenv.config();

const app = express();

app.use(cors())

app.use(express.json());

app.use("/users/", userRouter);
app.use("/musics/", musicRouter);
app.use("/playlists/", playlistRouter);
app.use("/albums/", albumRouter);
app.use("/genres/", genreRouter);

export default app;


const server = app.listen(3001, () => {
  if (server) {
    const address = server.address() as AddressInfo;
    console.log(`Servidor rodando em http://localhost:${address.port}`);
  } else {
    console.error(`Falha ao rodar o servidor.`);
  }
});
