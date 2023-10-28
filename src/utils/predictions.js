const axios = require("axios");

// var faker = require("faker");
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
  const commonDiseases = [
    "None",
    "Diabetes",
    "Hypertension (High Blood Pressure)",
    "Influenza (Flu)",
    "Asthma",
    "Arthritis",
    "Coronary Artery Disease",
    "Stroke",
    "Chronic Obstructive Pulmonary Disease (COPD)",
    "Alzheimer's Disease",
    "Parkinson's Disease",
    "Depression",
    "Anxiety Disorders",
    "Osteoporosis",
    "Cancer (Various Types)",
    "Heart Failure",
    "Chronic Kidney Disease",
    "Gastroesophageal Reflux Disease (GERD)",
    "Chronic Liver Disease",
    "Migraine",
    "Eczema",
    "Psoriasis",
    "Multiple Sclerosis",
    "Glaucoma",
    "Rheumatoid Arthritis",
    "Chronic Fatigue Syndrome",
    "Irritable Bowel Syndrome (IBS)",
    "Bipolar Disorder",
    "Schizophrenia",
    "Chronic Bronchitis",
    "Peptic Ulcer Disease",
    "Thyroid Disorders",
    "Allergies",
    "Anemia",
    "Gout",
    "Pneumonia",
    "Urinary Tract Infection (UTI)",
    "Epilepsy",
    "Hypothyroidism",
    "Hyperthyroidism",
    "Endometriosis",
    "Polycystic Ovary Syndrome (PCOS)",
    "Hemorrhoids",
    "Gastroenteritis",
    "Tuberculosis (TB)",
    "Cholecystitis (Gallbladder Inflammation)",
    "Ovarian Cancer",
    "Prostate Cancer",
    "Melanoma",
    "Pancreatitis",
    "Crohn's Disease",
    "Ulcerative Colitis",
    "Osteoarthritis",
    "Glomerulonephritis",
    "Leukemia",
    "Hepatitis",
    "Meningitis",
    "Cataracts",
    "Retinal Diseases",
    "Fibromyalgia",
    "Osteomyelitis",
    "Atherosclerosis",
    "Atrial Fibrillation",
    "Deep Vein Thrombosis (DVT)",
    "Pulmonary Embolism (PE)",
    "Hemorrhagic Stroke",
    "Jaundice",
    "Congestive Heart Failure",
    "Obsessive-Compulsive Disorder (OCD)",
    "Panic Disorder",
    "Sleep Apnea",
    "Insomnia",
    "Myocardial Infarction (Heart Attack)",
    "Acne",
    "Bipolar Disorder",
    "Hypertensive Heart Disease",
    "Type 2 Diabetes",
    "Temporomandibular Joint Disorder (TMJ)",
    "Celiac Disease",
    "Polio",
    "Measles",
    "Chickenpox",
    "Rubella (German Measles)",
    "Pertussis (Whooping Cough)",
    "Dengue Fever",
    "Tuberculosis (TB)",
    "Malaria",
    "Cholera",
    "Zika Virus",
    "Yellow Fever",
    "Typhoid Fever",
    "HIV/AIDS",
    "Hepatitis B",
    "Syphilis",
    "Gonorrhea",
    "Chlamydia",
    "Herpes",
    "Human Papillomavirus (HPV)",
    "Inflammatory Bowel Disease",
    "Systemic Lupus Erythematosus (Lupus)",
    "E. coli Infection",
  ];

  interestList = [
    "None",
    "Football (Soccer)",
    "Basketball",
    "American Football",
    "Rugby (Union)",
    "Rugby (League)",
    "Cricket",
    "Ice Hockey",
    "Field Hockey",
    "Volleyball",
    "Handball",
    "Water Polo",
    "Athletics (Track and Field)",
    "Swimming",
    "Gymnastics",
    "Tennis",
    "Golf",
    "Boxing",
    "Wrestling",
    "Martial Arts",
    "Cycling (Road)",
    "Cycling (Mountain)",
    "Cycling (Track)",
    "Cycling (BMX)",
    "Archery",
    "Badminton",
    "Table Tennis",
    "Squash",
    "Mixed Martial Arts (MMA)",
    "Judo",
    "Karate",
    "Taekwondo",
    "Diving",
    "Synchronized Swimming",
    "Rowing",
    "Canoeing",
    "Kayaking",
    "Sailing",
    "Windsurfing",
    "Alpine Skiing",
    "Nordic Skiing",
    "Freestyle Skiing",
    "Snowboarding",
    "Figure Skating",
    "Speed Skating",
    "Curling",
    "Bobsleigh",
    "Luge",
    "Skeleton",
    "Rock Climbing",
    "Surfing",
    "Skateboarding",
    "Skydiving",
    "Base Jumping",
    "Whitewater Rafting",
    "Parkour",
    "Formula 1 Racing",
    "MotoGP",
    "Rally Racing",
    "NASCAR",
    "Karting",
    "Horse Racing",
    "Show Jumping",
    "Dressage",
    "Eventing",
    "Polo",
    "Archery",
    "Shooting (Rifle)",
    "Shooting (Pistol)",
    "Skeet Shooting",
    "Trap Shooting",
    // Add more sports here...
  ];

  var data = await axios.get("https://random-data-api.com/api/v2/users");
  data = data.data;
  var user = new User({
    first_name: data.first_name,
    last_name: data.last_name,
    email: data.email,
    password: data.password,
    gender: data.gender,
    locations: {
      longitude: data.address.coordinates.lng,
      latitude: data.address.coordinates.lat,
    },
    interests: [
      interestList[Math.floor(Math.random() * interestList.length)],
      interestList[Math.floor(Math.random() * interestList.length)],
      interestList[Math.floor(Math.random() * interestList.length)],
    ],
    diseases: [
      commonDiseases[Math.floor(Math.random() * commonDiseases.length)],
      commonDiseases[Math.floor(Math.random() * commonDiseases.length)],
      commonDiseases[Math.floor(Math.random() * commonDiseases.length)],
    ],
  });
  await user.save();
  return user;
};

module.exports = {
  predict,
  test,
  generate_fake_data,
};
