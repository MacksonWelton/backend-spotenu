import { GenreDatabase } from "../data/GenreDatabase";
import { GenericError } from "../Erros/GenericError";
import { NotFoundError } from "../Erros/NotFoundError";
import { UserRole } from "../model/User";
import { TokenGenerator } from "../service/tokenGenerator";

export class GenreBusiness {
  public async addGenre(id: string, name: string, token: string): Promise<void> {

    const genre: any = await new GenreDatabase().getGenreByName([name]);

    if (genre !== undefined) {
      throw new NotFoundError("Este gênero já existe no banco de dados.");
    }

    if (!name.trim()) {
      throw new GenericError("O campo não pode ser vazio.")
    }

    const userRole = new TokenGenerator().verify(token).role;

    if (userRole !== UserRole.ADM) {
      throw new GenericError("Apenas administradores podem acessar este recurso.");
    }

    await new GenreDatabase().addGenre(id, name);

  }

  public async getGenreByName(name: string, token: string): Promise<any> {

    const userRole = new TokenGenerator().verify(token).role;

    if (userRole !== UserRole.ADM) {
      throw new GenericError("Apenas administradores podem acessar este recurso.");
    }

    const genre = new GenreDatabase().getGenreByName(name);

    if (genre === undefined) {
      throw new NotFoundError("Este gênero já existe no banco de dados.");
    }

    return genre;
  }

  public async getAllGenres(token: string, page: number): Promise<any> {
    const userData = await new TokenGenerator().verify(token);

    if (!userData) {
      throw new GenericError("Você precisa fazer login para acessar este recurso.");
    }

    const genresPerPage: number = 10;
    let offset: number = genresPerPage * page;

    return await new GenreDatabase().getAllGenres(genresPerPage, offset);
  }

  public async deleteGenre(genresId: string, token: string): Promise<void> {
    const userData = await new TokenGenerator().verify(token);

    if (!userData) {
      throw new GenericError("Você precisa fazer login para acessar este recurso.");
    }

    if (userData.role !== UserRole.ADM) {
      throw new GenericError("Apenas administradores podem acessar este recurso.");
    }

    let arrayGenresId: string[] = genresId.split(",");

    await new GenreDatabase().deleteGenre(arrayGenresId);
  }
}