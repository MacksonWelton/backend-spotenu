import express from "express";
import { AlbumController } from "../controller/AlbumController";

export const albumRouter = express.Router();

albumRouter.post("/create-album", new AlbumController().createAlbum);
albumRouter.get("/musics-by-album", new AlbumController().getMusicsbyAlbum);
albumRouter.get("/albums", new AlbumController().getAllAlbums);
albumRouter.get("/albums-by-band", new AlbumController().getAlbumByBand);
albumRouter.delete("/delete-album/:id", new AlbumController().deleteAlbum);