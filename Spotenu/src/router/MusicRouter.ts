import express from "express";
import { MusicController } from "../controller/MusicController";

export const musicRouter = express.Router();

musicRouter.post("/add-music", new MusicController().addMusic);
musicRouter.get("/all-musics", new MusicController().getAllMusics);
musicRouter.get("/musics-by-band", new MusicController().getMusicsByBand);
musicRouter.get("/search", new MusicController().searchMusics);
musicRouter.delete("/delete-music/:id", new MusicController().deleteMusic);