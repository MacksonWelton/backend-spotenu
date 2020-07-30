import { BaseDatabase } from "./BaseDatabase";

export class PlaylistDatabase extends BaseDatabase {

  private static TABLE_PLAYLIST: string = "spotenu_playlists";
  private static TABLE_PLAYLIST_MUSIC: string = "spotenu_playlists_musics";
  private static TABLE_MUSIC: string = "spotenu_musics";
  private static TABLE_COLLABORATIVE_PLAYLISTS = "spotenu_collaborative_playlists";

  public async createPlaylist(id: string, userId: string, name: string): Promise<void> {
    await super.getConnection().raw(`
      INSERT INTO ${PlaylistDatabase.TABLE_PLAYLIST} (playlist_id, name_playlist, id_user)
      VALUES("${id}", "${name}", "${userId}")
    `);
  }

  public async addMusicToPlaylist(playlistId: string, musicsId: string[]): Promise<void> {

    const playlist = musicsId.map(id => ({
      playlist_id: playlistId,
      music_id: id
    }));

    await super.getConnection()
      .insert(playlist)
      .into(PlaylistDatabase.TABLE_PLAYLIST_MUSIC);

  }

  public async getPlaylistsByUser(userId: string, playlistsPerPage: number, offset: number): Promise<any> {

    const collaborativePlaylist = await super.getConnection().raw(`
      SELECT playlist_id FROM ${PlaylistDatabase.TABLE_COLLABORATIVE_PLAYLISTS}
      WHERE followers_id = "${userId}" OR playlist_owner_id = "${userId}"
    `);

    const idCollaborativePlaylist: string[] = collaborativePlaylist[0].map(playlist => 
    ("'" + playlist.playlist_id + "'")).toString();

    const result = await super.getConnection().raw(`
      SELECT SQL_CALC_FOUND_ROWS * FROM ${PlaylistDatabase.TABLE_PLAYLIST}
      WHERE playlist_id IN (${idCollaborativePlaylist})
      OR id_user = "${userId}"
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

  public async getMusicsByPlaylist(playlistId: string, musicsByPlaylistPerPage: number, offset: number): Promise<any> {

    const result = await super.getConnection().raw(`
      SELECT SQL_CALC_FOUND_ROWS * FROM ${PlaylistDatabase.TABLE_PLAYLIST_MUSIC}
      JOIN ${PlaylistDatabase.TABLE_MUSIC}
      ON spotenu_musics.music_id = spotenu_playlists_musics.music_id
      and playlist_id = "${playlistId}"
      LIMIT ${musicsByPlaylistPerPage} OFFSET ${offset}
    `);

    const numberOfRows = await super.getConnection().raw(`
      SELECT FOUND_ROWS() as numberOfRows;
   `);

    return { numberOfRows: numberOfRows[0][0].numberOfRows, musics: result[0] };
  }

  public async editPlaylistName(playlistId: string, playlistName: string): Promise<void> {

    await super.getConnection().raw(`
      UPDATE ${PlaylistDatabase.TABLE_PLAYLIST}
      SET name_playlist = "${playlistName}"
      WHERE playlist_id = "${playlistId}"
    `)

  }

  public async makePlaylistCollaborative(playlistId: string, idOwner: string, isPrivate: boolean): Promise<void> {

    const isPrivateNumber = super.convertBooleanToTinyInt(isPrivate);

    if (isPrivate) {
      await super.getConnection().raw(`
        DELETE FROM ${PlaylistDatabase.TABLE_COLLABORATIVE_PLAYLISTS}
        WHERE playlist_id = "${playlistId}"
    `)
    } else {
      await super.getConnection().raw(`
        INSERT INTO ${PlaylistDatabase.TABLE_COLLABORATIVE_PLAYLISTS} (playlist_id, playlist_owner_id)
        VALUES("${playlistId}", "${idOwner}")
    `);
    }

    await super.getConnection().raw(`
    UPDATE ${PlaylistDatabase.TABLE_PLAYLIST}
    SET is_private = "${isPrivateNumber}"
    WHERE playlist_id = "${playlistId}"
  `);
  }
  
  public async getCollaborativePlaylists(collaborativePlaylistPerPage: number, offset: number): Promise<any> {

    const result = await super.getConnection().raw(`
      SELECT SQL_CALC_FOUND_ROWS * FROM ${PlaylistDatabase.TABLE_PLAYLIST}
      WHERE is_private = 0
      LIMIT ${collaborativePlaylistPerPage} OFFSET ${offset}
    `);

    const numberOfRows = await super.getConnection().raw(`
      SELECT FOUND_ROWS() as numberOfRows;
    `);

    return { numberOfRows: numberOfRows[0][0].numberOfRows, playlists: result[0] }
  }

  public async getFollowerAndOwnerCollaborativePlaylistById(idPremiumListener: string, playlistId: string): Promise<any> {

    const result = await super.getConnection().raw(`
      SELECT * FROM ${PlaylistDatabase.TABLE_COLLABORATIVE_PLAYLISTS}
      WHERE  playlist_owner_id = "${idPremiumListener}" AND playlist_id = "${playlistId}" OR followers_id = "${idPremiumListener}" AND playlist_id = "${playlistId}"
    `);

    return result[0];
  }

  public async followCollaborativePlaylist(playlistId: string, idPremiumListener: string): Promise<void> {

    await super.getConnection().raw(`
      INSERT INTO ${PlaylistDatabase.TABLE_COLLABORATIVE_PLAYLISTS} (playlist_id, followers_id)
      VALUES("${playlistId}", "${idPremiumListener}")
    `);
  }

  public async deleteMusicFromPlaylist(playlistId: string, musicsId: string[]): Promise<void> {

    await super.getConnection()
      .del()
      .where("playlist_id", playlistId)
      .whereIn("music_id", musicsId)
      .from(PlaylistDatabase.TABLE_PLAYLIST_MUSIC)
  }
}