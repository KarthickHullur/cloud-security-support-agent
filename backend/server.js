require("dotenv").config();

const express = require("express");
const cors = require("cors");

const aiRoutes = require("./routes/aiRoutes");

const app = express();

app.use(cors());

app.use(express.json());



// HOME ROUTE

app.get("/", (req, res) => {

  res.send(
    "Cloud Security Support Agent API Running"
  );

});



// AI ROUTES

app.use(
  "/api/ai",
  aiRoutes
);



// IAM POLICY GENERATOR

app.post(
  "/api/iam/generate",
  async (req, res) => {

    try {

      const { prompt } = req.body;

      let policy = {
        Version: "2012-10-17",
        Statement: [
          {
            Effect: "Allow",
            Action: [],
            Resource: "*"
          }
        ]
      };



      if (
        prompt.toLowerCase().includes("s3")
      ) {

        policy.Statement[0].Action.push(
          "s3:GetObject",
          "s3:ListBucket"
        );

      }



      if (
        prompt.toLowerCase().includes("cloudwatch")
      ) {

        policy.Statement[0].Action.push(
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents"
        );

      }



      if (
        prompt.toLowerCase().includes("lambda")
      ) {

        policy.Statement[0].Action.push(
          "lambda:InvokeFunction"
        );

      }



      if (
        prompt.toLowerCase().includes("ec2")
      ) {

        policy.Statement[0].Action.push(
          "ec2:DescribeInstances"
        );

      }



      if (
        prompt.toLowerCase().includes("admin")
      ) {

        policy.Statement[0].Action = ["*"];

      }



      res.json({
        policy
      });

    } catch (error) {

      console.log(error);

      res.status(500).json({
        error: "IAM generation failed"
      });

    }

  }
);



// TERRAFORM ANALYZER

app.post(
  "/api/terraform/analyze",
  async (req, res) => {

    try {

      const { terraform } = req.body;

      let findings = [];



      if (
        terraform.includes("0.0.0.0/0")
      ) {

        findings.push({
          severity: "High",
          issue:
            "Security group open to public internet"
        });

      }



      if (
        terraform.includes(
          "publicly_accessible = true"
        )
      ) {

        findings.push({
          severity: "High",
          issue:
            "Database publicly accessible"
        });

      }



      if (
        terraform.includes(
          "encrypted = false"
        )
      ) {

        findings.push({
          severity: "Medium",
          issue:
            "Encryption disabled"
        });

      }



      res.json({
        findings
      });

    } catch (error) {

      console.log(error);

      res.status(500).json({
        error:
          "Terraform analysis failed"
      });

    }

  }
);



const PORT =
  process.env.PORT || 5000;

app.listen(PORT, () => {

  console.log(
    `Server running on port ${PORT}`
  );

});