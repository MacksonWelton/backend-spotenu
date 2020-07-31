import { Request, Response } from 'express';
import { AlbumBusiness } from '../business/AlbumBusiness';
import { IdGenerator } from '../service/idGenerator';

export class AlbumController {
  public async createAlbum(req: Request, res: Response) {
    try {
      const token: string = req.headers.authorization as string || req.headers.Authorization as string;
      const { name, genres } = req.body;

      const id = new IdGenerator().generate();

      await new AlbumBusiness().createAlbum(id, name, genres, token);

      res.status(200).send("Álbum criado com sucesso.");
    } catch (err) {
      res.status(err.errorCode || 400).send({ message: err.message });
    }
  }

  public async getAllAlbums(req: Request, res: Response) {
    try {
      const token: string = req.headers.authorization as string || req.headers.Authorization as string;
      const page: number = Number(req.query.page) >= 0 ? Number(req.query.page) : 0;

      const result = await new AlbumBusiness().getAllAlbums(token, page);

      res.status(200).send(result);
    } catch (err) {
      res.status(err.errorCode || 400).send({ message: err.message });
    }
  }

  public async getAlbumByBand(req: Request, res: Response) {
    try {
      const token: string = req.headers.authorization as string || req.headers.Authorization as string;

      const page: number = Number(req.query.page) >= 0 ? Number(req.query.page) : 0;

      const result = await new AlbumBusiness().getAlbumByBand(token, page);

      res.status(200).send(result);
    } catch (err) {
      res.status(err.errorCode || 400).send({ message: err.message });
    }
  }

  public async getMusicsbyAlbum(req: Request, res: Response) {
    try {
      const token: string = req.headers.authorization as string || req.headers.Authorization as string;
      const albumId: string = req.query.albumId as string;

      const result = await new AlbumBusiness().getMusicsbyAlbum(token, albumId)

      res.status(200).send(result);
    } catch (err) {
      res.status(err.errorCode || 400).send({ message: err.message });
    }
  }

  public async editAlbumName(req: Request, res: Response) {
    try {
      const token: string = req.headers.authorization as string || req.headers.Authorization as string;
      const { albumId, name } = req.body;

      await new AlbumBusiness().editAlbumName(token, albumId, name);

      res.status(200).send("Editado com sucesso.");
    } catch (err) {
      res.status(err.errorCode || 400).send({ message: err.message })
    }
  }

  public async editAlbumGenres(req: Request, res: Response) {
    try {
      const token: string = req.headers.authorization as string || req.headers.Authorization as string;
      const { albumId, genresId } = req.body;

      await new AlbumBusiness().editAlbumGenres(token, albumId, genresId);

      res.status(200).send("Editado com sucesso!");
    } catch (err) {
      res.status(err.errorCode || 400).send({ message: err.message });
    }
  }

  public async deleteAlbum(req: Request, res: Response) {
    try {
      const token = req.headers.authorization as string || req.headers.Authorization as string;
      const id: any = req.params.id;

      await new AlbumBusiness().deleteAlbum(id, token);
      res.status(200).send("Deletado com sucesso.");
    } catch (err) {
      res.status(err.errorCode || 400).send({ message: err.message });
    }
  }
}