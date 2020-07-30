import express from "express";
import { UserController } from "../controller/UserController";
//linha responsável por criar um módulo de rotas no express
export const userRouter = express.Router();

userRouter.post("/listener-signup", new UserController().listenerSignup);
userRouter.post("/premium-listener-signup", new UserController().PremiumListenerSignup);
userRouter.post("/admin-signup", new UserController().adminSignup);
userRouter.post("/band-singup", new UserController().bandSignup);
userRouter.get("/all-bands", new UserController().getAllBands);
userRouter.put("/approve-band", new UserController().approveBand);
userRouter.post("/login", new UserController().login);
userRouter.get("/all-listener", new UserController().getAllListeners);
userRouter.put("/promote-listener", new UserController().promoteListener);
userRouter.put("/approve-listener", new UserController().approveListener);
userRouter.get("/id-user", new UserController().getIdUser);
userRouter.put("/edit-user-name", new UserController().editUserName);