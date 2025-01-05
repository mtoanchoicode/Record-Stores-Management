const SettingGenereal = require("../../models/settings-general.model");

// [GET] /settings/general

module.exports.general = async (req, res) => {
  const settingGeneral = await SettingGenereal.findOne({});
  res.render("admin/pages/settings/general", {
    pageTitle: "General Settings",
    settingGeneral: settingGeneral,
  });
};

// [PATCH] /settings/general

module.exports.generalPatch = async (req, res) => {
  const settingGeneral = await SettingGenereal.findOne({});
  if (settingGeneral) {
    await SettingGenereal.updateOne(
      {
        _id: settingGeneral.id,
      },
      req.body
    );
  } else {
    const record = new SettingGenereal(req.body);
    await record.save();
  }

  req.flash("success", "Update complete!");

  res.redirect("back");
};
