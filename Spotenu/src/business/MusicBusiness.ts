import { MusicDatabase } from "../data/MusicDatabase";
import { GenericError } from "../Erros/GenericError";
import { NotFoundError } from "../Erros/NotFoundError";
import { UserRole } from "../model/User";
import { TokenGenerator } from "../service/tokenGenerator";
import { AlbumDatabase } from "../data/AlbumDatabase";

export class MusicBusiness {

  public async addMusic(id: string, name: string, album: string, token: string): Promise<void> {

    const userData = await new TokenGenerator().verify(token);

    if (userData.role !== UserRole.BAND) {
      throw new GenericError("Apenas bandas podem adicionar músicas.");
    }

    if (!name.trim()) {
      throw new GenericError("O campo não pode ser vazio.");
    }

    const albumData = await new AlbumDatabase().getAlbumByName(album);


    if (albumData.length === 0) {
      throw new NotFoundError("Este album não existe em nosso banco de dados.");
    }

    const musicData = await new MusicDatabase().getMusicByName(name);

    if (musicData) {
      if (albumData.album_id === musicData.album_id) {
        throw new GenericError("Música já foi cadastrada!");
      }
    }

    await new MusicDatabase().addMusic(id, name, albumData.album_id, userData.id);

  }

  public async getMusicsByBand(token: string, page: number): Promise<any> {
    const userData = await new TokenGenerator().verify(token);

    if (!userData) {
      throw new GenericError("Você precisa fazer login para acessar este recurso.");
    }

    const genresPerPage: number = 10;
    let offset: number = genresPerPage * page;

    return await new MusicDatabase().getMusicsByBand(userData.id, genresPerPage, offset);
  }

  public async getAllMusics(token: string, page: number): Promise<any> {
    const userData = await new TokenGenerator().verify(token);

    if (!userData) {
      throw new GenericError("Você precisa fazer login para acessar este recurso.");
    }

    const musicsPerPage: number = 10;
    let offset: number = musicsPerPage * page;

    return await new MusicDatabase().getAllMusics(musicsPerPage, offset);

  }

  public async searchMusics(musicName: string, page: number, token: string): Promise<any> {
    const userData = await new TokenGenerator().verify(token);

    if (!userData) {
      throw new GenericError("Você precisa fazer login para acessar este recurso.");
    }

    const musicsPerPage: number = 10;
    let offset: number = musicsPerPage * page;

    return await new MusicDatabase().searchMusics(musicName, musicsPerPage, offset);
  }

  public async editMusicName(token: string, musicName: string, musicId: string): Promise<void> {
    const userData = await new TokenGenerator().verify(token);

    if (!userData) {
      throw new GenericError("Você precisa fazer login para acessar este recurso.");
    }

    if (userData.role !== UserRole.BAND && userData.role !== UserRole.ADM) {
      throw new GenericError("Apenas administradores ou bandas editar músicas");
    }

    await new MusicDatabase().editMusicName(musicName, musicId);
  }

  public async deleteMusic(id: string, token: string): Promise<void> {
    const userData = await new TokenGenerator().verify(token);

    if (!userData) {
      throw new GenericError("Você precisa fazer login para acessar este recurso.");
    }

    if (userData.role !== UserRole.BAND && userData.role !== UserRole.ADM) {
      throw new GenericError("Apenas administradores ou bandas podem deletar músicas");
    }

    let musicsId: string[] = id.split(",");
    
    await new MusicDatabase().deleteMusic(userData.id, musicsId);
  }
}