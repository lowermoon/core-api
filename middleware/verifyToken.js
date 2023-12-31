const jwt = require("jsonwebtoken");
// Tables
const freelancerTable = require("../models/tables/freelancerTable");
const usersTable = require("../models/tables/usersTable");
const projectsTable = require("../models/tables/projectsTable");

exports.verificationToken = async (req, res) => {
  const cookie = await req.headers.cookie;
  if (!cookie || !cookie.includes("verifyToken")) {
    return res.status(401).json({
      status: "failed",
      message: "there is no cookie provided!",
    });
  }
  const verifyToken = cookie
    .split("; ")
    .find((row) => row.startsWith("verifyToken="))
    .split("=")[1];

  await jwt.verify(
    verifyToken,
    process.env.ACCESS_TOKEN_SECRET,
    async (err, decoded) => {
      if (err) {
        return res.status(500).json({
          status: "failed",
          message: "invalid token!",
        });
      }
      const username = decoded.username;
      const userConsumer = await usersTable.findOne({ where: { username } });
      const userFreelancer = await freelancerTable.findOne({
        where: { username },
      });
      const project = await projectsTable.findAll({
        attributes: [
          "user_id",
          "project_name",
          "project_desc",
          "deadline",
          "project_category",
        ],
      });
      if (userConsumer) {
        res.json({
          status: "success",
          message: "",
          dataUsers: {
            name: userConsumer.fullName,
            username: userConsumer.username,
            email: userConsumer.email,
            role: "consumer",
          },
          dataProject: {
            project,
          },
        });
      }
      if (userFreelancer) {
        res.json({
          status: "success",
          message: "",
          dataUsers: {
            name: userFreelancer.fullName,
            username: userFreelancer.username,
            email: userFreelancer.email,
            role: "freelancer",
          },
          dataProject: {
            project,
          },
        });
      }
    }
  );
};

exports.checkExp = async (req, res) => {
  const cookie = req.headers.cookie;
  if (!cookie || !cookie.includes("verifyToken")) {
    return res.status(400).json({
      status: "fail",
      message: "there is no cookie here!",
    });
  }
  const verifyToken = cookie
    .split("; ")
    .find((row) => row.startsWith("verifyToken="))
    .split("=")[1];
  jwt.verify(
    verifyToken,
    process.env.ACCESS_TOKEN_SECRET,
    async (err, decoded) => {
      if (err) {
        return res.json({
          isValid: false,
        });
      }
      return res.json({
        isValid: true,
      });
    }
  );
};
