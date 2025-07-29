const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const isConnect = async () => {
  try {
    await prisma.$connect();
    console.log("database connected");
  } catch (error) {
    await prisma.$disconnect();
    console.log("error: " + error);
  }
};
isConnect();
module.exports = prisma;
