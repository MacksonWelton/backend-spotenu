import { Request, Response } from 'express';
import { PlaylistBusiness } from '../business/PlaylistBusiness';
import { IdGenerator } from '../service/idGenerator';
import { BaseDatabase } from '../data/BaseDatabase';

export class PlaylistController {
  public async createPlaylist(req: Request, res: Response) {
    try {
      const token: string = req.headers.authorization as string || req.headers.Authorization as string;
      const name: string = req.body.name as string;

      const id: string = new IdGenerator().generate();

      await new PlaylistBusiness().createPlaylist(id, token, name);

    } catch (err) {
      res.status(err.errorCode || 400).send({ message: err.message })
    }

    await BaseDatabase.destroyConnection();
  }

  public async addMusicToPlaylist(req: Request, res: Response) {
    try {
      const token: string = req.headers.authorization as string || req.headers.Authorization as string;
      const { idPlaylist, idMusics } = req.body;

      await new PlaylistBusiness().addMusicToPlaylist(token, idPlaylist, idMusics);

      res.status(200).send({ message: "Successfully Added" })
    } catch (err) {
      res.status(err.errorCode || 400).send({ message: err.message })
    }

    await BaseDatabase.destroyConnection();
  }

  public async getPlaylistsByUser(req: Request, res: Response) {
    try {
      const token: string = req.headers.authorization as string || req.headers.Authorization as string;
      const page: number = Number(req.query.page) >= 0 ? Number(req.query.page) : 0;

      const result = await new PlaylistBusiness().getPlaylistsByUser(token, page);

      res.status(200).send(result)
    } catch (err) {
      res.status(err.errorCode || 400).send({ message: err.message })
    }

    await BaseDatabase.destroyConnection();
  }

  public async getAllPlaylists(req: Request, res: Response) {
    try {
      const token: string = req.headers.authorization as string || req.headers.Authorization as string;
      const page: number = Number(req.query.page) >= 0 ? Number(req.query.page) : 0;

      const result = await new PlaylistBusiness().getAllPlaylists(token, page);

      res.status(200).send(result)
    } catch (err) {
      res.status(err.errorCode || 400).send({ message: err.message })
    }

    await BaseDatabase.destroyConnection();
  }
}