import { BaseDatabase } from "./BaseDatabase";

export class MusicDatabase extends BaseDatabase {
  private static TABLE_GENRE: string = "spotenu_genre";
  private static TABLE_MUSIC: string = "spotenu_musics";



  public async getMusicByName(name: string): Promise<any> {
    const result = await super.getConnection().raw(`
      SELECT * FROM ${ MusicDatabase.TABLE_MUSIC}
      WHERE name_music = "${name}"
      `);

    return result[0][0];
  }

  public async searchMusics(musicName: string, musicsPerPage: number, offset: number): Promise<any> {
    const result = await super.getConnection().raw(`
      SELECT SQL_CALC_FOUND_ROWS * FROM ${ MusicDatabase.TABLE_MUSIC}
      JOIN spotenu_users
      ON spotenu_users.id = id_band and name_music LIKE "%${musicName}%"
      LIMIT ${musicsPerPage} OFFSET ${offset}
      `);

    const numberOfRows = await super.getConnection().raw(`
    SELECT FOUND_ROWS() as numberOfRows;
    `);

    return { numberOfRows: numberOfRows[0][0].numberOfRows, musics: result[0] };
  }

  public async addMusic(id: string, name: string, idAlbum: string, idBand: string): Promise<void> {
    await super.getConnection().raw(`
      INSERT INTO ${ MusicDatabase.TABLE_MUSIC}(id_music, name_music, id_album, id_band)
      VALUES("${id}", "${name}", "${idAlbum}", "${idBand}")
        `);
  }

  public async getMusicsByBand(id: string, musicsPerPage: number, offset: number): Promise<any> {
    const result = await super.getConnection().raw(`
      SELECT SQL_CALC_FOUND_ROWS * FROM ${MusicDatabase.TABLE_MUSIC}
      JOIN spotenu_users 
      ON spotenu_users.id = "${id}" AND id_band = "${id}"
      LIMIT ${musicsPerPage} OFFSET ${offset}
    `);

    const numberOfRows = await super.getConnection().raw(`
      SELECT FOUND_ROWS() as numberOfRows;
    `);

    return { numberOfRows: numberOfRows[0][0].numberOfRows, musics: result[0] };
  }

  public async getMusicsbyAlbum(idAlbum: string): Promise<any> {
    const result = await super.getConnection().raw(`
      SELECT * FROM ${MusicDatabase.TABLE_MUSIC}
      WHERE id_album = "${idAlbum}"
    `);

    return result[0];
  }

  public async getAllMusics(musicsPerPage: number, offset: number): Promise<any> {
    const result = await super.getConnection().raw(`
      SELECT SQL_CALC_FOUND_ROWS * FROM ${MusicDatabase.TABLE_MUSIC}
      JOIN spotenu_users
      ON ${MusicDatabase.TABLE_MUSIC}.id_band = spotenu_users.id
      LIMIT ${musicsPerPage} OFFSET ${offset}
    `);

    const numberOfRows = await super.getConnection().raw(`
      SELECT FOUND_ROWS() as numberOfRows;
    `);

    return { numberOfRows: numberOfRows[0][0].numberOfRows, musics: result[0] };
  }

  public async deleteMusic(id: string[]): Promise<void> {
    await super.getConnection()
      .del()
      .whereIn("id_music", id)
      .from(MusicDatabase.TABLE_MUSIC)
  }
}