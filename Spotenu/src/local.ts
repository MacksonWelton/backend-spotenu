import express from "express";
import {AddressInfo} from "net";
import { userRouter } from "./router/UserRouter";
import { musicRouter } from "./router/MusicRouter";
import { playlistRouter } from "./router/PlaylistRouter";
import cors from "cors";
import { albumRouter } from "./router/AlbumRouter";
import { genreRouter } from "./router/GenreRouter";

const app = express();

app.use(cors())

app.use(express.json());

app.use("/users/", userRouter);
app.use("/musics/", musicRouter);
app.use("/playlists/", playlistRouter);
app.use("/albums/", albumRouter);
app.use("/genres/", genreRouter);

const server = app.listen(3000, () => {
  if (server) {
    const address = server.address() as AddressInfo;
    console.log(`Servidor rodando em http://localhost:${address.port}`);
  } else {
    console.error(`Falha ao rodar o servidor.`);
  }
});
