const payload = (payload) => {
  return {
    id: payload.id,
    name: payload.name,
    email: payload.email,
  };
};

module.exports = payload;
