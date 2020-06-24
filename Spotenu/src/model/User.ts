import { InvalidParameterError } from "../Erros/InvalidParameterError";

export class User {
  constructor(
    private id: string,
    private name: string,
    private nickname: string,
    private email: string,
    private password: string,
    private isApproved: boolean,
    private role: UserRole
    ) {}

    public getId(): string {
      return this.id;
    }
  
    public getName(): string {
      return this.name;
    }

    public getNickname(): string {
      return this.nickname;
    }
  
    public getEmail(): string {
      return this.email;
    }
  
    public getPassword(): string {
      return this.password;
    }

    public getIsApproved(): boolean {
      return this.isApproved;
    }
  
    public getRole(): UserRole {
      return this.role;
    }
}

export enum UserRole {
  BAND = "BAND",
  PAYINGLISTENER = "PAYING LISTENER",
  NONPAYINGLISTENER = "NON PAYING LISTENER",
  ADM = "ADMINISTRATOR"
}

export const stringToUserRole = (input: string): UserRole => {
  switch (input) {
    case "BAND":
      return UserRole.BAND;
    case "PAYING LISTENER":
      return UserRole.PAYINGLISTENER;
    case "NON PAYING LISTENER":
      return UserRole.NONPAYINGLISTENER;
    case "ADMINISTRATOR":
      return UserRole.ADM;
    default:
      throw new InvalidParameterError("Invalid user role");
  }
};