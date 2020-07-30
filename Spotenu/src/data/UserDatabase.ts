import { User, UserRole } from "../model/User";
import { BaseDatabase } from "./BaseDatabase";

export class UserDatabase extends BaseDatabase {
  private static TABLE_USERS: string = "spotenu_users";
  private static TABLE_BANNED_USERS: string = "spotenu_banned_users";

  public async listenerSignup(user: User): Promise<void> {
    const isApproved = super.convertBooleanToTinyInt(user.getIsApproved());
    await super.getConnection().raw(`
      INSERT INTO ${UserDatabase.TABLE_USERS} (id, name, nickname, email, password, is_approved, role)
      VALUES(
        "${user.getId()}",
        "${user.getName()}",
        "${user.getNickname()}",
        "${user.getEmail()}",
        "${user.getPassword()}",
        "${isApproved}",
        "${user.getRole()}"
          )
    `);
  }

  public async PremiumListenerSignup(user: User): Promise<void> {
    const isApproved = super.convertBooleanToTinyInt(user.getIsApproved());
    await super.getConnection().raw(`
      INSERT INTO ${UserDatabase.TABLE_USERS} (id, name, nickname, email, password, is_approved, role)
      VALUES(
        "${user.getId()}",
        "${user.getName()}",
        "${user.getNickname()}",
        "${user.getEmail()}",
        "${user.getPassword()}",
        "${isApproved}",
        "${user.getRole()}"
          )
    `);
  }

  public async admSignup(user: User): Promise<void> {
    const isApproved = super.convertBooleanToTinyInt(user.getIsApproved());
    await super.getConnection().raw(`
      INSERT INTO ${UserDatabase.TABLE_USERS} (id, name, nickname, email, password, is_approved, role)
      VALUES(
        "${user.getId()}",
        "${user.getName()}",
        "${user.getNickname()}",
        "${user.getEmail()}",
        "${user.getPassword()}",
        "${isApproved}",
        "${user.getRole()}"
          )
    `);
  }

  public async bandSignup(user: User, description: string): Promise<void> {
    await super.getConnection().raw(`
      INSERT INTO ${UserDatabase.TABLE_USERS} (id, name, nickname, email, password, role)
      VALUES(
        "${user.getId()}",
        "${user.getName()}",
        "${user.getNickname()}",
        "${user.getEmail()}",
        "${user.getPassword()}",
        "${user.getRole()}"
          )
    `);

    await super.getConnection().raw(`
        INSERT INTO spotenu_band_description (id, description)
        VALUES(
          "${user.getId()}",
          "${description}"
        )
    `);
  }

  public async getUserByEmailOrNickname(email: string, nickname: string): Promise<any> {
    const result = await super.getConnection().raw(`
      SELECT * FROM ${UserDatabase.TABLE_USERS}
      WHERE email = "${email}" OR nickname = "${nickname}"
    `);

    return result[0][0];
  }

  public async getAllBands(albumsPerPage: number, offset: number): Promise<any> {
    const result = await super.getConnection().raw(`
      SELECT SQL_CALC_FOUND_ROWS * FROM ${UserDatabase.TABLE_USERS}
      JOIN spotenu_band_description
      ON spotenu_users.id = spotenu_band_description.id
      LIMIT ${albumsPerPage} OFFSET ${offset}
    `);

    const numberOfRows = await super.getConnection().raw(`
      SELECT FOUND_ROWS() as numberOfRows;
    `);

    return {numberOfRows: numberOfRows[0][0].numberOfRows, bands: result[0]};
  }

  public async getBandById(id: string): Promise<any> {
    const result = await super.getConnection().raw(`
      SELECT * FROM ${UserDatabase.TABLE_USERS}
      WHERE id = "${id}" AND role = "${UserRole.BAND}"
    `);

    return result[0][0];
  }

  public async approveBand(bandId: string, isApprove: boolean): Promise<void> {
    const isApproveTinyInt = super.convertBooleanToTinyInt(isApprove);
    await super.getConnection().raw(`
      UPDATE ${UserDatabase.TABLE_USERS}
      SET is_approved = "${isApproveTinyInt}"
      WHERE id = "${bandId}"
    `);
  }

  public async getAllListeners(ListernersPerPage: number, offset: number): Promise<any> {
    const result = await super.getConnection().raw(`
      SELECT SQL_CALC_FOUND_ROWS * FROM ${UserDatabase.TABLE_USERS}
      WHERE role = "${UserRole.FREE_LISTENER}" or role = "${UserRole.PREMIUM_LISTENER}"
      LIMIT ${ListernersPerPage} OFFSET ${offset}
    `);

    const numberOfRows = await super.getConnection().raw(`
      SELECT FOUND_ROWS() as numberOfRows;
  `);

  return {numberOfRows: numberOfRows[0][0].numberOfRows, listeners: result[0]};
  }

  public async editUserName(name: string, userId: string): Promise<void> {
    await super.getConnection().raw(`
      UPDATE ${UserDatabase.TABLE_USERS}
      SET name = "${name}"
      WHERE id = "${userId}"
    `)
  }

  public async promoteListener(listenerId): Promise<void> {
    await super.getConnection().raw(`
      UPDATE ${UserDatabase.TABLE_USERS}
      SET role = "${UserRole.PREMIUM_LISTENER}"
      WHERE id = "${listenerId}"
    `);
  }

  public async approveListener(listenerId: string, isApprove: boolean): Promise<void> {
    const isApproveTinyInt = super.convertBooleanToTinyInt(isApprove); 
    await super.getConnection().raw(`
      UPDATE ${UserDatabase.TABLE_USERS}
      SET is_approved = "${isApproveTinyInt}"
      WHERE id = "${listenerId}"
    `);
  }
}