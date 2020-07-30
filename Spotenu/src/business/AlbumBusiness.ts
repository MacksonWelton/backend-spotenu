import { AlbumDatabase } from "../data/AlbumDatabase";
import { GenericError } from "../Erros/GenericError";
import { NotFoundError } from "../Erros/NotFoundError";
import { UserRole } from "../model/User";
import { TokenGenerator } from "../service/tokenGenerator";
import { MusicDatabase } from "../data/MusicDatabase";
import { GenreDatabase } from "../data/GenreDatabase";

export class AlbumBusiness {

  public async createAlbum(id: string, name: string, genres: string[], token: string): Promise<any> {

    const userData = await new TokenGenerator().verify(token);

    if (!name.trim()) {
      throw new GenericError("O campo pode ser vazio.")
    }

    if (userData.role !== UserRole.BAND) {
      throw new GenericError("Apenas bandas podem criar albums.");
    }

    const genresData = await new GenreDatabase().getGenreByName(genres);

    const genresId = genresData.map(genre => genre.id);

    await new AlbumDatabase().createAlbum(id, userData.id, name, genresId);
  }

  public async getAllAlbums(token: string, page: number): Promise<any> {

    const userData = await new TokenGenerator().verify(token);

    if (!userData) {
      throw new GenericError("Você precisa fazer login para acessar este recurso.");
    }

    const genresPerPage: number = 10;
    let offset: number = genresPerPage * page;

    return await new AlbumDatabase().getAllAlbums(genresPerPage, offset);

  }

  public async getAlbumByBand(token: string, page: number): Promise<any> {

    const userData = await new TokenGenerator().verify(token);

    if (!userData) {
      throw new GenericError("Você precisa fazer login para acessar este recurso.");
    }

    const genresPerPage: number = 10;
    let offset: number = genresPerPage * page;

    return await new AlbumDatabase().getAlbumByBand(userData.id, genresPerPage, offset);
  }

  public async getMusicsbyAlbum(albumId: string, token: string): Promise<any> {
    const userData = await new TokenGenerator().verify(token);

    if (!userData) {
      throw new GenericError("Você precisa fazer login para acessar este recurso.");
    }

    return await new MusicDatabase().getMusicsbyAlbum(albumId);
  }

  public async editAlbumName(token: string, albumId: string, name: string): Promise<void>{
    const userData = await new TokenGenerator().verify(token);

    if (!userData) {
      throw new GenericError("Você precisa fazer login para acessar este recurso.");
    }

    if (userData.role !== UserRole.BAND && userData.role !== UserRole.ADM) {
      throw new GenericError("Apenas administradores ou bandas podem editar albums");
    }

    await new AlbumDatabase().editAlbumName(userData.id, albumId, name);
  }

  public async editAlbumGenres(token: string, albumId: string, genresId: string): Promise<void> {
    const userData = await new TokenGenerator().verify(token);

    if (!userData) {
      throw new GenericError("Você precisa fazer login para acessar este recurso.");
    }

    
    if (userData.role !== UserRole.BAND && userData.role !== UserRole.ADM) {
      throw new GenericError("Apenas administradores ou bandas podem editar albums");
    }

    await new AlbumDatabase().editAlbumGenres(albumId, genresId);
  }

  public async deleteAlbum(id: string, token: string): Promise<void> {
    const userData = await new TokenGenerator().verify(token);

    if (!userData) {
      throw new GenericError("Você precisa fazer login para acessar este recurso.");
    }

    if (userData.role !== UserRole.BAND && userData.role !== UserRole.ADM) {
      throw new GenericError("Apenas administradores ou bandas podem deletar albums");
    }

    let albumsId: string[] = [];
    albumsId = id.split(",");

    await new AlbumDatabase().deleteAlbum(albumsId);
  }
}