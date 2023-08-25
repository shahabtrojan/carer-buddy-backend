const axios = require("axios");

var model_server = "http://localhost:5000/predict";
var test_server = "http://localhost:5000/test";

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

module.exports = {
  predict,
  test,
};
