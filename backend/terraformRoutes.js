const express = require("express");

const router = express.Router();

router.post("/analyze", async (req, res) => {

  try {

    const { terraformCode } = req.body;

    let findings = [];

    if (
      terraformCode.includes("0.0.0.0/0")
    ) {

      findings.push({
        severity: "High",
        issue: "SSH exposed publicly"
      });

    }

    if (
      terraformCode.includes("block_public_policy = false")
    ) {

      findings.push({
        severity: "High",
        issue: "Public S3 bucket detected"
      });

    }

    if (findings.length === 0) {

      findings.push({
        severity: "Low",
        issue: "No major risks detected"
      });

    }

    res.json({ findings });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Terraform analysis failed"
    });

  }

});

module.exports = router;