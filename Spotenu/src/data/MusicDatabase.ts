import { BaseDatabase } from "./BaseDatabase";

export class MusicDatabase extends BaseDatabase {
  private static TABLE_MUSIC: string = "spotenu_musics";

  public async getMusicByName(name: string): Promise<any> {
    const result = await super.getConnection().raw(`
      SELECT * FROM ${ MusicDatabase.TABLE_MUSIC}
      WHERE music_name = "${name}"
      `);

    return result[0][0];
  }

  public async searchMusics(musicName: string, musicsPerPage: number, offset: number): Promise<any> {
    const result = await super.getConnection().raw(`
      SELECT SQL_CALC_FOUND_ROWS * FROM ${ MusicDatabase.TABLE_MUSIC}
      JOIN spotenu_users
      ON spotenu_users.id = band_id and music_name LIKE "%${musicName}%"
      LIMIT ${musicsPerPage} OFFSET ${offset}
      `);

    const numberOfRows = await super.getConnection().raw(`
    SELECT FOUND_ROWS() as numberOfRows;
    `);

    return { numberOfRows: numberOfRows[0][0].numberOfRows, musics: result[0] };
  }

  public async addMusic(id: string, name: string, albumId: string, bandId: string): Promise<void> {
    await super.getConnection().raw(`
      INSERT INTO ${ MusicDatabase.TABLE_MUSIC}(music_id, music_name, album_id, band_id)
      VALUES("${id}", "${name}", "${albumId}", "${bandId}")
        `);
  }

  public async getMusicsByBand(id: string, musicsPerPage: number, offset: number): Promise<any> {
    const result = await super.getConnection().raw(`
      SELECT SQL_CALC_FOUND_ROWS * FROM ${MusicDatabase.TABLE_MUSIC}
      JOIN spotenu_users 
      ON spotenu_users.id = "${id}" AND band_id = "${id}"
      LIMIT ${musicsPerPage} OFFSET ${offset}
    `);

    const numberOfRows = await super.getConnection().raw(`
      SELECT FOUND_ROWS() as numberOfRows;
    `);

    return { numberOfRows: numberOfRows[0][0].numberOfRows, musics: result[0] };
  }

  public async getMusicsbyAlbum(albumId: string): Promise<any> {
    const result = await super.getConnection().raw(`
      SELECT * FROM ${MusicDatabase.TABLE_MUSIC}
      WHERE album_id = "${albumId}"
    `);

    return result[0];
  }

  public async getAllMusics(musicsPerPage: number, offset: number): Promise<any> {
    const result = await super.getConnection().raw(`
      SELECT SQL_CALC_FOUND_ROWS * FROM ${MusicDatabase.TABLE_MUSIC}
      JOIN spotenu_users
      ON ${MusicDatabase.TABLE_MUSIC}.band_id = spotenu_users.id
      LIMIT ${musicsPerPage} OFFSET ${offset}
    `);

    const numberOfRows = await super.getConnection().raw(`
      SELECT FOUND_ROWS() as numberOfRows;
    `);

    return { numberOfRows: numberOfRows[0][0].numberOfRows, musics: result[0] };
  }

  public async editMusicName(musicName: string, musicId: string): Promise<void> {
    await super.getConnection().raw(`
      UPDATE ${MusicDatabase.TABLE_MUSIC}
      SET music_name = "${musicName}"
      WHERE music_id = "${musicId}"
    `);
  }

  public async deleteMusic(bandId: string, musicsId: string[]): Promise<void> {
    await super.getConnection()
      .del()
      .where("band_id", bandId)
      .whereIn("music_id", musicsId)
      .from(MusicDatabase.TABLE_MUSIC)
  }
}