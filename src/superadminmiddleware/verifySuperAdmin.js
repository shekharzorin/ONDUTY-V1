import jwt from "jsonwebtoken";
import SuperAdmin from "../superadminmodels/SuperAdminAuth.js";

const verifySuperAdmin = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Access token missing",
      });
    }

    const token = authHeader.split(" ")[1];

    // ✅ Verify JWT
    const decoded = jwt.verify(
      token,
      process.env.SUPERADMIN_JWT_SECRET
    );

    // ✅ Check super admin exists in DB
    const superAdmin = await SuperAdmin.findById(decoded.id).select("_id email name");

    if (!superAdmin) {
      return res.status(401).json({
        success: false,
        message: "Super admin not found",
      });
    }

    // ✅ Attach to request
    req.superAdmin = {
      id: superAdmin._id,
      email: superAdmin.email,
      name: superAdmin.name,
    };

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

export default verifySuperAdmin;
