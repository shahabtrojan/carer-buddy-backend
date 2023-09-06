const { User, validate_signuo } = require("../models/user");
const bcrypt = require("bcrypt");
const { predict, generate_fake_data } = require("../utils/predictions");
const signup = async (req, res) => {
  try {
    const { error } = validate_signuo(req.body);
    if (error) {
      return res.status(400).json({
        code: 400,
        message: error.details[0].message.replace(/"/g, ""),
      });
    }

    const { first_name, last_name, email, password, home_address } = req.body;

    // check if user already exists

    let existing_user = await User.findOne({ email });

    if (existing_user) {
      return res.status(400).json({
        code: 400,
        message: "User already exists",
      });
    }

    // create new user

    var user = new User({
      first_name,
      last_name,
      email,
      password,
      home_address,
    });

    user = await user.save();

    const token = await user.generateAuthToken();

    return res.status(200).json({
      code: 200,
      message: "Signup successful",
      user: user,
      token: token,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      code: 500,
      message: error.message,
    });
  }
};

const login_user = async (req, res) => {
  try {
    const { email, password } = req.body;

    var user = await User.findOne({ email: email }).populate(
      "message_request.requested_by",
      "first_name last_name image email"
    );
    if (!user)
      return res.status(400).json({
        code: 400,
        message: "Invalid email or password",
      });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword)
      return res.status(400).json({
        code: 400,
        message: "Invalid email or password",
      });

    const token = user.generateAuthToken();

    var requested_users = await User.find({
      "message_request.requested_by": user._id,
    }).select("-password");

    res.status(200).json({
      code: 200,
      message: "Login Successfull",
      token: token,
      user: user,
      my_requested_users: requested_users,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const get_profile = async (req, res) => {
  try {
    var user = await User.findById(req.user._id)
      .select("-password")
      .populate(
        "message_request.requested_by",
        "first_name last_name image email"
      );

    if (!user)
      return res.status(404).json({
        code: 404,
        message: "User not found",
      });

    // find users which i requested

    var requested_users = await User.find({
      "message_request.requested_by": req.user._id,
    }).select("-password");

    // predict the cluster of the user based on the interests, diseases gender if profile is completed

    // if (user.profile_completed) {
    //   {
    //     "status": "",
    //     "sex": "",
    //     "disease_1": "",
    //     "interest_1": "",
    //     "disease_2": "",
    //     "interest_2": "",
    //     "disease_3": "",
    //     "interest_3": ""
    // }
    var data_to_pass = {
      interest_1: user.interests[0] ?? "",
      interest_2: user.interests[1] ?? "",
      interest_3: user.interests[2] ?? "",
      disease_1: user.diseases[0] ?? "",
      disease_2: user.diseases[1] ?? "",
      disease_3: user.diseases[2] ?? "",
      status: user.status ?? "",
      sex: user.gender ?? "m",
    };
    var predictions = await predict(data_to_pass);
    console.log(predictions);
    user.cluster_id = predictions[0];
    console.log(user);
    user = await user.save();
    // }

    return res.status(200).json({
      code: 200,
      message: "success",
      user: user,
      requested_by: user.message_request,
      my_requested_users: requested_users,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Server Error" });
  }
};

const get_profile_by_id = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select("-password")
      .populate(
        "message_request.requested_by",
        "first_name last_name image email"
      );

    if (!user)
      return res.status(404).json({
        code: 404,
        message: "User not found",
      });

    return res.status(200).json({
      code: 200,
      message: "success",
      user: user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Server Error" });
  }
};

const add_interest = async (req, res) => {
  try {
    var user = await User.findById(req.user._id).select("-password");

    if (!user)
      return res.status(404).json({
        code: 404,
        message: "User not found",
      });

    user.interests = req.body.interests;
    user = await user.save();

    var data_to_pass = {
      interest_1: user.interests[0] ?? "",
      interest_2: user.interests[1] ?? "",
      interest_3: user.interests[2] ?? "",
      disease_1: user.diseases[0] ?? "",
      disease_2: user.diseases[1] ?? "",
      disease_3: user.diseases[2] ?? "",
      status: user.status ?? "",
      sex: user.gender ?? "m",
    };
    var predictions = await predict(data_to_pass);
    console.log(predictions);
    user.cluster_id = predictions[0];
    console.log(user);
    user = await user.save();

    return res.status(200).json({
      code: 200,
      message: "Interest added successfully",
      user: user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Server Error" });
  }
};

const add_location = async (req, res) => {
  try {
    var user = await User.findById(req.user._id).select("-password");

    if (!user)
      return res.status(404).json({
        code: 404,
        message: "User not found",
      });

    user.locations = req.body.locations;
    user = await user.save();

    var data_to_pass = {
      interest_1: user.interests[0] ?? "",
      interest_2: user.interests[1] ?? "",
      interest_3: user.interests[2] ?? "",
      disease_1: user.diseases[0] ?? "",
      disease_2: user.diseases[1] ?? "",
      disease_3: user.diseases[2] ?? "",
      status: user.status ?? "",
      sex: user.gender ?? "m",
    };
    var predictions = await predict(data_to_pass);
    console.log(predictions);
    user.cluster_id = predictions[0];
    console.log(user);
    user = await user.save();

    return res.status(200).json({
      code: 200,
      message: "Location added successfully",
      user: user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Server Error" });
  }
};

const add_disease = async (req, res) => {
  try {
    var user = await User.findById(req.user._id).select("-password");

    if (!user)
      return res.status(404).json({
        code: 404,
        message: "User not found",
      });

    user.diseases = req.body.diseases;
    user = await user.save();

    var data_to_pass = {
      interest_1: user.interests[0] ?? "",
      interest_2: user.interests[1] ?? "",
      interest_3: user.interests[2] ?? "",
      disease_1: user.diseases[0] ?? "",
      disease_2: user.diseases[1] ?? "",
      disease_3: user.diseases[2] ?? "",
      status: user.status ?? "",
      sex: user.gender ?? "m",
    };
    var predictions = await predict(data_to_pass);
    console.log(predictions);
    user.cluster_id = predictions[0];
    console.log(user);
    user = await user.save();

    return res.status(200).json({
      code: 200,
      message: "Disease added successfully",
      user: user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Server Error" });
  }
};

const edit_profile = async (req, res) => {
  try {
    var user = await User.findById(req.user._id).select("-password");

    if (!user)
      return res.status(404).json({
        code: 404,
        message: "User not found",
      });

    var gender = req.body.gender ?? "";

    user.first_name = req.body.first_name;
    user.last_name = req.body.last_name;
    user.image = req.body.image;
    user.gender = gender;
    user.contact_number = req.body.contact_number;
    user.profile_completed = req.body.profile_completed;
    user.home_address = req.body.home_address;
    user.status = req.body.status;

    user = await user.save();

    var data_to_pass = {
      interest_1: user.interests[0] ?? "",
      interest_2: user.interests[1] ?? "",
      interest_3: user.interests[2] ?? "",
      disease_1: user.diseases[0] ?? "",
      disease_2: user.diseases[1] ?? "",
      disease_3: user.diseases[2] ?? "",
      status: user.status ?? "",
      sex: user.gender ?? "m",
    };
    var predictions = await predict(data_to_pass);
    console.log(predictions);
    user.cluster_id = predictions[0];
    console.log(user);
    user = await user.save();

    return res.status(200).json({
      code: 200,
      message: "Profile updated successfully",
      user: user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Server Error" });
  }
};

// feed api in which every tiome user login it will show the feed of the user

const feed = async (req, res) => {
  // try {
  //   // get random users  every time user login

  //   // var users = await User.find({
  //   //   _id: { $ne: req.user._id },
  //   // }).select("-password");

  //   // find users which cluster id is same as the user

  //   var cluster_users = [];
  //   // var cluster_users = await User.find({
  //   //   cluster_id: req.user.cluster_id,
  //   // }).select("-password");

  //   // cluster_users = cluster_users.concat(users);

  //   if (
  //     !!req.body.latitude &&
  //     !!req.body.longitude &&
  //     req.body.latitude !== "" &&
  //     req.body.longitude !== ""
  //   ) {
  //     const yourLatitude =
  //       req.body.latitude ?? req.user.locations.latitude ?? "";
  //     const yourLongitude = req.body.longitude ?? req.user.locations.longitude;
  //     const maxDistanceMeters = 10000;

  //     // if (
  //     //   req.user.gender != "" ||
  //     //   req.user.status != "" ||
  //     //   req.user.interests.length != 0 ||
  //     //   req.user.diseases.length != 0
  //     // ) {
  //     //   console.log("here");
  //     // Find users within 1000 meters of the specified latitude and longitude
  //     var near_by = await User.find({
  //       $and: [
  //         { "locations.latitude": { $ne: "" } }, // Ensure latitude is not empty
  //         { "locations.longitude": { $ne: "" } }, // Ensure longitude is not empty
  //         {
  //           locations: {
  //             $geoWithin: {
  //               $centerSphere: [
  //                 [yourLongitude, yourLatitude],
  //                 maxDistanceMeters / 6378100,
  //               ],
  //             },
  //           },
  //         },
  //         // {
  //         //   cluster_id: req.user.cluster_id,
  //         // },
  //       ],
  //     });

  //     console.log({
  //       near_by,
  //     });

  //     cluster_users = cluster_users.concat(near_by);
  //   }

  //   // get unique users

  //   // get users with my same intrests or disense or gener or status

  //   var query_object = {
  //     $or: [
  //       {
  //         gemder: req.user.gender,
  //       },
  //       {
  //         status: req.user.status,
  //       },
  //     ],
  //   };

  //   if (req.user.interests.length > 0) {
  //     query_object = {
  //       ...query_object,
  //       $or: [{ interests: { $in: req.user.interests } }],
  //     };
  //   } else if (req.user.diseases.length > 0) {
  //     query_object = {
  //       ...query_object,
  //       $or: [{ diseases: { $in: req.user.diseases } }],
  //     };
  //   }

  //   // check if query object is empty or not

  //   if (Object.keys(query_object).length > 0) {
  //     var similar_users = await User.find({
  //       $or: [
  //         { interests: { $in: req.user.interests } },
  //         { diseases: { $in: req.user.diseases } },
  //         {
  //           gender: req.user.gender,
  //         },
  //         {
  //           status: req.user.status,
  //         },
  //       ],
  //     }).select("-password");

  //     console.log({
  //       similar_users,
  //     });

  //     cluster_users = cluster_users.concat(similar_users);

  //     console.log(cluster_users.length);

  //     cluster_users = Array.from(new Set(cluster_users.map((a) => a._id))).map(
  //       (id) => {
  //         return cluster_users.find((a) => a._id === id);
  //       }
  //     );
  //   }

  //   res.status(200).json({
  //     code: 200,
  //     message: "success",
  //     users: cluster_users,
  //     cluster_users: cluster_users,
  //   });
  // } catch (error) {
  //   console.log(error);
  //   return res.status(500).json({ msg: "Server Error" });
  // }

  try {
    var cluster_users = [];

    if (
      !!req.body.latitude &&
      !!req.body.longitude &&
      req.body.latitude !== "" &&
      req.body.longitude !== ""
    ) {
      // Your geospatial query here to find users within a certain distance
      const yourLatitude =
        req.body.latitude ?? req.user.locations.latitude ?? "";
      const yourLongitude = req.body.longitude ?? req.user.locations.longitude;
      const maxDistanceMeters = 10000;

      var near_by = await User.find({
        $and: [
          { "locations.latitude": { $ne: "" } },
          { "locations.longitude": { $ne: "" } },
          {
            locations: {
              $geoWithin: {
                $centerSphere: [
                  [yourLongitude, yourLatitude],
                  maxDistanceMeters / 6378100,
                ],
              },
            },
          },
        ],
      });

      cluster_users = cluster_users.concat(near_by);
    }

    var query_object = {};

    if (req.user.gender != "" || req.user.status != "") {
      query_object = {
        $or: [
          {
            gender: req.user.gender,
          },
        ],
      };
    } else if (req.user.status != "") {
      query_object = {
        $or: [
          {
            status: req.user.status,
          },
        ],
      };
    }

    if (req.user.interests.length > 0) {
      query_object = {
        ...query_object,
        $or: [{ interests: { $in: req.user.interests } }],
      };
    } else if (req.user.diseases.length > 0) {
      query_object = {
        ...query_object,
        $or: [{ diseases: { $in: req.user.diseases } }],
      };
    }

    console.log({
      query_object,
    });
    var similar_users = await User.find(query_object).select("-password");

    cluster_users = cluster_users.concat(similar_users);

    // Remove duplicates based on _id
    cluster_users = cluster_users.filter(
      (user, index, self) => index === self.findIndex((u) => u._id === user._id)
    );

    res.status(200).json({
      code: 200,
      message: "success",
      users: cluster_users,
      cluster_users: cluster_users,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Server Error" });
  }
};

const request_message = async (req, res) => {
  try {
    // get the user who is sending the request

    var user = await User.findById(req.user._id).select("-password");

    if (!user)
      return res.status(404).json({
        code: 404,
        message: "User not found",
      });

    // get the user who is receiving the request

    var requested_user = await User.findById(req.params.id).select("-password");

    if (!requested_user)
      return res.status(404).json({
        code: 404,
        message: "User not found",
      });

    // check if the user is already requested

    var check_request = user.message_request.filter(
      (item) => item.requested_by.toString() === req.user._id.toString()
    );

    if (check_request.length > 0) {
      return res.status(400).json({
        code: 400,
        message: "Request already sent",
      });
    }

    // send the request

    requested_user.message_request.push({
      requested_by: req.user._id,
      requested_status: "pending",
    });

    requested_user = await requested_user.save();

    user = await user.save();

    return res.status(200).json({
      code: 200,
      message: "Request sent successfully",
      user: user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Server Error" });
  }
};

const accept_request = async (req, res) => {
  try {
    // get the user who is sending the request

    var user = await User.findById(req.user._id).select("-password");

    if (!user)
      return res.status(404).json({
        code: 404,
        message: "User not found",
      });

    // get the user who is receiving the request

    var requested_user = await User.findById(req.params.id).select("-password");

    if (!requested_user)
      return res.status(404).json({
        code: 404,
        message: "User not found",
      });

    // check if the user is already requested

    var check_request = user.message_request.filter(
      (item) => item.requested_by.toString() === req.params.id.toString()
    );

    if (check_request.length === 0) {
      return res.status(400).json({
        code: 400,
        message: "Request not found",
      });
    }

    // send the request

    user.message_request.map((item) => {
      if (item.requested_by.toString() === req.params.id.toString()) {
        item.requested_status = req.body.status;
      }
    });

    user = await user.save();

    return res.status(200).json({
      code: 200,
      message: `Request ${req.body.status} successfully`,
      user: user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Server Error" });
  }
};

const get_requests = async (req, res) => {
  try {
    // get the user who is sending the request

    var user = await User.findById(req.user._id)
      .select("-password")
      .populate(
        "message_request.requested_by",
        "first_name last_name image email"
      );

    if (!user)
      return res.status(404).json({
        code: 404,
        message: "User not found",
      });

    return res.status(200).json({
      code: 200,
      message: "success",
      requests: user?.message_request ?? [],
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Server Error" });
  }
};

const get_predictions = async (req, res) => {
  try {
    const predictions = await predict(req.body);
    return res.status(200).json({
      code: 200,
      message: "success",
      predictions: predictions,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Server Error" });
  }
};

const insert_fake_data = async (req, res) => {
  try {
    var status = [
      "single",
      "married",
      "divorced",
      "widowed",
      "separated",
      "complicated",
    ];

    var gender = ["m", "f"];

    for (let index = 0; index < 100; index++) {
      var user = await generate_fake_data();

      var data_to_pass = {
        interest_1: user.interests[0] ?? "music",
        interest_2: user.interests[1] ?? "music",
        interest_3: user.interests[2] ?? "music",
        disease_1: user.diseases[0] ?? "none",
        disease_2: user.diseases[1] ?? "none",
        disease_3: user.diseases[2] ?? "none",
        status: status[Math.floor(Math.random() * status.length)],
        sex: gender[[Math.floor(Math.random() * gender.length)]],
      };

      var predictions = await predict(data_to_pass);
      console.log(predictions);
      user.cluster_id = predictions[0];

      user = await user.save();
    }
    return res.status(200).json({
      code: 200,
      message: "success",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Server Error" });
  }
};

module.exports = {
  signup,
  login_user,
  get_profile,
  add_interest,
  add_location,
  add_disease,
  edit_profile,
  feed,
  request_message,
  accept_request,
  get_requests,
  get_predictions,
  get_profile_by_id,
  insert_fake_data,
};

//  make a function that check if yser progile is completed or not

const check_profile = async (user) => {
  try {
    if (
      user.gender != "" ||
      user.status != "" ||
      user.home_address != "" ||
      user.interests.length != 0 ||
      user.diseases.length != 0
    ) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.log(error);
    return false;
  }
};
