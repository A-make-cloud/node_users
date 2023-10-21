import express from "express";
import UserService from "../services/users.service";
import { body, validationResult, param, query } from "express-validator";
import multer from "multer";
import path from "path";
let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "temp/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });
// const upload = multer({ dest: "temp/" });
const router = express.Router();

//http://localhost:3000/users/list
router.get("/list", (req, res) => {
  let list = UserService.listUser();
  if (req.useRender) {
    return res.render("users/list", { list });
  }
  res.json(list);
});

router
  .route("/create")
  .post(
    upload.single("avatar"),
    body("email")
      .isEmail()
      .custom((value) => {
        let isAlreadyIn = UserService.findUserByEmail(value);
        if (isAlreadyIn) {
          return Promise.reject("L'email existe déjà");
        }
        return Promise.resolve();
      }),

    body(["nom", "prenom"]).isLength({ min: 2 }),
    (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        if (req.useRender) {
          return res.render("users/create-edit", { errors: errors.array() });
        }
        return res.status(400).json({ errors: errors.array() });
      }
      //gestion erreurs validation
      const { nom, prenom, email } = req.body;
      console.log(req.file);
      const avatar = req.file?.filename;
      try {
        let users = UserService.create({ nom, prenom, email, avatar });

        if (req.useRender) {
          req.flash("message", `L'utilisateur ${email} a été créé`);
          return res.redirect("/app/list");
        }
        res.json(users);
      } catch (err) {
        res.status(err.status).json({
          message: err.message,
          code: err.code,
        });
      }
      //req.body / req.params / req.query
    }
  )
  .get((req, res) => {
    return res.render("users/create-edit");
  });

router.get("/find/:id", param("id").isInt(), (req, res) => {
  const { id } = req.params;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    let user = UserService.find(id);
    res.json(user);
  } catch (err) {
    res.status(err.status).json({
      message: err.message,
      code: err.code,
    });
  }
});

router
  .route("/delete")
  .delete(body("id", "Il faut un id").isInt(), (req, res) => {
    const { id } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      let users = UserService.delete(id);
      if (req.useRender) {
        req.flash("message", "L'utilisateur a été supprimé")
        return res.redirect("/app/list");
      }
      res.json(users);
    } catch (err) {
      res.status(err.status).json({
        message: err.message,
        code: err.code,
      });
    }
  })
  .get(query("id", "Il faut un id").isInt(), (req, res) => {
    const { id } = req.query;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      //penser à rendre les erreurs au niveau du front
      return res.render("errors/404");
    }

    if (id) {
      return res.render("users/delete", { id });
    }
  });

router
  .route("/edit/:id")
  .patch(
    upload.single("avatar"),
    param("id").isInt(),
    body("email").isEmail(),
    body(["nom", "prenom"]).isAlpha().isLength({ min: 2 }),
    (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const { id } = req.params;
      const { nom, prenom, email } = req.body;

      const avatar = req.file?.filename;
      try {
        const users = UserService.edit({ id, nom, prenom, email, avatar });
        if (req.useRender) {
          return res.redirect("/app/list");
        }
        res.json(users);
      } catch (err) {
        res.status(err.status).send(err.message);
      }
    }
  )
  .get(param("id").isInt(), (req, res) => {
    try {
      const { id } = req.params;
      const user = UserService.find(id);
      if (user) {
        res.render("users/create-edit", { ...user });
      } else {
        res.render("errors/404");
      }
    } catch (error) {
      res.status(err.status).json({
        message: err.message,
        code: err.code,
      });
    }
  });

export default router;
