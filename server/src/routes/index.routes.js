import {Router} from "express";


//--IMPORTING ROUTES--
import authRoutes from "./auth.routes.js"


//--MOUNTING ROUTES--
const router = Router();

router.use("/auth", authRoutes)


export default router