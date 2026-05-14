const express = require("express");

const router = express.Router();

const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});



// AI SECURITY ANALYSIS

router.post(
  "/analyze",
  async (req, res) => {

    try {

      const { policy } = req.body;

      const completion =
        await groq.chat.completions.create({

          messages: [
            {
              role: "system",
              content:
                "You are a cloud security expert."
            },
            {
              role: "user",
              content:
                `Analyze this IAM policy:\n${JSON.stringify(policy)}`
            }
          ],

          model: "llama-3.3-70b-versatile"

        });

      res.json({
        analysis:
          completion.choices[0].message.content
      });

    } catch (error) {

      console.log(error);

      res.status(500).json({
        error: "AI analysis failed"
      });

    }

  }
);



// AI CHAT ASSISTANT

router.post(
  "/chat",
  async (req, res) => {

    try {

      const { question } = req.body;

      const completion =
        await groq.chat.completions.create({

          messages: [
            {
              role: "system",
              content:
                "You are an AWS cloud security assistant."
            },
            {
              role: "user",
              content: question
            }
          ],

          model: "llama-3.3-70b-versatile"

        });

      res.json({
        answer:
          completion.choices[0].message.content
      });

    } catch (error) {

      console.log(error);

      res.status(500).json({
        error: "AI chat failed"
      });

    }

  }
);

module.exports = router;