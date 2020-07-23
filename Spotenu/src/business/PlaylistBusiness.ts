import { PlaylistDatabase } from "../data/PlaylistDatabase";
import { GenericError } from "../Erros/GenericError";
import { NotFoundError } from "../Erros/NotFoundError";
import { UserRole } from "../model/User";
import { TokenGenerator } from "../service/tokenGenerator";

export class PlaylistBusiness {
  public async createPlaylist(id: string, token: string, name: string): Promise<void> {
    const dataUser = await new TokenGenerator().verify(token);

    if (!dataUser) {
      throw new GenericError("You must be logged in to access this feature.");
    }

    if (!name.trim()) {
      throw new GenericError("The field cannot be empty")
    }

    await new PlaylistDatabase().createPlaylist(id, dataUser.id, name);

  }

  public async addMusicToPlaylist(token: string, idPlaylist: string, idMusics: string[]): Promise<void> {

    const dataUser = await new TokenGenerator().verify(token);

    if (!dataUser) {
      throw new GenericError("You must be logged in to access this feature.");
    }

    if (!idPlaylist.trim() || idMusics.length === 0) {
      throw new GenericError("The field cannot be empty")
    }

    await new PlaylistDatabase().addMusicToPlaylist(idPlaylist, idMusics);

  }

  public async getPlaylistsByUser(token: string, page: number): Promise<any> {

    const dataUser = await new TokenGenerator().verify(token);

    if (!dataUser) {
      throw new GenericError("You must be logged in to access this feature.");
    }

    const playlistsPerPage: number = 10;
    let offset: number = playlistsPerPage * page;

    return await new PlaylistDatabase().getPlaylistsByUser(dataUser.id, playlistsPerPage, offset);

  }

  public async getAllPlaylists(token: string, page: number): Promise<any> {

    const dataUser = await new TokenGenerator().verify(token);

    if (!dataUser) {
      throw new GenericError("You must be logged in to access this feature.");
    }

    const playlistsPerPage: number = 10;
    let offset: number = playlistsPerPage * page;

    return await new PlaylistDatabase().getAllPlaylists(playlistsPerPage, offset);

  }
}