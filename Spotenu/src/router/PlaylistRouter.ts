import express from "express";
import { PlaylistController } from "../controller/PlaylistController";

export const playlistRouter = express.Router();

playlistRouter.post("/create-playlist", new PlaylistController().createPlaylist);
playlistRouter.post("/add-music-to-playlist", new PlaylistController().addMusicToPlaylist);
playlistRouter.get("/playlists-by-user", new PlaylistController().getPlaylistsByUser);
playlistRouter.get("/all-playlists", new PlaylistController().getAllPlaylists);
playlistRouter.get("/musics-by-playlist", new PlaylistController().getMusicsByPlaylist);
playlistRouter.put("/edit-playlist-name", new PlaylistController().editPlaylistName);
playlistRouter.post("/make-playlist-collaborative", new PlaylistController().makePlaylistCollaborative);
playlistRouter.get("/collaborative-playlists", new PlaylistController().getCollaborativePlaylists);
playlistRouter.post("/follow-collaborative-playlist", new PlaylistController().followCollaborativePlaylist)
playlistRouter.delete("/delete-musics-from-playlist/:playlistId/:musicsId", new PlaylistController().deleteMusicFromPlaylist);