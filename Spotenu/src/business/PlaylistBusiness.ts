import { PlaylistDatabase } from "../data/PlaylistDatabase";
import { GenericError } from "../Erros/GenericError";
import { UserRole } from "../model/User";
import { TokenGenerator } from "../service/tokenGenerator";

export class PlaylistBusiness {
  public async createPlaylist(id: string, token: string, name: string): Promise<void> {
    const userData = await new TokenGenerator().verify(token);

    if (!userData) {
      throw new GenericError("Você precisa fazer login para acessar este recurso.");
    }

    if (!name.trim()) {
      throw new GenericError("O campo não pode ser vazio.");
    }

    await new PlaylistDatabase().createPlaylist(id, userData.id, name);

  }

  public async addMusicToPlaylist(token: string, playlistId: string, musicsId: string[]): Promise<void> {

    const userData = await new TokenGenerator().verify(token);

    if (!userData) {
      throw new GenericError("Você precisa fazer login para acessar este recurso.");
    }

    if (!playlistId.trim() || musicsId.length === 0) {
      throw new GenericError("O campo não pode ser vazio.");
    }

    await new PlaylistDatabase().addMusicToPlaylist(playlistId, musicsId);

  }

  public async getPlaylistsByUser(token: string, page: number): Promise<any> {

    const userData = await new TokenGenerator().verify(token);

    if (!userData) {
      throw new GenericError("Você precisa fazer login para acessar este recurso.");
    }

    const playlistsPerPage: number = 10;
    let offset: number = playlistsPerPage * page;

    return await new PlaylistDatabase().getPlaylistsByUser(userData.id, playlistsPerPage, offset);

  }

  public async getAllPlaylists(token: string, page: number): Promise<any> {

    const userData = await new TokenGenerator().verify(token);

    if (!userData) {
      throw new GenericError("Você precisa fazer login para acessar este recurso.");
    }

    const playlistsPerPage: number = 10;
    let offset: number = playlistsPerPage * page;

    return await new PlaylistDatabase().getAllPlaylists(playlistsPerPage, offset);

  }

  public async getMusicsByPlaylist(token: string, playlistId: string, page: number): Promise<any> {

    const userData = await new TokenGenerator().verify(token);

    if (!userData) {
      throw new GenericError("Você precisa fazer login para acessar este recurso.");
    }

    const musicsByPlaylistPerPage: number = 10;
    let offset: number = musicsByPlaylistPerPage * page;

    return await new PlaylistDatabase().getMusicsByPlaylist(playlistId, musicsByPlaylistPerPage, offset);

  }

  public async editPlaylistName(token: string, playlistId: string, playlistName: string): Promise<void> {
    const userData = await new TokenGenerator().verify(token);

    if (!userData) {
      throw new GenericError("Você precisa fazer login para acessar este recurso.");
    }

    if (userData.role !== UserRole.PREMIUM_LISTENER && userData.role !== UserRole.ADM) {
      throw new GenericError("Apenas ouvintes premium ou administradores podem editar playlists,");
    }

    await new PlaylistDatabase().editPlaylistName(playlistId, playlistName);
  }

  public async makePlaylistCollaborative(token: string, playlistId: string, idOwner: string, isPrivate: boolean): Promise<void> {
    const userData = await new TokenGenerator().verify(token);

    if (!userData) {
      throw new GenericError("Você precisa fazer login para acessar este recurso.");
    }

    if (userData.role !== UserRole.PREMIUM_LISTENER && userData.role !== UserRole.ADM) {
      throw new GenericError("Apenas ouvintes premium ou administradores podem editar playlists,");
    }

    await new PlaylistDatabase().makePlaylistCollaborative(playlistId, idOwner, isPrivate);
  }

  public async getCollaborativePlaylists(token: string, page: number): Promise<any> {
    const userData = await new TokenGenerator().verify(token);

    if (!userData) {
      throw new GenericError("Você precisa fazer login para acessar este recurso.");
    }

    if (userData.role !== UserRole.PREMIUM_LISTENER && userData.role !== UserRole.ADM) {
      throw new GenericError("Apenas ouvintes premium podem acessar este recurso.");
    }

    const collaborativePlaylistsPerPage: number = 10;
    let offset: number = collaborativePlaylistsPerPage * page;

    return await new PlaylistDatabase().getCollaborativePlaylists(collaborativePlaylistsPerPage, offset);
  }

  public async followCollaborativePlaylist(token: string, playlistId: string) {
    const userData = await new TokenGenerator().verify(token);

    const followerAndOwner = await new PlaylistDatabase().getFollowerAndOwnerCollaborativePlaylistById(userData.id, playlistId);

    if (followerAndOwner.length > 0) {
      throw new GenericError("Playlist is already being followed.")
    }

    if (!userData) {
      throw new GenericError("Você precisa fazer login para acessar este recurso.");
    }

    if (userData.role !== UserRole.PREMIUM_LISTENER && userData.role !== UserRole.ADM) {
      throw new GenericError("Apenas ouvintes premiums podem seguir playlists.");
    }

    await new PlaylistDatabase().followCollaborativePlaylist(playlistId, userData.id);
  }

  public async deleteMusicFromPlaylist(token: string, playlistId: string, musicsId: string): Promise<void> {
    const userData = await new TokenGenerator().verify(token);

    if (!userData) {
      throw new GenericError("Você precisa fazer login para acessar este recurso.");
    }

    let arrayMusicsId: string[] = musicsId.split(",");

    await new PlaylistDatabase().deleteMusicFromPlaylist(playlistId, arrayMusicsId);
  }
}