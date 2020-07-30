import { UserDatabase } from "../data/UserDatabase";
import { GenericError } from "../Erros/GenericError";
import { InvalidParameterError } from "../Erros/InvalidParameterError";
import { NotFoundError } from "../Erros/NotFoundError";
import { User, UserRole } from "../model/User";
import { HashGenerator } from "../service/hashGenerator";
import { TokenGenerator } from "../service/tokenGenerator";

export class UserBusiness {

  public async listenerSignup(
    id: string,
    name: string,
    nickname: string,
    email: string,
    password: string,
    isApproved: boolean,
    role: UserRole
  ): Promise<void> {

    if (password.length < 6) {
      throw new InvalidParameterError("Senha não pode ser menor do que 6 digitos");
    }

    if (role === UserRole.ADM) {
      throw new InvalidParameterError("Você precisa ser um administrador para acessar este recurso.");
    }

    const user: User = new User(id, name, nickname, email, password, isApproved, role);

    await new UserDatabase().listenerSignup(user);
  }

  public async PremiumListenerSignup(
    id: string,
    name: string,
    nickname: string,
    email: string,
    password: string,
    isApproved: boolean,
    role: UserRole
  ): Promise<void> {

    if (password.length < 6) {
      throw new InvalidParameterError("Senha não pode ser menor do que 6 digitos");
    }

    if (role === UserRole.ADM) {
      throw new InvalidParameterError("Você precisa ser um administrador para acessar este recurso.");
    }

    const user: User = new User(id, name, nickname, email, password, isApproved, role);

    await new UserDatabase().PremiumListenerSignup(user);
  }

  public async admSignup(
    id: string,
    name: string,
    nickname: string,
    email: string,
    password: string,
    isApproved: boolean,
    role: UserRole,
    token: string
  ): Promise<void> {

    if (password.length < 6) {
      throw new InvalidParameterError("Senha não pode ser menor do que 6 digitos");
    }

    const userRole: UserRole = new TokenGenerator().verify(token).role;

    if (userRole !== UserRole.ADM) {
      throw new InvalidParameterError("Você precisa ser um administrador para acessar este recurso.");
    }

    const user: User = new User(id, name, nickname, email, password, isApproved, role);

    await new UserDatabase().listenerSignup(user);

  }

  public async bandSignup(
    id: string,
    name: string,
    nickname: string,
    email: string,
    password: string,
    isApproved: boolean,
    role: UserRole,
    descripition: string
  ): Promise<void> {

    if (password.length < 6) {
      throw new InvalidParameterError("Senha não pode conter menos do que 6 digitos");
    }

    const user: User = new User(id, name, nickname, email, password, isApproved, role);

    await new UserDatabase().bandSignup(user, descripition);

  }

  public async login(email, nickname, password): Promise<any> {

    const result = await new UserDatabase().getUserByEmailOrNickname(email, nickname);

    if (!result.is_approved) {
      throw new GenericError("Este usuário está aguardando aprovação ou foi banido.");
    }

    if (result === undefined) {
      throw new InvalidParameterError("Senha ou nome de usuário está errado.");
    }

    const pass = await new HashGenerator().compareHash(password, result.password);
    const token: string = await new TokenGenerator().generate({ id: result.id, role: result.role });
    const userRole: UserRole = new TokenGenerator().verify(token).role;

    if (pass) {
      if (userRole === UserRole.ADM) {
        return { tokenAdm: token };
      } else if (userRole === UserRole.BAND) {
        return { tokenBand: token };
      } else if (userRole === UserRole.FREE_LISTENER) {
        return { tokenFreeListener: token };
      } else if (userRole === UserRole.PREMIUM_LISTENER) {
        return { tokenPremiumListener: token };
      }
    } else {
      throw new InvalidParameterError("Senha ou nome de usuário está errado.")
    }
  }

  public async getAllBands(token: string, page: number): Promise<any> {

    const userRole: UserRole = new TokenGenerator().verify(token).role;

    if (userRole !== "ADMINISTRATOR") {
      throw new InvalidParameterError("Você precisa ser um administrador para acessar este recurso.");
    }

    const bandsPerPage: number = 10;
    let offset: number = bandsPerPage * page;

    return await new UserDatabase().getAllBands(bandsPerPage, offset);
  }

  public async approveBand(bandId: string, isApprove: boolean, token): Promise<void> {
    const result = await new UserDatabase().getBandById(bandId);
    const userRole: UserRole = new TokenGenerator().verify(token).role;

    if (!result) {
      throw new NotFoundError("Banda não encontrada.");
    }

    if (result.is_approved === isApprove) {
      throw new GenericError("Banda já foi aprovada");
    }

    if (userRole !== UserRole.ADM) {
      throw new InvalidParameterError("Você precisa ser um administrador para acessar este recurso.");
    }

    await new UserDatabase().approveBand(bandId, isApprove);
  }

  public async getAllListeners(token: string, page: number): Promise<any> {
    const userRole: UserRole = new TokenGenerator().verify(token).role;

    if (userRole !== "ADMINISTRATOR") {
      throw new InvalidParameterError("Você precisa ser um administrador para acessar este recurso.");
    }

    const listenerPerPage: number = 10;
    let offset: number = listenerPerPage * page;

    return await new UserDatabase().getAllListeners(listenerPerPage, offset)
  }

  public async getIdUser(token: string): Promise<any> {
    const idUser: string = await new TokenGenerator().verify(token).id;

    return idUser;
  }

  public async editUserName(token: string, name: string): Promise<void> {

    const userData = await new TokenGenerator().verify(token);

    if (!userData) {
      throw new GenericError("Você precisa fazer login para acessar este recurso.");
    }

    await new UserDatabase().editUserName(userData.id, name);

  }

  public async promoteListener(token: string, idListener: string): Promise<void> {
    const userRole: UserRole = new TokenGenerator().verify(token).role;

    if (userRole !== UserRole.ADM) {
      throw new InvalidParameterError("Você precisa ser um administrador para acessar este recurso.");
    }

    await new UserDatabase().promoteListener(idListener);
  }

  public async approveListener(token: string, listenerId: string, isApprove: boolean): Promise<void> {
    const userRole: UserRole = new TokenGenerator().verify(token).role;

    if (userRole !== UserRole.ADM) {
      throw new InvalidParameterError("Você precisa ser um administrador para acessar este recurso.");
    }

    await new UserDatabase().approveListener(listenerId, isApprove);
  }
}