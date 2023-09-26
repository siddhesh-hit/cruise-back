const { KYCDetail } = require("../models/index");

// create KYC of an user
exports.createKYC = async (req, res) => {
  try {
    console.log(req.body, req.file);
    const { cred_id, kyc_type } = req.body;

    if (!cred_id) {
      res.status(400).json({ error: "Please provide cred_id" });
      return;
    }

    if (!kyc_type) {
      res.status(400).json({ error: "Please provide kyc_type" });
      return;
    }

    // if (!kyc_document) {
    //   res.status(400).json({ error: "Please provide kyc_document" });
    //   return;
    // }

    const kycData = await KYCDetail.create({
      cred_id,
      kyc_type,
      kyc_document: req.file ? req.file.filename : null,
    });

    if (kycData) {
      res.status(201).json({
        message: `KYC model created for user ${cred_id}`,
        data: kycData,
      });
    } else {
      res.status(400).json({ error: "Unable to create KYC model" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// update KYC of an user
exports.updateKYC = async (req, res) => {
  try {
    const { cred_id, kyc_type } = req.body;

    if (!cred_id) {
      res.status(400).json({ error: "Please provide cred_id" });
      return;
    }

    const kycData = await KYCDetail.update(
      {
        kyc_type,
        kyc_document: req.file ? req.file.filename : null,
      },
      {
        where: {
          cred_id,
        },
      }
    );

    if (kycData) {
      res.status(201).json({
        message: `KYC model updated for user ${cred_id}`,
        data: kycData,
      });
    } else {
      res.status(400).json({ error: "Unable to update KYC model" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// get KYC of an user
exports.getKYC = async (req, res) => {
  try {
    console.log(req.params);
    const { id } = req.params;

    if (!id) {
      res.status(400).json({ error: "Please provide id" });
      return;
    }

    const kycData = await KYCDetail.findOne({
      where: {
        cred_id,
      },
    });

    if (kycData) {
      res.status(201).json({
        message: `KYC model found for user ${cred_id}`,
        data: kycData,
      });
    } else {
      res.status(400).json({ error: "Unable to find KYC model" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// get all KYC of an user
exports.getAllKYC = async (req, res) => {
  try {
    const kycData = await KYCDetail.findAll({});

    if (kycData) {
      res.status(201).json({
        message: `KYC model found for all users`,
        data: kycData,
      });
    } else {
      res.status(400).json({ error: "Unable to find KYC model" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// delete KYC of an user
exports.deleteKYC = async (req, res) => {
  try {
    console.log(req.body);
    const { cred_id } = req.body;

    if (!cred_id) {
      res.status(400).json({ error: "Please provide cred_id d" });
      return;
    }

    const kycData = await KYCDetail.destroy({
      where: {
        cred_id,
      },
    });

    res.status(201).json({
      message: `KYC model deleted for user ${id}`,
      data: kycData,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
