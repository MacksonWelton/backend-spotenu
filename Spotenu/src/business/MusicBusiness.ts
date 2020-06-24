import { MusicDatabase } from "../data/MusicDatabase";
import { TokenGenerator } from "../service/tokenGenerator";
import { InvalidParameterError } from "../Erros/InvalidParameterError";
import { NotFoundError } from "../Erros/NotFoundError";
import { UserRole } from "../model/User";
import { GenericError } from "../Erros/GenericError";

export class MusicBusiness {
  public async addGenre(id: string, name: string, token: string): Promise<void> {

    const genre = new MusicDatabase().getGenreByName(name);

    if ([genre].length === 0) {
      throw new NotFoundError("This genre already exists in the database");
    }

    const userRole = new TokenGenerator().verify(token).role;

    if (userRole !== UserRole.ADM) {
      throw new GenericError("You must be an administrator to access this feature.");
    }

    await new MusicDatabase().addGenre(id, name);

  }

  public async getGenreByName(name: string, token: string): Promise<any> {

    const userRole = new TokenGenerator().verify(token).role;

    if (userRole !== UserRole.ADM) {
      throw new GenericError("You must be an administrator to access this feature.");
    }

    const genre = new MusicDatabase().getGenreByName(name);

    if (genre === undefined) {
      throw new NotFoundError("This genre already exists in the database");
    }

    return genre;
  }

  public async createAlbum(id: string, name: string, genres: string[], token: string): Promise<any> {

    const dataUser = await new TokenGenerator().verify(token);

    if (dataUser.role !== UserRole.BAND) {
      throw new GenericError("Only bands can create albums");
    }

    let getGenres: any[] = [];

    for (let genreName of genres) {
      getGenres.push(await new MusicDatabase().getGenreByName(genreName))
    }

    const genresId = getGenres.map(genre => genre.id);

    await new MusicDatabase().createAlbum(id, dataUser.id, name, genresId);
  }

  public async addMusic(id, name: string, album: string, token: string): Promise<void> {

    const dataUser = await new TokenGenerator().verify(token);

    if (dataUser.role !== UserRole.BAND) {
      throw new GenericError("Only bands can create albums");
    }

    const getAlbum = await new MusicDatabase().getAlbumByName(album);


    if (getAlbum === undefined) {
      throw new NotFoundError("This album already exists in the database");
    }

    const getMusic = await new MusicDatabase().getMusicByName(name);

    if (getMusic) {
      if (getAlbum === getMusic.album) {
        throw new GenericError("This song has already been registered");
      }
    }

    await new MusicDatabase().addMusic(id, name, album, dataUser.id)

  }
}