const express = require("express");

const router = express.Router();

router.post("/analyze", async (req, res) => {

  try {

    const { terraformCode } = req.body;

    const findings = [];

    const lower =
      terraformCode.toLowerCase();

    // PUBLIC S3

    if (
      lower.includes("block_public_policy = false") ||
      lower.includes("public_access")
    ) {

      findings.push({
        severity: "High",
        issue:
          "Public S3 bucket access detected."
      });

    }

    // OPEN SSH

    if (
      lower.includes("0.0.0.0/0") &&
      lower.includes("22")
    ) {

      findings.push({
        severity: "High",
        issue:
          "SSH port 22 open to the internet."
      });

    }

    // OPEN RDP

    if (
      lower.includes("0.0.0.0/0") &&
      lower.includes("3389")
    ) {

      findings.push({
        severity: "High",
        issue:
          "RDP port 3389 exposed publicly."
      });

    }

    // NO ENCRYPTION

    if (
      lower.includes("aws_s3_bucket") &&
      !lower.includes("server_side_encryption")
    ) {

      findings.push({
        severity: "Medium",
        issue:
          "S3 bucket encryption not enabled."
      });

    }

    // EC2 WITHOUT SG

    if (
      lower.includes("aws_instance") &&
      !lower.includes("security_group")
    ) {

      findings.push({
        severity: "Medium",
        issue:
          "EC2 instance without security group."
      });

    }

    // SAFE

    if (findings.length === 0) {

      findings.push({
        severity: "Low",
        issue:
          "No major risks detected."
      });

    }

    res.json({ findings });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      error: "Terraform analysis failed"
    });

  }

});

module.exports = router;