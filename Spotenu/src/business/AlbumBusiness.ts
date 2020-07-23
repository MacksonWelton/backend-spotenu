import { AlbumDatabase } from "../data/AlbumDatabase";
import { GenericError } from "../Erros/GenericError";
import { NotFoundError } from "../Erros/NotFoundError";
import { UserRole } from "../model/User";
import { TokenGenerator } from "../service/tokenGenerator";
import { MusicDatabase } from "../data/MusicDatabase";
import { GenreDatabase } from "../data/GenreDatabase";

export class AlbumBusiness {

  public async createAlbum(id: string, name: string, genres: string[], token: string): Promise<any> {

    const dataUser = await new TokenGenerator().verify(token);

    if (!name.trim()) {
      throw new GenericError("The field cannot be empty")
    }

    if (dataUser.role !== UserRole.BAND) {
      throw new GenericError("Only bands can create albums");
    }

    const genresData = await new GenreDatabase().getGenreByName(genres);

    const genresId = genresData.map(genre => genre.id);

    await new AlbumDatabase().createAlbum(id, dataUser.id, name, genresId);
  }

  public async getAllAlbums(token: string, page: number): Promise<any> {

    const dataUser = await new TokenGenerator().verify(token);

    if (!dataUser) {
      throw new GenericError("You must be logged in to access this feature.");
    }

    const genresPerPage: number = 10;
    let offset: number = genresPerPage * page;

    return await new AlbumDatabase().getAllAlbums(genresPerPage, offset);

  }

  public async getAlbumByBand(token: string, page: number): Promise<any> {

    const dataUser = await new TokenGenerator().verify(token);

    if (!dataUser) {
      throw new GenericError("You must be logged in to access this feature.");
    }

    const genresPerPage: number = 10;
    let offset: number = genresPerPage * page;

    return await new AlbumDatabase().getAlbumByBand(dataUser.id, genresPerPage, offset);
  }

  public async getMusicsbyAlbum(idAlbum: string, token: string): Promise<any> {
    const dataUser = await new TokenGenerator().verify(token);

    if (!dataUser) {
      throw new GenericError("You must be logged in to access this feature.");
    }

    return await new MusicDatabase().getMusicsbyAlbum(idAlbum);
  }

  public async deleteAlbum(id: string, token: string): Promise<void> {
    const dataUser = await new TokenGenerator().verify(token);

    if (!dataUser) {
      throw new GenericError("You must be logged in to access this feature.");
    }

    let idAlbums: string[] = [];
    idAlbums = id.split(",");

    await new AlbumDatabase().deleteAlbum(idAlbums);
  }
}