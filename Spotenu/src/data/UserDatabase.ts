import { BaseDatabase } from "./BaseDatabase";
import { User, UserRole } from "../model/User";

export class UserDatabase extends BaseDatabase {
  private static TABLENAME: string = "spotenu";

  public async listenerSignup(user: User): Promise<void> {
    const isApproved = super.convertBooleanToTinyInt(user.getIsApproved());
    await super.getConnection().raw(`
      INSERT INTO ${UserDatabase.TABLENAME} (id, name, nickname, email, password, is_approved, role)
      VALUES(
        "${user.getId()}",
        "${user.getName()}",
        "${user.getNickname()}",
        "${user.getEmail()}",
        "${user.getPassword()}",
        "${isApproved}",
        "${user.getRole()}"
          )
    `)
  }

  public async admSignup(user: User): Promise<void> {
    const isApproved = super.convertBooleanToTinyInt(user.getIsApproved());
    await super.getConnection().raw(`
      INSERT INTO ${UserDatabase.TABLENAME} (id, name, nickname, email, password, is_approved, role)
      VALUES(
        "${user.getId()}",
        "${user.getName()}",
        "${user.getNickname()}",
        "${user.getEmail()}",
        "${user.getPassword()}",
        "${isApproved}",
        "${user.getRole()}"
          )
    `)
  }

  public async bandSignup(user: User, description: string): Promise<void> {
    const isApproved = super.convertBooleanToTinyInt(user.getIsApproved());
    await super.getConnection().raw(`
      INSERT INTO ${UserDatabase.TABLENAME} (id, name, nickname, email, password, role)
      VALUES(
        "${user.getId()}",
        "${user.getName()}",
        "${user.getNickname()}",
        "${user.getEmail()}",
        "${user.getPassword()}",
        "${user.getRole()}"
          )
    `)

    await super.getConnection().raw(`
        INSERT INTO spotenu_band_description (id, description)
        VALUES(
          "${user.getId()}",
          "${description}"
        )
    `)
  }

  public async getUserByEmailOrNickname(email: string, nickname: string): Promise<any> {
    const result = await super.getConnection().raw(`
    SELECT * FROM ${UserDatabase.TABLENAME}
    WHERE email = "${email}" OR nickname = "${nickname}"
    `)

    return result[0][0];
  }

  public async getAllBands(): Promise<any> {
    const result = await super.getConnection().raw(`
    SELECT name, email, nickname, is_approved FROM ${UserDatabase.TABLENAME}
    WHERE role = "${UserRole.BAND}"
    `)
    return result[0];
  }

  public async getBandById(id: string): Promise<any> {
    const result = await super.getConnection().raw(`
    SELECT * FROM ${UserDatabase.TABLENAME}
    WHERE id = "${id}" AND role = "${UserRole.BAND}"
    `)
    return result[0][0];
  }

  public async approveBand(id, isApprove): Promise<void> {
    isApprove = super.convertBooleanToTinyInt(isApprove);
    await super.getConnection().raw(`
    UPDATE ${UserDatabase.TABLENAME}
    SET is_approved = "${isApprove}"
    WHERE id = "${id}"
    `)
  }
}