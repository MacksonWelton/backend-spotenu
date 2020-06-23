import express from "express";
import { MusicController } from "../controller/MusicController";
//linha responsável por criar um módulo de rotas no express
export const musicRouter = express.Router();

musicRouter.post("/add-genre", new MusicController().addGenre);
musicRouter.get("/genre", new MusicController().getGenreByName);
musicRouter.post("/create-album", new MusicController().createAlbum);
musicRouter.post("/add-music", new MusicController().addMusic);