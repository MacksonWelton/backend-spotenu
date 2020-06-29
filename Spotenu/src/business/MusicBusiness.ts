import { MusicDatabase } from "../data/MusicDatabase";
import { GenericError } from "../Erros/GenericError";
import { NotFoundError } from "../Erros/NotFoundError";
import { UserRole } from "../model/User";
import { TokenGenerator } from "../service/tokenGenerator";

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

    const genresData = await new MusicDatabase().getGenreByName(genres);

    const genresId = genresData.map(genre => genre.id);

    await new MusicDatabase().createAlbum(id, dataUser.id, name, genresId);
  }

  public async addMusic(id: string, name: string, album: string, token: string): Promise<void> {

    const dataUser = await new TokenGenerator().verify(token);

    if (dataUser.role !== UserRole.BAND) {
      throw new GenericError("Only bands can add musics");
    }

    const dataAlbum = await new MusicDatabase().getAlbumByName(album);


    if (dataAlbum.length === 0) {
      throw new NotFoundError("This album already exists in the database");
    }

    const music = await new MusicDatabase().getMusicByName(name);

    if (music) {
      if (dataAlbum === music.album) {
        throw new GenericError("This music has already been registered");
      }
    }

    await new MusicDatabase().addMusic(id, name, dataAlbum.id_album, dataUser.id);

  }

  public async getAllAlbums(token: string): Promise<any> {

    const dataUser = await new TokenGenerator().verify(token);

    if (!dataUser) {
      throw new GenericError("You must be logged in to access this feature.");
    }

    return await new MusicDatabase().getAllAlbums();

  }

  public async getAlbumByBand(token: string, idBand: string): Promise<any> {

    const dataUser = await new TokenGenerator().verify(token);

    if (!dataUser) {
      throw new GenericError("You must be logged in to access this feature.");
    }

    return await new MusicDatabase().getAlbumByBand(dataUser.id, idBand);
  }

  public async getAllGenres(token: string): Promise<any> {
    const dataUser = await new TokenGenerator().verify(token);

    if (!dataUser) {
      throw new GenericError("You must be logged in to access this feature.");
    }

    return await new MusicDatabase().getAllGenres();
  }

  public async getMusicsByBand(token: string, idBand: string): Promise<any> {
    const dataUser = await new TokenGenerator().verify(token);

    if (!dataUser) {
      throw new GenericError("You must be logged in to access this feature.");
    }

    return await new MusicDatabase().getMusicsByBand(dataUser.id, idBand);
  }

  public async getMusicsbyAlbum(idAlbum: string, token: string): Promise<any> {
    const dataUser = await new TokenGenerator().verify(token);

    if (!dataUser) {
      throw new GenericError("You must be logged in to access this feature.");
    }

    return await new MusicDatabase().getMusicsbyAlbum(idAlbum);
  }

  public async getAllMusics(token: string): Promise<any> {
    const dataUser = await new TokenGenerator().verify(token);

    if (!dataUser) {
      throw new GenericError("You must be logged in to access this feature.");
    }

    return await new MusicDatabase().getAllMusics();

  }

  
  public async deleteAlbum(id: string, token: string): Promise<void> {
    const dataUser = await new TokenGenerator().verify(token);

    if (!dataUser) {
      throw new GenericError("You must be logged in to access this feature.");
    }

    await new MusicDatabase().deleteAlbum(id);
  }

  
  public async deleteMusic(id: string, token: string): Promise<void> {
    const dataUser = await new TokenGenerator().verify(token);

    if (!dataUser) {
      throw new GenericError("You must be logged in to access this feature.");
    }

    await new MusicDatabase().deleteMusic(id);
  }

  
  public async deleteGenre(id: string, token: string): Promise<void> {
    const dataUser = await new TokenGenerator().verify(token);

    if (!dataUser) {
      throw new GenericError("You must be logged in to access this feature.");
    }

    await new MusicDatabase().deleteGenre(id);
  }

}