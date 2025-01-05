const mongoose = require("mongoose");

const settingGeneralSchema = new mongoose.Schema(
  {
    websiteName: String,
    logo: String,
    email: String,
    phone: String,
    address: String,
    copyright: String,
  },
  {
    timestamps: true,
  }
);
const settingGeneral = mongoose.model(
  "SettingGenereal",
  settingGeneralSchema,
  "settings-general"
);

module.exports = settingGeneral;
