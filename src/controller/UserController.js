const prisma = require("../config/prisma");
const bcrypt = require("bcrypt");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../../utils/jwt");
const { use } = require("passport");
const payload = require("../../utils/payload");
const createUser = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
      data: { name, email, password: hashedPassword, role },
    });

    const { password: _, ...userWithoutPassword } = newUser;
    res.status(201).json({
      status: "success",
      message: "User created successfully",
      data: userWithoutPassword,
    });
  } catch (error) {
    console.log(error.message);
    next(error);
  }
};

const getAllUser = async (req, res, next) => {
  try {
    const users = await prisma.user.findMany({});
    res.status(200).json({
      status: "success",
      message: "get all users successfully",
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

const getOneUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      res.code = 404;
      throw new Error("User not found");
    }

    res.status(200).json({ status: "success", data: user });
  } catch (error) {
    next(error);
  }
};

//update
const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      res.code = 404;
      throw new Error("User not found!");
    }
    let hashedPassword;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    const update = await prisma.user.update({
      where: { id: user.id },
      data: { name, email, password: hashedPassword || user.password },
    });

    res.status(200).json({
      status: "success",
      message: "update user successfully",
      data: update,
    });
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      res.code = 404;
      throw new Error("User not found!");
    }
    await prisma.user.delete({ where: { id: user.id } });
    res.status(200).json({
      status: "success",
      message: true,
    });
  } catch (error) {
    next(error);
  }
};

//login
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findFirst({ where: { email } });
    if (!user) {
      res.code = 400;
      throw new Error("Invalid Credentials");
    }
    const comparePass = await bcrypt.compare(password, user.password);
    if (!comparePass) {
      res.code = 400;
      throw new Error("Invalid Credentials");
    }

    //create token and store in database
    const token = await generateAccessToken(payload(user));
    const refreshToken = await generateRefreshToken(payload(user));

    //set cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true, //xss
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: "strict", //csrf
    });

    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken },
    });

    res.status(200).json({
      status: "success",
      message: "login successfully",
      data: { token },
    });
  } catch (error) {
    next(error);
  }
};
//current user
const currentUser = async (req, res, next) => {
  try {
    const user = req.user;

    res
      .status(200)
      .json({ message: "success ambil data current user", data: user });
  } catch (error) {
    next(error);
  }
};
//remove all users
const _removeAllUsers = async (req, res, next) => {
  await prisma.user.deleteMany();
  //   await prisma.$executeRaw`TRUNCATE TABLE users`;
};

const refreshToken = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) throw new Error("No token");
    const payload = jwt.verify(
      refreshToken,
      process.env.JWT_SECRET_REFRESH_TOKEN
    );
    const user = await prisma.user.findFirst({ where: { id: payload.id } });
    if (!user || user.refreshToken !== refreshToken)
      throw new Error("Invalid refresh token");

    const newAccessToken = generateAccessToken(payload(user));

    res.status(200).json({ token: newAccessToken });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createUser,
  _removeAllUsers,
  getOneUser,
  getAllUser,
  updateUser,
  deleteUser,
  currentUser,
  login,
  refreshToken,
};
