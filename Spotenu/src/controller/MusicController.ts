import { Request, Response } from 'express';
import { MusicBusiness } from '../business/MusicBusiness';
import { IdGenerator } from '../service/idGenerator';
import { BaseDatabase } from '../data/BaseDatabase';

export class MusicController {

  public async addMusic(req: Request, res: Response) {
    try {
      const token: string = req.headers.authorization as string || req.headers.Authorization as string;
      const name: string = req.body.name;
      const album: string = req.body.album;

      const id = new IdGenerator().generate();

      await new MusicBusiness().addMusic(id, name, album, token);

      res.status(200).send({ message: "Successfully add" })
    } catch (err) {
      res.status(err.errorCode || 400).send({ message: err.message })
    }

    await BaseDatabase.destroyConnection();
  }

  public async getMusicsByBand(req: Request, res: Response) {
    try {
      const token: string = req.headers.authorization as string || req.headers.Authorization as string;
      const page: number = Number(req.query.page) >= 0 ? Number(req.query.page) : 0;

      const result = await new MusicBusiness().getMusicsByBand(token, page);

      res.status(200).send(result)
    } catch (err) {
      res.status(err.errorCode || 400).send({ message: err.message })
    }

    await BaseDatabase.destroyConnection();
  }

  public async searchMusics(req: Request, res: Response) {
    try {
      const token: string = req.headers.authorization as string || req.headers.Authorization as string;
      const musicName: string = req.query.music as string;
      const page: number = Number(req.query.page) >= 0 ? Number(req.query.page) : 0;

      const result = await new MusicBusiness().searchMusics(musicName, page, token)

      res.status(200).send(result)
    } catch (err) {
      res.status(err.errorCode || 400).send({ message: err.message })
    }

    await BaseDatabase.destroyConnection();
  }

  public async getAllMusics(req: Request, res: Response) {
    try {
      const token: string = req.headers.authorization as string || req.headers.Authorization as string;
      const page: number = Number(req.query.page) >= 0 ? Number(req.query.page) : 0;

      const result = await new MusicBusiness().getAllMusics(token, page);

      res.status(200).send(result)
    } catch (err) {
      res.status(err.errorCode || 400).send({ message: err.message })
    }

    await BaseDatabase.destroyConnection();
  }

  public async deleteMusic(req: Request, res: Response) {
    try {
      const token: string = req.headers.authorization as string || req.headers.Authorization as string;
      const id: any = req.params.id;

      await new MusicBusiness().deleteMusic(id, token);
      res.status(200).send({ message: "Successfully deleted" });
    } catch (err) {
      res.status(err.errorCode || 400).send({ message: err.message })
    }

    await BaseDatabase.destroyConnection();
  }


}