import { Request, Response } from 'express';
import { AlbumBusiness } from '../business/AlbumBusiness';
import { IdGenerator } from '../service/idGenerator';
import { BaseDatabase } from '../data/BaseDatabase';

export class AlbumController {
  public async createAlbum(req: Request, res: Response) {
    try {
      const token: string = req.headers.authorization as string || req.headers.Authorization as string;
      const { name, genres } = req.body;

      const id = new IdGenerator().generate();

      await new AlbumBusiness().createAlbum(id, name, genres, token);

      res.status(200).send({ message: "Successfully created" })

    } catch (err) {
      res.status(err.errorCode || 400).send({ message: err.message })
    }

    await BaseDatabase.destroyConnection();
  }

  public async getAllAlbums(req: Request, res: Response) {
    try {
      const token: string = req.headers.authorization as string;
      const page: number = Number(req.query.page) >= 0 ? Number(req.query.page) : 0;

      const result = await new AlbumBusiness().getAllAlbums(token, page);

      res.status(200).send(result)
    } catch (err) {
      res.status(err.errorCode || 400).send({ message: err.message })
    }

    await BaseDatabase.destroyConnection();
  }

  public async getAlbumByBand(req: Request, res: Response) {
    try {
      const token: string = req.headers.authorization as string || req.headers.Authorization as string;

      const page: number = Number(req.query.page) >= 0 ? Number(req.query.page) : 0;

      const result = await new AlbumBusiness().getAlbumByBand(token, page);

      res.status(200).send(result)
    } catch (err) {
      res.status(err.errorCode || 400).send({ message: err.message })
    }

    await BaseDatabase.destroyConnection();
  }

  public async getMusicsbyAlbum(req: Request, res: Response) {
    try {
      const token: string = req.headers.authorization as string || req.headers.Authorization as string;
      const idAlbum: string = req.query.idAlbum as string;

      const result = await new AlbumBusiness().getMusicsbyAlbum(token, idAlbum)

      res.status(200).send(result)
    } catch (err) {
      res.status(err.errorCode || 400).send({ message: err.message })
    }

    await BaseDatabase.destroyConnection();
  }

  public async deleteAlbum(req: Request, res: Response) {
    try {
      const token = req.headers.authorization as string || req.headers.Authorization as string;
      const id: any = req.params.id;

      await new AlbumBusiness().deleteAlbum(id, token);
      res.status(200).send({ message: "Successfully deleted" });
    } catch (err) {
      res.status(err.errorCode || 400).send({ message: err.message })
    }

    await BaseDatabase.destroyConnection();
  }
}