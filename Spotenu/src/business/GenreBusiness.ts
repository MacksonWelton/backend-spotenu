import { GenreDatabase } from "../data/GenreDatabase";
import { GenericError } from "../Erros/GenericError";
import { NotFoundError } from "../Erros/NotFoundError";
import { UserRole } from "../model/User";
import { TokenGenerator } from "../service/tokenGenerator";
import { AlbumDatabase } from "../data/AlbumDatabase";

export class GenreBusiness {
  public async addGenre(id: string, name: string, token: string): Promise<void> {

    const genre: any = await new GenreDatabase().getGenreByName([name]);

    if (genre !== undefined) {
      throw new NotFoundError("This genre already exists in the database");
    }

    if (!name.trim()) {
      throw new GenericError("The field cannot be empty")
    }

    const userRole = new TokenGenerator().verify(token).role;

    if (userRole !== UserRole.ADM) {
      throw new GenericError("You must be an administrator to access this feature.");
    }

    await new GenreDatabase().addGenre(id, name);

  }

  public async getGenreByName(name: string, token: string): Promise<any> {

    const userRole = new TokenGenerator().verify(token).role;

    if (userRole !== UserRole.ADM) {
      throw new GenericError("You must be an administrator to access this feature.");
    }

    const genre = new GenreDatabase().getGenreByName(name);

    if (genre === undefined) {
      throw new NotFoundError("This genre already exists in the database");
    }

    return genre;
  }

  public async getAllGenres(token: string, page: number): Promise<any> {
    const dataUser = await new TokenGenerator().verify(token);

    if (!dataUser) {
      throw new GenericError("You must be logged in to access this feature.");
    }

    const genresPerPage: number = 10;
    let offset: number = genresPerPage * page;

    return await new GenreDatabase().getAllGenres(genresPerPage, offset);
  }

  public async deleteGenre(id: string, token: string): Promise<void> {
    const dataUser = await new TokenGenerator().verify(token);

    if (!dataUser) {
      throw new GenericError("You must be logged in to access this feature.");
    }

    await new GenreDatabase().deleteGenre(id);
  }
}