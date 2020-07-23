import { BaseDatabase } from "./BaseDatabase";

export class PlaylistDatabase extends BaseDatabase {
  private static TABLE_PLAYLIST: string = "spotenu_playlists";
  private static TABLE_PLAYLIST_MUSIC: string = "spotenu_playlists_musics";
  private static TABLE_MUSIC: string = "spotenu_musics";


  public async createPlaylist(id: string, idUser: string, name: string): Promise<void> {
    await super.getConnection().raw(`
      INSERT INTO ${PlaylistDatabase.TABLE_PLAYLIST} (id_playlist, name_playlist, id_user)
      VALUES("${id}", "${name}", "${idUser}")
    `);
  }

  public async addMusicToPlaylist(idPlaylist: string, idMusics: string[]): Promise<void> {

    const playlist = idMusics.map(id => ({
      id_playlist: idPlaylist,
      id_music: id
    }));

    await super.getConnection()
      .insert(playlist)
      .into(PlaylistDatabase.TABLE_PLAYLIST_MUSIC);

  }

  public async getPlaylistsByUser(idUser: string, playlistsPerPage: number, offset: number): Promise<any> {
    const result = await super.getConnection().raw(`
      SELECT SQL_CALC_FOUND_ROWS * FRIN ${PlaylistDatabase.TABLE_PLAYLIST}
      WHERE id_user = ${idUser}
      LIMIT ${playlistsPerPage} OFFSET ${offset}
    `);

    const numberOfRows = await super.getConnection().raw(`
      SELECT FOUND_ROWS() as numberOfRows;
    `);

    return { numberOfRows: numberOfRows[0][0].numberOfRows, playlists: result[0] };
  }

  public async getAllPlaylists(playlistsPerPage: number, offset: number): Promise<any> {
    const result = await super.getConnection().raw(`
      SELECT SQL_CALC_FOUND_ROWS * FROM ${PlaylistDatabase.TABLE_PLAYLIST}
      LIMIT ${playlistsPerPage} OFFSET ${offset}
    `);

    const numberOfRows = await super.getConnection().raw(`
      SELECT FOUND_ROWS() as numberOfRows;
    `);

    return { numberOfRows: numberOfRows[0][0].numberOfRows, playlists: result[0] };
  }

  public async getMusicsByPlaylist(idPlaylist: string, playlistsPerPage: number, offset: number): Promise<any> {
    const result = await super.getConnection().raw(`
      SELECT SQL_CALC_FOUND_ROWS * FROM ${PlaylistDatabase.TABLE_PLAYLIST_MUSIC}
      JOIN ${PlaylistDatabase.TABLE_MUSIC}
      ON spotenu_musics.id_music = spotenu_playlists_musics.id_music
      and id_playlist = ${idPlaylist}
      LIMIT ${playlistsPerPage} OFFSET ${offset}
    `)
  }

  
}