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

  public async getGenreByName(name: string): Promise<any> {
    const result = await super.getConnection().raw(`
      SELECT id, name FROM ${MusicDatabase.TABLE_GENRE}
      WHERE name = "${name}"
    `)
    return result[0][0];
  }

  public async getAllGenres(): Promise<any> {
    const result = await super.getConnection().raw(`
      SELECT * FROM ${MusicDatabase.TABLE_GENRE}
    `)
    return result[0][0];
  }

  public async createAlbum(id: string, id_band: string, name: string, genres: string[]): Promise<void> {
    await super.getConnection().raw(`
      INSERT INTO ${MusicDatabase.TABLE_ALBUM} (id, id_band, name)
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
    WHERE name = "${name}"
  `)
    return result[0][0];
  }

  public async getMusicByName(name: string): Promise<any> {
    const result = await super.getConnection().raw(`
    SELECT * FROM ${MusicDatabase.TABLE_MUSIC}
    WHERE name = "${name}"
  `)
    return result[0][0];
  }

  public async addMusic(id: string, name: string, album: string, idBand: string): Promise<void> {
    await super.getConnection().raw(`
      INSERT INTO ${MusicDatabase.TABLE_MUSIC} (id, name, album, id_band)
      VALUES("${id}", "${name}", "${album}", "${idBand}")
    `)
  }
}