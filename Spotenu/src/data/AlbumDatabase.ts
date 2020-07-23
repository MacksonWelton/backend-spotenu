import { BaseDatabase } from "./BaseDatabase";

export class AlbumDatabase extends BaseDatabase {
  private static TABLE_GENRE: string = "spotenu_genre";
  private static TABLE_MUSIC: string = "spotenu_musics";
  private static TABLE_ALBUM: string = "spotenu_album";
  private static TABLE_ALBUM_GENRE: string = "spotenu_album_genre";
  private static TABLE_PLAYLIST: string = "spotenu_playlists";
  private static TABLE_PLAYLIST_MUSIC: string = "spotenu_playlists_musics";

  public async createAlbum(idAlbum: string, idBand: string, name: string, genres: string[]): Promise<void> {
    await super.getConnection().raw(`
      INSERT INTO ${AlbumDatabase.TABLE_ALBUM} (id_album, id_band, album_name)
      VALUES("${idAlbum}", "${idBand}", "${name}")
    `);

    for (let idGenre of genres) {
      await super.getConnection().raw(`
        INSERT INTO ${AlbumDatabase.TABLE_ALBUM_GENRE} (id_album, id_genre)
        VALUES("${idAlbum}", "${idGenre}")
      `);
    }
  }

  public async getAlbumByName(name: string): Promise<any> {
    const result = await super.getConnection().raw(`
    SELECT * FROM ${AlbumDatabase.TABLE_ALBUM}
    WHERE album_name = "${name}"
  `);

    return result[0][0];
  }

  public async getAllAlbums(albumsPerPage: number, offset: number): Promise<any> {
    const result = await super.getConnection().raw(`
      SELECT SQL_CALC_FOUND_ROWS * FROM ${AlbumDatabase.TABLE_ALBUM}
      JOIN spotenu_users
      ON ${AlbumDatabase.TABLE_ALBUM}.id_band = spotenu_users.id
      LIMIT ${albumsPerPage} OFFSET ${offset}
    `);

    const numberOfRows = await super.getConnection().raw(`
      SELECT FOUND_ROWS() as numberOfRows;
    `);

    return { numberOfRows: numberOfRows[0][0].numberOfRows, albums: result[0] };
  }

  public async getAlbumByBand(id: string, albumsPerPage: number, offset: number): Promise<any> {
    const result = await super.getConnection().raw(`
      SELECT SQL_CALC_FOUND_ROWS  * FROM ${AlbumDatabase.TABLE_ALBUM}
      JOIN spotenu_users
      ON spotenu_users.id = "${id}" AND id_band = "${id}"
      LIMIT ${albumsPerPage} OFFSET ${offset}
    `);

    const numberOfRows = await super.getConnection().raw(`
      SELECT FOUND_ROWS() as numberOfRows;
    `);

    return { numberOfRows: numberOfRows[0][0].numberOfRows, albums: result[0] };
  }

  public async deleteAlbum(id: string[]): Promise<void> {
    await super.getConnection()
      .del()
      .whereIn("id_album", id)
      .from(AlbumDatabase.TABLE_ALBUM)
  }
}