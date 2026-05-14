const express = require("express");

const router = express.Router();

router.post("/generate", async (req, res) => {

  try {

    const { prompt } = req.body;

    const lowerPrompt = prompt.toLowerCase();

    let actions = [];

    // S3

    if (
      lowerPrompt.includes("s3") ||
      lowerPrompt.includes("bucket")
    ) {

      actions.push(
        "s3:GetObject",
        "s3:ListBucket"
      );

    }

    // CLOUDWATCH LOGS

    if (
      lowerPrompt.includes("logs") ||
      lowerPrompt.includes("cloudwatch")
    ) {

      actions.push(
        "logs:CreateLogGroup",
        "logs:CreateLogStream",
        "logs:PutLogEvents"
      );

    }

    // LAMBDA

    if (
      lowerPrompt.includes("lambda")
    ) {

      actions.push(
        "lambda:InvokeFunction"
      );

    }

    // CLOUDFRONT

    if (
      lowerPrompt.includes("cloudfront")
    ) {

      actions.push(
        "cloudfront:CreateDistribution",
        "cloudfront:GetDistribution"
      );

    }

    // DYNAMODB

    if (
      lowerPrompt.includes("dynamodb")
    ) {

      actions.push(
        "dynamodb:GetItem",
        "dynamodb:PutItem"
      );

    }

    // EC2

    if (
      lowerPrompt.includes("ec2")
    ) {

      actions.push(
        "ec2:DescribeInstances"
      );

    }

    // ECR

    if (
      lowerPrompt.includes("ecr")
    ) {

      actions.push(
        "ecr:GetAuthorizationToken"
      );

    }

    // SQS

    if (
      lowerPrompt.includes("sqs")
    ) {

      actions.push(
        "sqs:SendMessage",
        "sqs:ReceiveMessage"
      );

    }

    // ADMIN / WILDCARD

    if (
      lowerPrompt.includes("admin") ||
      lowerPrompt.includes("full access") ||
      lowerPrompt.includes("all aws")
    ) {

      actions = ["*"];

    }

    // DEFAULT

    if (actions.length === 0) {

      actions.push(
        "iam:ListUsers"
      );

    }

    const policy = {

      Version: "2012-10-17",

      Statement: [
        {
          Effect: "Allow",
          Action: actions,
          Resource: "*"
        }
      ]

    };

    res.json({ policy });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "IAM generation failed"
    });

  }

});

module.exports = router;