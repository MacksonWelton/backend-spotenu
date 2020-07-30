import { Request, Response } from 'express';
import { UserBusiness } from '../business/UserBusiness';
import { stringToUserRole, UserRole } from '../model/User';
import { HashGenerator } from '../service/hashGenerator';
import { IdGenerator } from '../service/idGenerator';
import { TokenGenerator } from '../service/tokenGenerator';

export class UserController {

  public async listenerSignup(req: Request, res: Response) {
    try {
      let { name, nickname, email, password } = req.body;
      const id: string = await new IdGenerator().generate();
      const role: UserRole = UserRole.FREE_LISTENER;
      const result: string = await new TokenGenerator().generate({ id, role });
      password = await new HashGenerator().hash(password);

      const isApproved: boolean = true;

      await new UserBusiness().listenerSignup(id, name, nickname, email, password, isApproved, role);

      res.status(200).send(result)
    } catch (err) {
      res.status(err.errorCode || 400).send({ message: err.message });
    }
  }

  public async PremiumListenerSignup(req: Request, res: Response) {
    try {
      let { name, nickname, email, password } = req.body;
      const id: string = await new IdGenerator().generate();
      const role: UserRole = UserRole.PREMIUM_LISTENER;
      const result: string = await new TokenGenerator().generate({ id, role });
      password = await new HashGenerator().hash(password);

      const isApproved: boolean = true;

      await new UserBusiness().PremiumListenerSignup(id, name, nickname, email, password, isApproved, role);

      res.status(200).send(result)
    } catch (err) {
      res.status(err.errorCode || 400).send({ message: err.message });
    }
  }

  public async adminSignup(req: Request, res: Response) {
    try {
      let tokenBody: string = req.headers.authorization as string || req.headers.Authorization as string;
      let { name, nickname, email, password, role } = req.body;
      const id = await new IdGenerator().generate();
      const token = await new TokenGenerator().generate({ id, role });
      password = await new HashGenerator().hash(password);

      const isApproved: boolean = true;
      const userRole: UserRole = stringToUserRole(role);

      await new UserBusiness().admSignup(id, name, nickname, email, password, isApproved, userRole, tokenBody);

      res.status(200).send({ token });
    } catch (err) {
      res.status(err.errorCode || 400).send({ message: err.message });
    }
  }

  public async bandSignup(req: Request, res: Response) {
    try {
      let { name, nickname, email, description, password } = req.body;
      const id: string = await new IdGenerator().generate();
      password = await new HashGenerator().hash(password);
      const role: UserRole = UserRole.BAND;
      const isApproved: boolean = false;

      await new UserBusiness().bandSignup(id, name, nickname, email, password, isApproved, role, description)

      const token = await new TokenGenerator().generate({ id, role });

      res.status(200).send({ token });
    } catch (err) {
      res.status(err.errorCode || 400).send({ message: err.message });
    }

  }

  public async login(req: Request, res: Response) {
    try {
      const { email, nickname, password } = req.body;
      const result = await new UserBusiness().login(email, nickname, password);
      const {tokenAdm, tokenBand, tokenFreeListener, tokenPremiumListener} = result;

      res.status(200).send({ tokenAdm, tokenBand, tokenFreeListener, tokenPremiumListener });

    } catch (err) {
      res.status(err.errorCode || 400).send({ message: err.message });
    }
  }

  public async getAllBands(req: Request, res: Response) {
    try {
      const token: string = req.headers.authorization as string || req.headers.Authorization as string;
      const page: number = Number(req.query.page) >= 0 ? Number(req.query.page) : 0;

      const result: string = await new UserBusiness().getAllBands(token, page);

      res.status(200).send(result)
    } catch (err) {
      res.status(err.errorCode || 400).send({ message: err.message });
    }
  }

  public async approveBand(req: Request, res: Response) {
    try {
      const token: string = req.headers.authorization as string || req.headers.Authorization as string;
      const { bandId, isApprove } = req.body;

      await new UserBusiness().approveBand(bandId, isApprove, token);
      res.status(200).send(isApprove ? "Banda aprovada com sucesso." : "Banda reprovada com sucesso.");
    } catch (err) {
      res.status(err.errorCode || 400).send({ message: err.message });
    }
  }

  public async getAllListeners(req: Request, res: Response) {
    try {
      const token: string = req.headers.authorization as string || req.headers.Authorization as string;
      const page: number = Number(req.query.page) >= 0 ? Number(req.query.page) : 0;

      const result = await new UserBusiness().getAllListeners(token, page);
      res.status(200).send(result)
    } catch (err) {
      res.status(err.errorCode || 400).send({ message: err.message});
    }
  }

  public getIdUser(req: Request, res: Response) {
    try {
      const token: string = req.headers.authorization as string || req.headers.Authorization as string;

      const result = new UserBusiness().getIdUser(token);

      res.status(200).send(result)
    } catch (err) {
      res.status(err.errorCode || 400).send({ message: err.message });
    }
  }

  public async editUserName(req: Request, res: Response) {
    try {
      const token: string = req.headers.authorization as string || req.headers.Authorization as string;
      const name: string = req.body.name;

      await new UserBusiness().editUserName(token, name);

      res.status(200).send("Successfully edited")
    } catch (err) {
      res.status(err.errorCode || 400).send({ message: err.message });
    }
  }

  public async promoteListener(req: Request, res: Response) {
    try {
      const token: string = req.headers.authorization as string || req.headers.Authorization as string;
      const idListener = req.body.idListener;

      await new UserBusiness().promoteListener(token, idListener);

      res.status(200).send("Ouvinte foi promovido a premium com sucesso.");
    } catch (err) {
      res.status(err.errorCode || 400).send({ message: err.message });
    }
  }

  public async approveListener(req: Request, res: Response) {
    try {
      const token: string = req.headers.authorization as string || req.headers.Authorization as string;
      const {listenerId, isApprove} = req.body; 

      await new UserBusiness().approveListener(token, listenerId, isApprove
        );

      res.status(200).send(isApprove ? "Ouvinte aprovado com sucesso." : "Ouvinte reprovado com sucesso.");
    } catch (err) {
      res.status(err.errorCode || 400).send({ message: err.message });
    }
  }
}