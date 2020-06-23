import {Request, Response } from 'express';
import { InvalidParameterError } from '../Erros/InvalidParameterError';
import { UserBusiness } from '../business/UserBusiness';
import { HashGenerator } from '../service/hashGenerator';
import { IdGenerator } from '../service/idGenerator';
import { TokenGenerator } from '../service/tokenGenerator';
import { UserRole, stringToUserRole, User } from '../model/User';

export class UserController {

  public async userSignup(req: Request, res: Response) {
    try {
      let { name, nickname, email, password, role} = req.body;
      const id: string = await new IdGenerator().generate();
      const result: string = await new TokenGenerator().generate({id, role});
      password = await new HashGenerator().hash(password);

      const isApproved: boolean = true;
      const userRole: UserRole = stringToUserRole(role); 

      await new UserBusiness().userSignup(id, name, nickname, email, password, isApproved, userRole);

      res.status(200).send(result)
    } catch(err) {
      res.status(err.errorCode || 400).send({ message: err.message})
    }
  }

  public async adminSignup(req: Request, res: Response) {
    try {
      const tokenBody = req.headers.authorization as string;
      let { name, nickname, email, password, role} = req.body;
      const id = await new IdGenerator().generate();
      const token = await new TokenGenerator().generate({id, role});
      password = await new HashGenerator().hash(password);

      const isApproved: boolean = true;
      const userRole: UserRole = stringToUserRole(role); 

      await new UserBusiness().admSignup(id, name, nickname, email, password, isApproved, userRole, tokenBody);

      res.status(200).send({token})
    } catch(err) {
      res.status(err.errorCode || 400).send({message: err.message})
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

      const token = await new TokenGenerator().generate({id, role});

      res.status(200).send({token})
    } catch(err) {
      res.status(err.errorCode || 400).send({message: err.message})
    }

  }

  public async login(req: Request, res: Response) {
    try {
      const {email, nickname, password} = req.body;
      const {id, role} = await new UserBusiness().login(email, nickname, password);

      const token: string = await new TokenGenerator().generate({id, role})

      res.status(200).send({token})
    } catch(err) {
      res.status(err.errorCode || 400).send({message: err.message})
    }
  }

  public async getAllBands(req: Request, res: Response) {
    try {
      const token: string = req.headers.authorization as string;

      const result: string = await new UserBusiness().getAllBands(token);

      res.status(200).send(result)
    } catch(err) {
      res.status(err.errorCode || 400).send({message: err.message})
    }
  }

  public async approveBand(req: Request, res: Response) {
    try {
      const token = req.headers.authorization as string;
      const {id, isApprove} = req.body;

      await new UserBusiness().approveBand(id, isApprove, token);
      res.status(200).send({message: "Band successfully approved"})
    } catch(err) {
      res.status(err.errorCode || 400).send({message: err.message})
    }
  }
}