import express from "express";
import { UserController } from "../controller/UserController";
//linha responsável por criar um módulo de rotas no express
export const userRouter = express.Router();

userRouter.post("/listener-signup", new UserController().listenerSignup);
userRouter.post("/adminsignup", new UserController().adminSignup);
userRouter.post("/bandsingup", new UserController().bandSignup);
userRouter.get("/allbands", new UserController().getAllBands);
userRouter.put("/approveband", new UserController().approveBand);
userRouter.post("/login", new UserController().login);