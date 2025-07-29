const { book } = require("../config/prisma");

const createBook = async (req, res, next) => {
  try {
    const { title, description } = req.body;
    const { id } = req.user;
    const newBook = await book.create({
      data: {
        title,
        description,
        author_id: id,
      },
    });

    res.status(201).json({
      status: "success",
      message: "Book created successfully",
      data: newBook,
    });
  } catch (error) {
    next(error);
  }
};

const getOneBook = async (req, res, next) => {
  try {
    const { id } = req.params;
    const getBook = await book.findUnique({ where: { id } });

    if (!getBook) {
      res.code = 404;
      throw new Error("Book not found");
    }

    res.status(200).json({ message: "success", data: getBook });
  } catch (error) {
    next(error);
  }
};
const getAllbooks = async (req, res, next) => {
  try {
    const books = await book.findMany({});
    res.status(200).json({ message: "success", data: books });
  } catch (error) {
    next(error);
  }
};

const updateBook = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;
    const bookData = await _findBook(id);
    const updateData = await book.update({
      where: { id: bookData.id },
      data: { title, description },
    });

    res.status(200).json({ message: "success", data: updateData });
  } catch (error) {
    next(error);
  }
};
const deleteBook = async (req, res, next) => {
  try {
    const { id } = req.params;
    const bookData = await _findBook(id);
    await book.delete({ where: { id: bookData.id } });
    res.status(200).json({ message: true, data: bookData });
  } catch (error) {
    next(error);
  }
};

const _findBook = async (id) => {
  const bookData = await book.findFirst({ where: { id } });
  if (!bookData) {
    res.code = 404;
    throw new Error("Book not found");
  }
  return bookData;
};
const _clearBooks = async (req, res, next) => {
  await book.deleteMany();
};

module.exports = {
  createBook,
  getOneBook,
  getAllbooks,
  updateBook,
  deleteBook,
  _clearBooks,
};
