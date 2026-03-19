// This represents the structure of a user

const createUser = (name, phone, role, password) => {
  return {
    name,
    phone,
    role,
    password
  };
};

module.exports = { createUser };
