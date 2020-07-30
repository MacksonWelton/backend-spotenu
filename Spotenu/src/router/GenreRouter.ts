import express from "express";
import { GenreController } from "../controller/GenreController";

export const genreRouter = express.Router();

genreRouter.post("/add-genre", new GenreController().addGenre);
genreRouter.get("/genre", new GenreController().getGenreByName);
genreRouter.get("/genres", new GenreController().getAllGenres);
genreRouter.delete("/delete-genre/:genresId", new GenreController().deleteGenre);