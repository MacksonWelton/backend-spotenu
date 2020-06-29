import { BaseDatabase } from "./BaseDatabase";

export class MusicDatabase extends BaseDatabase {
  private static TABLE_GENRE: string = "spotenu_genre";
  private static TABLE_MUSIC: string = "spotenu_musics";
  private static TABLE_ALBUM: string = "spotenu_album";
  private static TABLE_ALBUM_GENRE: string = "spotenu_album_genre";

  public async addGenre(id: string, name: string): Promise<void> {
    await super.getConnection().raw(`
      INSERT INTO ${MusicDatabase.TABLE_GENRE} (id, name)
      VALUES("${id}", "${name}")
    `)
  }

  public async getGenreByName(name: any): Promise<any> {
    const result = await super.getConnection().select("*")
      .from(MusicDatabase.TABLE_GENRE)
      .whereIn("name", name);

    return result;
  }

  public async getAllGenres(): Promise<any> {
    const result = await super.getConnection().raw(`
      SELECT * FROM ${MusicDatabase.TABLE_GENRE}
    `)

    return result[0];
  }

  public async createAlbum(id: string, id_band: string, name: string, genres: string[]): Promise<void> {
    await super.getConnection().raw(`
      INSERT INTO ${MusicDatabase.TABLE_ALBUM} (id, id_band, album_name)
      VALUES("${id}", "${id_band}", "${name}")
    `)

    for (let idGenre of genres) {
      await super.getConnection().raw(`
      INSERT INTO ${MusicDatabase.TABLE_ALBUM_GENRE} (id_album, id_genre)
      VALUES("${id}", "${idGenre}")
      `)
    }
  }

  public async getAlbumByName(name: string): Promise<any> {
    const result = await super.getConnection().raw(`
    SELECT * FROM ${MusicDatabase.TABLE_ALBUM}
    WHERE album_name = "${name}"
  `)
    return result[0][0];
  }

  public async getAllAlbums(): Promise<any> {
    const result = await super.getConnection().raw(`
      SELECT * FROM ${MusicDatabase.TABLE_ALBUM}
      JOIN spotenu_users
      ON ${MusicDatabase.TABLE_ALBUM}.id_band = spotenu_users.id
    `)

    return result[0];
  }

  public async getAlbumByBand(idToken: string, idBand: string): Promise<any> {
    const id = idBand || idToken
    const result = await super.getConnection().raw(`
      SELECT * FROM ${MusicDatabase.TABLE_ALBUM}
      JOIN spotenu_users
      ON spotenu_users.id = "${id}" AND id_band = "${id}"
    `)

    return result[0];
  }

  public async getMusicByName(name: string): Promise<any> {
    const result = await super.getConnection().raw(`
    SELECT * FROM ${ MusicDatabase.TABLE_MUSIC }
    WHERE name = "${name}"
      `)
    return result[0][0];
  }

  public async addMusic(id: string, name: string, idAlbum: string, idBand: string): Promise<void> {
    await super.getConnection().raw(`
      INSERT INTO ${ MusicDatabase.TABLE_MUSIC }(id, name, id_album, id_band)
      VALUES("${id}", "${name}", "${idAlbum}", "${idBand}")
        `)
  }

  public async getMusicsByBand(idToken: string, idBand: string): Promise<any> {
    const id = idBand || idToken;
    const result = await super.getConnection().raw(`
      SELECT * FROM ${MusicDatabase.TABLE_MUSIC}
      WHERE id_band = "${id}"
    `)

    return result[0];
  }

  public async getMusicsbyAlbum(idAlbum: string): Promise<any> {
    const result = await super.getConnection().raw(`
      SELECT * FROM ${MusicDatabase.TABLE_MUSIC}
      WHERE id_album = "${idAlbum}"
  `)

  return result[0];
  }

  public async getAllMusics(): Promise<any> {
    const result = await super.getConnection().raw(`
    SELECT * FROM ${MusicDatabase.TABLE_MUSIC}
  `)

  return result[0];
  }

  public async deleteAlbum(id: string): Promise<void> {
    await super.getConnection().raw(`
      DELETE FROM ${MusicDatabase.TABLE_ALBUM}
      WHERE id_album = "${id}"
    `)
  }

  public async deleteMusic(id: string): Promise<void> {
    await super.getConnection().raw(`
      DELETE FROM ${MusicDatabase.TABLE_MUSIC}
      WHERE id_music = "${id}"
    `)
  }

  public async deleteGenre(id: string): Promise<void> {
    await super.getConnection().raw(`
      DELETE FROM ${MusicDatabase.TABLE_GENRE}
      WHERE id_music = "${id}"
  `)
  }
}