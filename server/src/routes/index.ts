import  express from "express";
import authRoutes from "./authRoutes";
import vehicleRoutes from "./vehicleRoutes";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/vehicles",vehicleRoutes );

export default router;