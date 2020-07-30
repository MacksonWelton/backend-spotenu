import { BaseDatabase } from "./BaseDatabase";

export class AlbumDatabase extends BaseDatabase {
  private static TABLE_ALBUM: string = "spotenu_album";
  private static TABLE_ALBUM_GENRE: string = "spotenu_album_genre";

  public async createAlbum(albumId: string, bandId: string, name: string, genres: string[]): Promise<void> {
    await super.getConnection().raw(`
      INSERT INTO ${AlbumDatabase.TABLE_ALBUM} (album_id, band_id, album_name)
      VALUES("${albumId}", "${bandId}", "${name}")
    `);

    for (let genreId of genres) {
      await super.getConnection().raw(`
        INSERT INTO ${AlbumDatabase.TABLE_ALBUM_GENRE} (album_id, genre_id)
        VALUES("${albumId}", "${genreId}")
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
      ON ${AlbumDatabase.TABLE_ALBUM}.band_id = spotenu_users.id
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
      ON spotenu_users.id = "${id}" AND band_id = "${id}"
      LIMIT ${albumsPerPage} OFFSET ${offset}
    `);

    const numberOfRows = await super.getConnection().raw(`
      SELECT FOUND_ROWS() as numberOfRows;
    `);

    return { numberOfRows: numberOfRows[0][0].numberOfRows, albums: result[0] };
  }

  public async editAlbumName(bandId: string, albumId: string, name: string): Promise<void> {
    await super.getConnection().raw(`
      UPDATE ${AlbumDatabase.TABLE_ALBUM}
      SET album_name = "${name}"
      WHERE album_id = "${albumId}" and band_id = "${bandId}"
    `);
  }

  public async editAlbumGenres(albumId: string, genresId: string): Promise<void> {
    await super.getConnection()
      .where("album_id", albumId)
      .update("genre_id", genresId)
      .from(AlbumDatabase.TABLE_ALBUM_GENRE);
  }

  public async deleteAlbum(id: string[]): Promise<void> {
    await super.getConnection()
      .del()
      .whereIn("album_id", id)
      .from(AlbumDatabase.TABLE_ALBUM)
  }
}