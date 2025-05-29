import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { addCombo, listCombos, removeCombo, updateCombo, updatelistcombos } from "../controllers/CombosController.js";


const combosRouter = express.Router();


const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
};


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let folder = "uploads/";
    if (file.fieldname === "thumbImg") folder += "thumbImg/";
    if (file.fieldname === "galleryImg") folder += "galleryImg/";
    ensureDir(folder);
    cb(null, folder);
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + file.originalname.replace(/\s+/g, '_');
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

combosRouter.post(
  "/add",
  upload.fields([
    { name: "thumbImg", maxCount: 1 },
    { name: "galleryImg", maxCount: 5 },
  ]),

  addCombo
);

combosRouter.get("/list", listCombos);
combosRouter.get("/:id",updatelistcombos);
combosRouter.delete("/remove/:id", removeCombo);

combosRouter.put(
  "/update/:id",
  upload.fields([
    { name: "thumbImg", maxCount: 1 },
    { name: "galleryImg", maxCount: 5 },
  ]),
  updateCombo
);

export default combosRouter;
