import express from "express";
import { PlaylistController } from "../controller/PlaylistController";

export const playlistRouter = express.Router();

playlistRouter.post("/create-playlist", new PlaylistController().createPlaylist);
playlistRouter.post("/add-music-to-playlist", new PlaylistController().addMusicToPlaylist);
playlistRouter.get("playlists-by-user", new PlaylistController().getPlaylistsByUser);
playlistRouter.get("/all-playlists", new PlaylistController().getAllPlaylists);