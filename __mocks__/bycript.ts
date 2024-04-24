const hash = jest.fn(() => Promise.resolve("hashed_password"));

export default { hash };
