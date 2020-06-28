import { Request, Response } from 'express';
import { MusicBusiness } from '../business/MusicBusiness';
import { IdGenerator } from '../service/idGenerator';

export class MusicController {
  public async addGenre(req: Request, res: Response) {
    try {
      const token = req.headers.authorization as string || req.headers.Authorization as string;
      const name = req.body.name;

      const id = new IdGenerator().generate();

      await new MusicBusiness().addGenre(id, name, token)

      res.status(200).send({ message: "Registered successfully" })
    } catch (err) {
      res.status(err.errorCode || 400).send({ message: err.message })
    }
  }

  public async getGenreByName(req: Request, res: Response) {
    try {
      const token = req.headers.authorization as string || req.headers.Authorization as string;
      const name = req.query.name as string;

      const result = new MusicBusiness().getGenreByName(name, token);

      res.status(200).send(result)

    } catch (err) {
      res.status(err.errorCode || 400).send({ message: err.message })
    }
  }

  public async createAlbum(req: Request, res: Response) {
    try {
      const token = req.headers.authorization as string || req.headers.Authorization as string;
      const { name, genres } = req.body;

      const id = new IdGenerator().generate();

      await new MusicBusiness().createAlbum(id, name, genres, token);

      res.status(200).send({ message: "Successfully created" })

    } catch (err) {
      res.status(err.errorCode || 400).send({ message: err.message })
    }
  }

  public async addMusic(req: Request, res: Response) {
    try {
      const token = req.headers.authorization as string || req.headers.Authorization as string;
      const name = req.body.name;
      const album = req.body.album;

      const id = new IdGenerator().generate();

      await new MusicBusiness().addMusic(id, name, album, token);

      res.status(200).send({ message: "Successfully add" })
    } catch (err) {
      res.status(err.errorCode || 400).send({ message: err.message })
    }
  }

  public async getAllAlbums(req: Request, res: Response) {
    try {
      const token = req.headers.authorization as string;

      const result = await new MusicBusiness().getAllAlbums(token);

      res.status(200).send(result)
    } catch (err) {
      res.status(err.errorCode || 400).send({ message: err.message })
    }
  }

  public async getAlbumByBand(req: Request, res: Response) {
    try {
      const token = req.headers.authorization as string || req.headers.Authorization as string;
      const idBand = req.query.idBand as string;

      const result = await new MusicBusiness().getAlbumByBand(token, idBand);

      res.status(200).send(result)
    } catch (err) {
      res.status(err.errorCode || 400).send({ message: err.message })
    }
  }

  public async getAllGenres(req: Request, res: Response) {
    try {
      const token: string = req.headers.authorization as string || req.headers.Authorization as string;

      const result = await new MusicBusiness().getAllGenres(token);

      res.status(200).send(result)
    } catch (err) {
      res.status(err.errorCode || 400).send({ message: err.message })
    }
  }

  public async getMusicsByBand(req: Request, res: Response) {
    try {
      const token: string = req.headers.authorization as string || req.headers.Authorization as string;
      const idBand = req.query.idBand as string;

      const result = await new MusicBusiness().getMusicsByBand(token, idBand);

      res.status(200).send(result)
    } catch (err) {
      res.status(err.errorCode || 400).send({ message: err.message })
    }
  }

  public async getMusicsbyAlbum(req: Request, res: Response) {
    try {
      const token = req.headers.authorization as string || req.headers.Authorization as string;
      const idAlbum = req.query.idAlbum as string;

      const result = await new MusicBusiness().getMusicsbyAlbum(token, idAlbum)
      
      res.status(200).send(result)
    } catch (err) {
      res.status(err.errorCode || 400).send({ message: err.message })
    }
  }

  public async getAllMusics(req: Request, res: Response) {
    try {
      const token = req.headers.authorization as string || req.headers.Authorization as string;

      const result = await new MusicBusiness().getAllMusics(token);

      res.status(200).send(result)
    } catch (err) {
      res.status(err.errorCode || 400).send({ message: err.message })
    }
  }

  public async deleteAlbum(req: Request, res: Response) {
    try {
      const token = req.headers.authorization as string || req.headers.Authorization as string;
      const id = req.params.id;

      await new MusicBusiness().deleteAlbum(id, token);
      res.status(200).send("Successfully deleted");
    } catch (err) {
      res.status(err.errorCode || 400).send({ message: err.message })
    }
  }

  public async deleteMusic(req: Request, res: Response) {
    try {
      const token = req.headers.authorization as string || req.headers.Authorization as string;
      const id = req.params.id;

      await new MusicBusiness().deleteMusic(id, token);
      res.status(200).send("Successfully deleted");
    } catch (err) {
      res.status(err.errorCode || 400).send({ message: err.message })
    }
  }

  public async deleteGenre(req: Request, res: Response) {
    try {
      const token = req.headers.authorization as string || req.headers.Authorization as string;
      const id = req.params.id;

      await new MusicBusiness().deleteGenre(id, token);
      res.status(200).send("Successfully deleted");
    } catch (err) {
      res.status(err.errorCode || 400).send({ message: err.message })
    }
  }
}