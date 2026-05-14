const express = require("express");

const router = express.Router();

const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});
console.log(process.env.GROQ_API_KEY);

router.post("/analyze", async (req, res) => {

  try {

    const { content } = req.body;

    const completion =
      await groq.chat.completions.create({

        messages: [

          {
            role: "system",
            content:
              "You are an AWS cloud security expert. Analyze IAM policies and Terraform configurations. Give risks, severity, and remediation."
          },

          {
            role: "user",
            content:
              `Analyze this cloud configuration:\n\n${content}`
          }

        ],

        model: "llama-3.1-8b-instant",

        temperature: 0.4

      });

    const analysis =
      completion.choices[0].message.content;

    res.json({ analysis });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      error: "AI analysis failed"
    });

  }

});

module.exports = router;