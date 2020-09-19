const UserSchema = require("../model/user.model");
const jwt = require("jsonwebtoken");
const secretKey = require("../config.json").secret || process.env.SECRET;

module.exports = {
  signIn: (req, res) => {
    if ((req.body.username || req.body.email) && req.body.password) {
      var qry = {
        password: req.body.password,
        $or: [
          {
            email: req.body.email,
          },
          {
            username: req.body.username,
          },
        ],
      };

      // call model
      UserSchema.findOne(qry, "-new -password")
        .populate({
          path: "language",
          select: "name",
        })
        .exec((err, user) => {
          if (err) res.status(200).json({ code: 500, message: err });

          //validate user
          if (user !== undefined && user !== null) {
            // jwt token
            var token = jwt.sign(
              {
                email: user.email,
                password: user.password,
              },
              secretKey
            );

            // auth obj
            var authObj = {
              data: user,
              message: "Login Successful",
              code: 200,
              token: token,
            };
            res.status(200).json(authObj);
          } else {
            res
              .status(200)
              .json({ code: 300, property: "user", message: "User not found" });
          }
        });
    }
  },
  signUp: (req, res) => {
    if (req.body) {
      let userData = new UserSchema(req.body);

      userData.save((err, user) => {
        //logic
        if (err) {
          console.log(err.name);
          let count = 0,
            err_c;
          // error logic validations
          switch (err.name) {
            case "ValidationError":
              console.log(err.errors);
              for (field in err.errors) {
                if (count == 0) {
                  switch (err.errors[field].properties.type) {
                    case "invalid":
                      count++;
                      res.status(200).json({
                        code: 401,
                        property: field,
                        message: "Invalid Format",
                      });
                      break;
                    case "unique":
                      count++;
                      res.status(200).json({
                        code: 402,
                        property: field,
                        message: "Already Exists",
                      });
                      break;
                    case "user defined":
                      count++;
                      res.status(200).json({
                        code: 401,
                        property: field,
                        message: "Invalid Format",
                      });
                      break;
                    case "regexp":
                      count++;
                      res.status(200).json({
                        code: 301,
                        property: field,
                        message: "register expired",
                      });
                      break;
                    case "required":
                      count++;
                      res.status(200).json({
                        code: 201,
                        property: field,
                        message: "Required",
                      });
                      break;
                    default:
                      err_c = 500;
                      count++;
                      res.status(200).json({ code: err_c, message: err });
                      break;
                  }
                }
              }
              break;
            default:
              res.status(200).json({ code: 500, message: err });
              break;
          }
        } else {
          res.status(200).json({ data: user, message: "Success", code: 200 });
        }
      });
    } else {
      res.status(200).json({ error_code: 707, message: "values required" });
    }
  },
};
