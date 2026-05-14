const express = require("express");

const router = express.Router();

const axios = require("axios");

router.post("/analyze", async (req, res) => {

  try {

    const { content } = req.body;

    console.log("Received Content:");
    console.log(content);

    const ollamaResponse = await axios.post(
      "http://localhost:11434/api/generate",
      {
        model: "tinyllama",

        prompt: `
You are an AWS Cloud Security Auditor.

Analyze this IAM policy or Terraform code.

Return STRICTLY in this format:

Security Score: <number between 1-100>

Risks:
- bullet points

Severity:
- Critical / High / Medium / Low

Recommendations:
- bullet points

Content:
${content}
        `,

        stream: false,

        options: {
          num_predict: 180,
          temperature: 0.2
        }
      }
    );

    console.log("OLLAMA RESPONSE:");
    console.log(ollamaResponse.data);

    res.json({
      analysis: ollamaResponse.data.response
    });

  } catch (error) {

    console.log("AI ERROR:");
    console.log(error.message);

    res.status(500).json({
      analysis: "AI analysis failed"
    });

  }

});
router.post("/chat", async (req, res) => {

  try {

    const { question } = req.body;

    const completion =
      await groq.chat.completions.create({

        messages: [

          {
            role: "system",
            content:
              "You are an expert AWS cloud security assistant. Answer cloud security, IAM, Terraform, DevSecOps, S3, networking, encryption, and AWS security questions professionally."
          },

          {
            role: "user",
            content: question
          }

        ],

        model: "llama-3.1-8b-instant",

        temperature: 0.5

      });

    const answer =
      completion.choices[0].message.content;

    res.json({ answer });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      error: "AI chat failed"
    });

  }

});

module.exports = router;