const axios = require("axios");

var faker = require("faker");
const { User } = require("../models/user");

var model_server = "http://localhost:6464/predict";
var test_server = "http://localhost:6464/test";

const predict = async (data) => {
  try {
    console.log(data);
    const response = await axios.post(model_server, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

const test = async () => {
  try {
    const response = await axios.get(test_server);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

const generate_fake_data = async () => {
  var user = new User({
    first_name: faker.name.firstName(),
    last_name: faker.name.lastName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    locations: {
      longitude: faker.address.longitude(),
      latitude: faker.address.latitude(),
    },
    interests: [faker.random.word(), faker.random.word(), faker.random.word()],
    diseases: [faker.random.word(), faker.random.word(), faker.random.word()],
  });
  await user.save();
  return user;
};

module.exports = {
  predict,
  test,
  generate_fake_data,
};
