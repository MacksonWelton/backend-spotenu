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
      res.status(err.errorCode || 400).send({ message: err.message });
    }
  }

  public async addMusicToPlaylist(req: Request, res: Response) {
    try {
      const token: string = req.headers.authorization as string || req.headers.Authorization as string;
      const { idPlaylist, idMusics } = req.body;

      await new PlaylistBusiness().addMusicToPlaylist(token, idPlaylist, idMusics);

      res.status(200).send("Adicionado com sucesso.");
    } catch (err) {
      res.status(err.errorCode || 400).send({ message: err.message });
    }
  }

  public async getPlaylistsByUser(req: Request, res: Response) {
    try {
      const token: string = req.headers.authorization as string || req.headers.Authorization as string;
      const page: number = Number(req.query.page) >= 0 ? Number(req.query.page) : 0;

      const result = await new PlaylistBusiness().getPlaylistsByUser(token, page);

      res.status(200).send(result);
    } catch (err) {
      res.status(err.errorCode || 400).send({ message: err.message });
    }
  }

  public async getAllPlaylists(req: Request, res: Response) {
    try {
      const token: string = req.headers.authorization as string || req.headers.Authorization as string;
      const page: number = Number(req.query.page) >= 0 ? Number(req.query.page) : 0;

      const result = await new PlaylistBusiness().getAllPlaylists(token, page);

      res.status(200).send(result);
    } catch (err) {
      res.status(err.errorCode || 400).send({ message: err.message });
    }
  }

  public async getMusicsByPlaylist(req: Request, res: Response) {
    try {
      const token: string = req.headers.authorization as string || req.headers.Authorization as string;
      const idPlaylist: string = req.query.idPlaylist as string;
      const page: number = Number(req.query.page) >= 0 ? Number(req.query.page) : 0;
      
      const result = await new PlaylistBusiness().getMusicsByPlaylist(token, idPlaylist, page);
      res.status(200).send(result);
    } catch (err) {
      res.status(err.errorCode || 400).send({ message: err.message });
    }
  }

  public async editPlaylistName(req: Request, res: Response) {
    try {
      const token: string = req.headers.authorization as string || req.headers.Authorization as string;
      const {idPlaylist, playlistName} = req.body;

      await new PlaylistBusiness().editPlaylistName(token, idPlaylist, playlistName);

      res.status(200).send("Nome da playlist editada com sucesso.");
    } catch (err) {
      res.status(err.errorCode || 400).send({ message: err.message });
    }
  }

  public async makePlaylistCollaborative(req: Request, res: Response) {
    try {
      const token: string = req.headers.authorization as string || req.headers.Authorization as string;
      const { idPlaylist, idOwner, isPrivate } = req.body;
      
      await new PlaylistBusiness().makePlaylistCollaborative(token, idPlaylist, idOwner, isPrivate);
      res.status(200).send("Playlist tornada colaborativa com sucesso.");
    } catch (err) {
      res.status(err.errorCode || 400).send({ message: err.message });
    }
  }

  public async getCollaborativePlaylists(req: Request, res: Response) {
    try {
      const token: string = req.headers.authorization as string || req.headers.Authorization as string;
      const page: number = Number(req.query.page) >= 0 ? Number(req.query.page) : 0;

      const result = await new PlaylistBusiness().getCollaborativePlaylists(token, page);

      res.status(200).send(result);
    } catch (err) {
      res.status(err.errorCode || 400).send({ message: err.message });
    }
  }

  public async followCollaborativePlaylist(req: Request, res: Response) {
    try {
      const token: string = req.headers.authorization as string || req.headers.Authorization as string;
      const idPlaylist: string = req.body.idPlaylist as string;

      await new PlaylistBusiness().followCollaborativePlaylist(token, idPlaylist);
      res.status(200).send("Seguindo playlist com sucesso.");
    } catch (err) {
      res.status(err.errorCode || 400).send({ message: err.message });
    }
  }

  public async deleteMusicFromPlaylist(req: Request, res: Response) {
    try {
      const token: string = req.headers.authorization as string || req.headers.Authorization as string;
      const {idPlaylist, idMusics} = req.params;

      await new PlaylistBusiness().deleteMusicFromPlaylist(token, idPlaylist, idMusics);

      res.status(200).send("Playlist deletada com sucesso.");
    } catch (err) {
      res.status(err.errorCode || 400).send({ message: err.message });
    }
  }
}