import { BaseDatabase } from "./BaseDatabase";

export class GenreDatabase extends BaseDatabase {

  private static TABLE_GENRE: string = "spotenu_genre";

  public async addGenre(id: string, name: string): Promise<void> {
    await super.getConnection().raw(`
    INSERT INTO ${GenreDatabase.TABLE_GENRE} (id, name)
    VALUES("${id}", "${name}")
  `);
  }

  public async getGenreByName(name: any): Promise<any> {
    const result = await super.getConnection().select("*")
      .from(GenreDatabase.TABLE_GENRE)
      .whereIn("name", name);

    return result;
  }

  public async getAllGenres(genresPerPage: number, offset: number): Promise<any> {
    const result = await super.getConnection().raw(`
    SELECT SQL_CALC_FOUND_ROWS * FROM ${GenreDatabase.TABLE_GENRE}
    LIMIT ${genresPerPage} OFFSET ${offset}
  `);

    const numberOfRows = await super.getConnection().raw(`
    SELECT FOUND_ROWS() as numberOfRows;
  `);

    return { numberOfRows: numberOfRows[0][0].numberOfRows, genres: result[0] };
  }

  public async deleteGenre(genresId: string[]): Promise<void> {
    await super.getConnection()
      .del()
      .whereIn("id", genresId)
      .from(GenreDatabase.TABLE_GENRE)
    }
}