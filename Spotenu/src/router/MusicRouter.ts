import express from "express";
import { MusicController } from "../controller/MusicController";

export const musicRouter = express.Router();

musicRouter.post("/add-genre", new MusicController().addGenre);
musicRouter.get("/genre", new MusicController().getGenreByName);
musicRouter.post("/create-album", new MusicController().createAlbum);
musicRouter.post("/add-music", new MusicController().addMusic);
musicRouter.get("/all-musics", new MusicController().getAllMusics);
musicRouter.get("/musics-by-band", new MusicController().getMusicsByBand);
musicRouter.get("/musics-by-album", new MusicController().getMusicsbyAlbum);
musicRouter.get("/genres", new MusicController().getAllGenres)
musicRouter.get("/albums", new MusicController().getAllAlbums);
musicRouter.get("/albums-by-band", new MusicController().getAlbumByBand)
musicRouter.delete("/delete-album:id", new MusicController().deleteAlbum);
musicRouter.delete("/delete-music:id", new MusicController().deleteMusic);
musicRouter.delete("/delete-genre:id", new MusicController().deleteGenre);