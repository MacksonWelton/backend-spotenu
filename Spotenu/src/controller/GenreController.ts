import { Request, Response } from 'express';
import { GenreBusiness } from '../business/GenreBusiness';
import { IdGenerator } from '../service/idGenerator';
import { BaseDatabase } from '../data/BaseDatabase';

export class GenreController {

  public async addGenre(req: Request, res: Response) {
    try {
      const token: string = req.headers.authorization as string || req.headers.Authorization as string;
      const name: string = req.body.name;

      const id = new IdGenerator().generate();

      await new GenreBusiness().addGenre(id, name, token);

      res.status(200).send("Cadastrado com sucesso.");
    } catch (err) {
      res.status(err.errorCode || 400).send({ message: err.message });
    }
  }

  public async getGenreByName(req: Request, res: Response) {
    try {
      const token: string = req.headers.authorization as string || req.headers.Authorization as string;
      const name: string = req.query.name as string;

      const result = new GenreBusiness().getGenreByName(name, token);

      res.status(200).send(result);

    } catch (err) {
      res.status(err.errorCode || 400).send({ message: err.message });
    }
  }

  public async getAllGenres(req: Request, res: Response) {
    try {
      const token: string = req.headers.authorization as string || req.headers.Authorization as string;
      const page: number = Number(req.query.page) >= 0 ? Number(req.query.page) : 0;

      const result = await new GenreBusiness().getAllGenres(token, page);

      res.status(200).send(result);
    } catch (err) {
      res.status(err.errorCode || 400).send({ message: err.message });
    }
  }

  public async deleteGenre(req: Request, res: Response) {
    try {
      const token = req.headers.authorization as string || req.headers.Authorization as string;
      const genresId = req.params.genresId as string;

      await new GenreBusiness().deleteGenre(genresId, token);
      res.status(200).send("Deletado com sucesso.");
    } catch (err) {
      res.status(err.errorCode || 400).send({ message: err.message });
    }
  
  }

}