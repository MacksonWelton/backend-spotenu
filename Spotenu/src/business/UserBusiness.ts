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
      throw new InvalidParameterError("Invalid password");
    }

    if (role === UserRole.ADM) {
      throw new InvalidParameterError("You must be an administrator to access this feature.");
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
      throw new InvalidParameterError("Invalid password");
    }

    if (role === UserRole.ADM) {
      throw new InvalidParameterError("You must be an administrator to access this feature.");
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
      throw new InvalidParameterError("Invalid password");
    }

    const userRole: UserRole = new TokenGenerator().verify(token).role;

    if (userRole !== UserRole.ADM) {
      throw new InvalidParameterError("You must be an administrator to access this feature.");
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
      throw new InvalidParameterError("Invalid password");
    }

    const user: User = new User(id, name, nickname, email, password, isApproved, role);

    await new UserDatabase().bandSignup(user, descripition);

  }

  public async login(email, nickname, password): Promise<any> {

    const result = await new UserDatabase().getUserByEmailOrNickname(email, nickname);

    if (result === undefined) {
      throw new InvalidParameterError("Password or login is wrong.");
    }

    const pass = await new HashGenerator().compareHash(password, result.password);
    const token: string = await new TokenGenerator().generate({ id: result.id, role: result.role });
    const userRole: UserRole = new TokenGenerator().verify(token).role;
    if (pass) {
      if (userRole === UserRole.ADM) {
        const tokenAdm = token;
        return {tokenAdm};
      } else {
        return {token};
      }
    } else {
      throw new InvalidParameterError("Password or login is wrong.")
    }
  }

  public async getAllBands(token: string): Promise<any> {

    const userRole: UserRole = new TokenGenerator().verify(token).role;

    if (userRole !== "ADMINISTRATOR") {
      throw new InvalidParameterError("You must be an administrator to access this feature.");
    }

    return await new UserDatabase().getAllBands();
  }

  public async approveBand(id: string, isApprove: boolean, token): Promise<void> {
    const result = await new UserDatabase().getBandById(id);
    const userRole: UserRole = new TokenGenerator().verify(token).role;

    if (!result) {
      throw new NotFoundError("Band not found.");
    }

    if (result.is_approved === isApprove) {
      throw new GenericError("Band has already been approved");
    }

    if (userRole !== UserRole.ADM) {
      throw new InvalidParameterError("You must be an administrator to access this feature.");
    }

    await new UserDatabase().approveBand(id, isApprove);
  }
}