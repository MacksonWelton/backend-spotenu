import { MusicDatabase } from "../data/MusicDatabase";
import { GenericError } from "../Erros/GenericError";
import { NotFoundError } from "../Erros/NotFoundError";
import { UserRole } from "../model/User";
import { TokenGenerator } from "../service/tokenGenerator";
import { AlbumDatabase } from "../data/AlbumDatabase";

export class MusicBusiness {

  public async addMusic(id: string, name: string, album: string, token: string): Promise<void> {

    const dataUser = await new TokenGenerator().verify(token);

    if (dataUser.role !== UserRole.BAND) {
      throw new GenericError("Only bands can add musics");
    }

    if (!name.trim()) {
      throw new GenericError("The field cannot be empty")
    }

    const dataAlbum = await new AlbumDatabase().getAlbumByName(album);


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

  public async getMusicsByBand(token: string, page: number): Promise<any> {
    const dataUser = await new TokenGenerator().verify(token);

    if (!dataUser) {
      throw new GenericError("You must be logged in to access this feature.");
    }

    const genresPerPage: number = 10;
    let offset: number = genresPerPage * page;

    return await new MusicDatabase().getMusicsByBand(dataUser.id, genresPerPage, offset);
  }

  public async getAllMusics(token: string, page: number): Promise<any> {
    const dataUser = await new TokenGenerator().verify(token);

    if (!dataUser) {
      throw new GenericError("You must be logged in to access this feature.");
    }

    const musicsPerPage: number = 10;
    let offset: number = musicsPerPage * page;

    return await new MusicDatabase().getAllMusics(musicsPerPage, offset);

  }

  public async searchMusics(musicName: string, page: number, token: string): Promise<any> {
    const dataUser = await new TokenGenerator().verify(token);

    if (!dataUser) {
      throw new GenericError("You must be logged in to access this feature.");
    }

    const musicsPerPage: number = 10;
    let offset: number = musicsPerPage * page;

    return await new MusicDatabase().searchMusics(musicName, musicsPerPage, offset);
  }

  public async deleteMusic(id: string, token: string): Promise<void> {
    const dataUser = await new TokenGenerator().verify(token);

    if (!dataUser) {
      throw new GenericError("You must be logged in to access this feature.");
    }

    let idMusics: string[] = [];
    idMusics = id.split(",");

    await new MusicDatabase().deleteMusic(idMusics);
  }

}