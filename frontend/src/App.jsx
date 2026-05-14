import { useState } from "react";
import axios from "axios";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";

function App() {

  const [activeTab, setActiveTab] = useState("iam");

  const [inputText, setInputText] = useState("");
  const [generatedPolicy, setGeneratedPolicy] = useState("");

  const [terraformCode, setTerraformCode] = useState("");
  const [terraformFindings, setTerraformFindings] = useState([]);

  const [aiAnalysis, setAiAnalysis] = useState("");
  const [chatInput, setChatInput] = useState("");

const [chatMessages, setChatMessages] = useState([
  
  {
    role: "assistant",
    content:
      "👋 Hello! Ask me anything about AWS cloud security."
  }
]);

  // GENERATE IAM POLICY

  const generatePolicy = async () => {

    try {

      const response = await axios.post(
        "http://localhost:5000/api/iam/generate",
        {
          prompt: inputText
        }
      );

      const policyString = JSON.stringify(
        response.data.policy,
        null,
        2
      );

      setGeneratedPolicy(policyString);

      setAiAnalysis("");

    } catch (error) {

      console.log(error);

    }

  };

 const runAIAnalysis = async () => {

  try {

    setAiAnalysis("🤖 AI is analyzing...");

    const response = await axios.post(
      "http://localhost:5000/api/ai/analyze",
      {
        content: generatedPolicy
      }
    );

    const analysis =
      response.data.analysis || "No AI response received";

    setAiAnalysis(analysis);

    // EXTRACT SECURITY SCORE

    const scoreMatch =
      analysis.match(/Security Score:\s*(\d+)/i);

    if (scoreMatch) {

      const extractedScore =
        parseInt(scoreMatch[1]);

      setSecurityScore(extractedScore);

    }

  } catch (error) {

    console.log(error);

    setAiAnalysis(
      "AI analysis failed"
    );

  }

};

  // TERRAFORM ANALYSIS
const generateArchitecture = () => {

  const services = [];

  const lower =
    terraformCode.toLowerCase();

  if (lower.includes("s3")) {
    services.push("🪣 S3 Bucket");
  }

  if (lower.includes("lambda")) {
    services.push("⚡ Lambda");
  }

  if (lower.includes("cloudfront")) {
    services.push("🌐 CloudFront");
  }

  if (lower.includes("ec2")) {
    services.push("🖥️ EC2");
  }

  if (lower.includes("dynamodb")) {
    services.push("🗄️ DynamoDB");
  }

  if (lower.includes("vpc")) {
    services.push("🌎 VPC");
  }

  setArchitecture(services);

};
  const analyzeTerraform = async () => {

    try {

      const response = await axios.post(
        "http://localhost:5000/api/terraform/analyze",
        {
          terraformCode
        }
      );

      setTerraformFindings(response.data.findings);

    } catch (error) {

      console.log(error);

    }

  };

  // FILE UPLOAD

  const handleTerraformUpload = (event) => {

    const file = event.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = (e) => {

      setTerraformCode(e.target.result);

    };

    reader.readAsText(file);

  };

  // DOWNLOAD POLICY

  const downloadPolicy = () => {

    const blob = new Blob(
      [generatedPolicy],
      {
        type: "application/json;charset=utf-8"
      }
    );

    saveAs(blob, "permissions-policy.json");

  };

 // AI SECURITY SCORE

const getSecurityScore = () => {

  let score = 100;

  if (
    generatedPolicy.includes('"Action": [\n        "*"')
  ) {
    score -= 45;
  }

  if (
    generatedPolicy.includes('"Resource": "*"')
  ) {
    score -= 20;
  }

  if (
    generatedPolicy.includes("logs:")
  ) {
    score += 5;
  }

  if (
    generatedPolicy.includes("s3:")
  ) {
    score += 3;
  }

  if (
    generatedPolicy.includes("lambda:")
  ) {
    score += 3;
  }

  if (
    generatedPolicy.includes("cloudfront:")
  ) {
    score += 3;
  }

  if (score > 100) score = 100;

  if (score < 10) score = 10;

  return score;

};

const securityScore = getSecurityScore();
const downloadPDF = () => {
  

  const doc = new jsPDF();

  doc.text(
    "Cloud Security Report",
    20,
    20
  );

  doc.text(
    `Security Score: ${securityScore}/100`,
    20,
    40
  );

  doc.text(
    generatedPolicy || "No policy",
    20,
    60
  );

  doc.text(
    aiAnalysis || "No AI analysis",
    20,
    100
  );

  doc.save("cloud-security-report.pdf");

};
 const askSecurityAI = async () => {

  try {

    setChatResponse(
      "🤖 AI is thinking..."
    );

    const response = await axios.post(
      "http://localhost:5000/api/ai/chat",
      {
        question: chatQuestion
      }
    );

    setChatResponse(
      response.data.answer
    );

  } catch (error) {

    console.log(error);

    setChatResponse(
      "AI chat failed"
    );

  }

};
  

return (

   
  <div style={styles.page}>

      {/* NAVBAR */}

      <div style={styles.navbar}>

        <div style={styles.leftNav}>

          <div style={styles.logoContainer}>

  <img
    src="https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg"
    alt="AWS"
    style={styles.awsLogo}
  />

  <img
    src="https://www.vectorlogo.zone/logos/terraformio/terraformio-icon.svg"
    alt="Terraform"
    style={styles.terraformLogo}
  />

</div>

          <div>

            <h2 style={styles.logoTitle}>
              Cloud Security Support Agent
            </h2>

            <p style={styles.logoSub}>
              AI-Powered AWS IAM & Terraform Security
            </p>

          </div>

        </div>

        <div style={styles.centerNav}>

          <button
            style={
              activeTab === "iam"
                ? styles.activeNavBtn
                : styles.navBtn
            }
            onClick={() => setActiveTab("iam")}
          >
            AWS IAM Security
          </button>

          <button
            style={
              activeTab === "terraform"
                ? styles.activeNavBtn
                : styles.navBtn
            }
            onClick={() => setActiveTab("terraform")}
          >
            Terraform Security
          </button>

        </div>

      </div>

      {/* HERO */}

      <div style={styles.heroSection}>

        <div style={styles.badge}>
          AI-Powered Cloud Security
        </div>

        <h1 style={styles.heroTitle}>
          {
            activeTab === "iam"
              ? "Generate Secure IAM Policies"
              : "Analyze Terraform Infrastructure"
          }
        </h1>

        <p style={styles.heroSub}>
          {
            activeTab === "iam"
              ? "Generate least-privilege IAM policies using AWS security best practices."
              : "Detect Terraform misconfigurations and insecure infrastructure deployments."
          }
        </p>

      </div>

      {/* MAIN CARD */}

      <div style={styles.mainCard}>

        {
          activeTab === "iam"
            ? (
              <>

                <h2 style={styles.cardHeading}>
                  What permissions do you need?
                </h2>

                <textarea
                  style={styles.textarea}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Example: Lambda should access S3 and CloudWatch"
                />

                <div style={styles.optionBox}>

                  <div style={styles.optionLeft}>
                    🔐 Least Privilege Mode
                  </div>

                  <select style={styles.select}>
                    <option>AWS Best Practices</option>
                  </select>

                </div>

                <button
                  style={styles.generateBtn}
                  onClick={generatePolicy}
                >
                  Generate Secure Policy →
                </button>

                <button
                  style={styles.aiBtn}
                  onClick={runAIAnalysis}
                >
                  🤖 AI Security Analysis
                </button>

                {/* SECURITY SCORE */}

                <div style={styles.securityCard}>

                  <div style={styles.scoreTop}>

                    <div>

                      <p style={styles.scoreLabel}>
                        Security Score
                      </p>

                      <h1 style={styles.scoreValue}>
                        {securityScore}
                        <span style={styles.scoreOutOf}>
                          /100
                        </span>
                      </h1>

                    </div>

                    <div
                      style={
                        securityScore >= 90
                          ? styles.secureBadge
                          : securityScore >= 80
                            ? styles.warningBadge
                            : styles.dangerBadge
                      }
                    >
                      {
                        securityScore >= 90
                          ? "Highly Secure"
                          : securityScore >= 80
                            ? "Moderate Risk"
                            : "High Risk"
                      }
                    </div>

                  </div>

                  <div style={styles.progressBar}>

                    <div
                      style={{
                        ...styles.progressFill,
                        width: `${securityScore}%`
                      }}
                    ></div>

                  </div>

                </div>

                {/* LIVE ANALYSIS */}

                <div style={styles.featureBox}>

                  <p style={styles.featureCount}>
                    Live Security Analysis
                  </p>

                  <h1 style={styles.featureHeading}>
                    IAM Security Assessment
                  </h1>

                  <p style={styles.featureText}>

                    {
                      generatedPolicy.includes("*")
                        ? "High-risk wildcard permissions detected in generated IAM policy."
                        : "IAM policy follows least-privilege cloud security practices."
                    }

                  </p>

                  <div style={styles.featureList}>

                    <div style={styles.featureItem}>

                      {
                        generatedPolicy.includes("s3")
                          ? "✅ S3 permissions configured securely"
                          : "⚠️ S3 access not detected"
                      }

                    </div>

                    <div style={styles.featureItem}>

                      {
                        generatedPolicy.includes("cloudfront")
                          ? "✅ CloudFront access policies validated"
                          : "⚠️ CloudFront permissions not configured"
                      }

                    </div>

                    <div style={styles.featureItem}>

                      {
                        generatedPolicy.includes("lambda")
                          ? "✅ Lambda execution permissions detected"
                          : "⚠️ Lambda permissions not detected"
                      }

                    </div>

                    <div style={styles.featureItem}>

                      {
                        generatedPolicy.includes("logs")
                          ? "✅ CloudWatch logging permissions enabled"
                          : "⚠️ Logging permissions missing"
                      }

                    </div>

                  </div>

                </div>

                {/* POLICY */}

                <div style={styles.policyBox}>

                  <div style={styles.policyTop}>

                    <h3>
                      permissions-policy.json
                    </h3>

                    <button
                      style={styles.downloadBtn}
                      onClick={downloadPolicy}
                    >
                      Download JSON
                    </button>

                  </div>
                  <button
  style={styles.aiBtn}
  onClick={downloadPDF}
>
  Download Security Report
</button>

                  <pre style={styles.codeBlock}>
                    {generatedPolicy}
                  </pre>

                </div>

                {/* AI OUTPUT */}

                <div style={styles.policyBox}>

                  <h2>
                    🤖 AI Security Analysis
                  </h2>

                  <pre style={styles.codeBlock}>
                    {aiAnalysis}
                  </pre>

                </div>

              </>
            )
            : (
              <>

                <h2 style={styles.cardHeading}>
                  Terraform Configuration
                </h2>

                <label style={styles.uploadBox}>

                  <input
                    type="file"
                    accept=".tf"
                    onChange={handleTerraformUpload}
                    style={{ display: "none" }}
                  />

                  <div style={styles.uploadContent}>

                    <div style={styles.uploadIcon}>
                      ☁️
                    </div>

                    <div>

                      <h3 style={styles.uploadTitle}>
                        Upload Terraform File
                      </h3>

                      <p style={styles.uploadText}>
                        Upload .tf infrastructure configuration file
                      </p>

                    </div>

                  </div>

                </label>

                <textarea
                  style={styles.textarea}
                  value={terraformCode}
                  onChange={(e) => setTerraformCode(e.target.value)}
                  placeholder="Paste Terraform code here..."
                />

                <button
                  style={styles.generateBtn}
                  onClick={analyzeTerraform}
                >
                  Analyze Terraform →
                  
                  
                </button>

                <div style={styles.policyBox}>

                  <h3>
                    Terraform Security Findings
                  </h3>

                  {
                    terraformFindings.map((finding, index) => (

                      <div
                        key={index}
                        style={{
                          marginTop: "15px",
                          padding: "18px",
                          borderRadius: "14px",
                          background:
                            finding.severity === "High"
                              ? "#3f1d1d"
                              : "#3b2f12",
                          color: "white"
                        }}
                      >

                        <h4>
                          {finding.severity} Risk
                        </h4>

                        <p>
                          {finding.issue}
                        </p>
                        

                      </div>

                    ))
                  }

                </div>

              </>
            )
        }


      </div>

    </div>

  );

}



const styles = {

  page: {
    minHeight: "100vh",
    background: "#f8fafc",
    fontFamily: "Arial, sans-serif",
    paddingBottom: "80px"
  },

  navbar: {
    width: "95%",
    margin: "20px auto",
    height: "85px",
    background: "rgba(255,255,255,0.9)",
    backdropFilter: "blur(12px)",
    borderRadius: "24px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 30px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
    border: "1px solid rgba(255,255,255,0.7)"
  },

  leftNav: {
    display: "flex",
    alignItems: "center",
    gap: "16px"
  },

  logoContainer: {
  display: "flex",
  alignItems: "center",
  gap: "12px"
},

awsLogo: {
  width: "42px",
  height: "42px",
  animation: "spin 8s linear infinite"
},

terraformLogo: {
  width: "38px",
  height: "38px",
  animation: "spinReverse 8s linear infinite"
},

  logoBox: {
    width: "62px",
    height: "62px",
    borderRadius: "18px",
    background: "linear-gradient(135deg,#2563eb,#9333ea)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "30px",
    color: "white",
    boxShadow: "0 10px 25px rgba(99,102,241,0.3)"
  },

  logoTitle: {
    margin: 0,
    fontSize: "30px",
    fontWeight: "800",
    color: "#2563eb"
  },

  logoSub: {
    margin: 0,
    fontSize: "15px",
    color: "#64748b"
  },

  centerNav: {
    display: "flex",
    gap: "14px"
  },

  navBtn: {
    padding: "14px 22px",
    borderRadius: "14px",
    border: "none",
    background: "transparent",
    color: "#334155",
    fontWeight: "600",
    cursor: "pointer",
    fontSize: "15px"
  },

  activeNavBtn: {
    padding: "14px 22px",
    borderRadius: "14px",
    border: "none",
    background: "linear-gradient(135deg,#2563eb,#ec4899)",
    color: "white",
    fontWeight: "700",
    cursor: "pointer",
    fontSize: "15px",
    boxShadow: "0 10px 30px rgba(99,102,241,0.35)"
  },

  heroSection: {
    textAlign: "center",
    marginTop: "70px"
  },

  aiBadge: {
    display: "inline-block",
    padding: "10px 22px",
    borderRadius: "999px",
    background: "#eef2ff",
    color: "#6366f1",
    fontWeight: "600",
    fontSize: "14px",
    marginBottom: "25px"
  },

  heroTitle: {
    fontSize: "76px",
    fontWeight: "800",
    lineHeight: "1.1",
    color: "#0f172a",
    margin: 0
  },

  gradientText: {
    background: "linear-gradient(135deg,#2563eb,#9333ea)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent"
  },

  heroSub: {
    width: "850px",
    margin: "30px auto",
    fontSize: "22px",
    lineHeight: "38px",
    color: "#64748b"
  },

  generatorCard: {
    width: "850px",
    margin: "55px auto",
    background: "white",
    borderRadius: "32px",
    padding: "40px",
    boxShadow: "0 20px 50px rgba(0,0,0,0.08)",
    border: "1px solid #e2e8f0"
  },

  cardTitle: {
    fontSize: "24px",
    color: "#0f172a",
    marginBottom: "22px"
  },

  textarea: {
    width: "100%",
    height: "180px",
    borderRadius: "20px",
    border: "1px solid #dbeafe",
    padding: "20px",
    fontSize: "16px",
    outline: "none",
    resize: "none",
    background: "#f8fafc",
    color: "#0f172a"
  },

  optionRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "25px"
  },

  leastPrivilegeBox: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
    background: "#f8fafc",
    border: "1px solid #e2e8f0",
    padding: "16px",
    borderRadius: "18px"
  },

  lockIcon: {
    width: "52px",
    height: "52px",
    borderRadius: "16px",
    background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "22px",
    color: "white"
  },

  optionHeading: {
    margin: 0,
    color: "#0f172a",
    fontSize: "16px"
  },

  optionText: {
    margin: 0,
    color: "#64748b",
    fontSize: "14px"
  },

  select: {
    padding: "14px 18px",
    borderRadius: "14px",
    border: "1px solid #cbd5e1",
    background: "white",
    fontSize: "15px"
  },

  generateBtn: {
    width: "100%",
    marginTop: "28px",
    padding: "22px",
    borderRadius: "18px",
    border: "none",
    background: "linear-gradient(135deg,#2563eb,#9333ea)",
    color: "white",
    fontSize: "18px",
    fontWeight: "700",
    cursor: "pointer",
    boxShadow: "0 10px 30px rgba(99,102,241,0.35)"
  },

  aiBtn: {
    width: "100%",
    marginTop: "18px",
    padding: "20px",
    borderRadius: "18px",
    border: "1px solid #dbeafe",
    background: "white",
    color: "#2563eb",
    fontSize: "17px",
    fontWeight: "700",
    cursor: "pointer"
  },

  securityCard: {
    width: "850px",
    margin: "35px auto",
    background: "white",
    borderRadius: "30px",
    padding: "35px",
    boxShadow: "0 20px 40px rgba(0,0,0,0.06)",
    border: "1px solid #e2e8f0"
  },

  scoreTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  },

  scoreLabel: {
    fontSize: "15px",
    color: "#64748b",
    marginBottom: "10px"
  },

  scoreValue: {
    fontSize: "90px",
    margin: 0,
    fontWeight: "800",
    color: "#06b6d4"
  },

  scoreOutOf: {
    fontSize: "36px",
    color: "#94a3b8"
  },

  secureBadge: {
    background: "#dcfce7",
    color: "#16a34a",
    padding: "14px 20px",
    borderRadius: "14px",
    fontWeight: "700"
  },

  warningBadge: {
    background: "#fef9c3",
    color: "#ca8a04",
    padding: "14px 20px",
    borderRadius: "14px",
    fontWeight: "700"
  },

  dangerBadge: {
    background: "#fee2e2",
    color: "#dc2626",
    padding: "14px 20px",
    borderRadius: "14px",
    fontWeight: "700"
  },

  progressBar: {
    width: "100%",
    height: "16px",
    background: "#e2e8f0",
    borderRadius: "999px",
    overflow: "hidden",
    marginTop: "24px"
  },

  progressFill: {
    height: "100%",
    background: "linear-gradient(90deg,#22c55e,#06b6d4,#3b82f6)",
    borderRadius: "999px"
  },

  featureBox: {
    width: "850px",
    margin: "35px auto",
    background: "white",
    borderRadius: "30px",
    padding: "35px",
    border: "1px solid #e2e8f0",
    boxShadow: "0 20px 40px rgba(0,0,0,0.05)"
  },

  featureCount: {
    color: "#2563eb",
    fontWeight: "700",
    fontSize: "15px"
  },

  featureHeading: {
    fontSize: "36px",
    color: "#0f172a",
    marginTop: "12px"
  },

  featureText: {
    color: "#64748b",
    lineHeight: "32px",
    fontSize: "18px"
  },

  featureList: {
    marginTop: "25px",
    display: "grid",
    gridTemplateColumns: "repeat(2,1fr)",
    gap: "18px"
  },

  featureItem: {
    background: "#f8fafc",
    border: "1px solid #e2e8f0",
    padding: "18px",
    borderRadius: "16px",
    color: "#0f172a",
    fontWeight: "500"
  },

  policyBox: {
    width: "850px",
    margin: "35px auto",
    background: "white",
    borderRadius: "30px",
    padding: "35px",
    border: "1px solid #e2e8f0",
    boxShadow: "0 20px 40px rgba(0,0,0,0.05)"
  },

  policyTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  },

  codeBlock: {
    marginTop: "25px",
    background: "#f8fafc",
    padding: "25px",
    borderRadius: "18px",
    overflowX: "auto",
    color: "#0f172a",
    border: "1px solid #e2e8f0",
    lineHeight: "28px"
  },

  downloadBtn: {
    border: "none",
    padding: "14px 18px",
    borderRadius: "14px",
    background: "linear-gradient(135deg,#10b981,#06b6d4)",
    color: "white",
    cursor: "pointer",
    fontWeight: "700"
  },

  uploadBox: {
    display: "block",
    border: "2px dashed #93c5fd",
    borderRadius: "24px",
    padding: "40px",
    marginBottom: "25px",
    cursor: "pointer",
    background: "#f8fafc"
  },

  uploadContent: {
    display: "flex",
    alignItems: "center",
    gap: "20px"
  },

  uploadIcon: {
    width: "78px",
    height: "78px",
    borderRadius: "22px",
    background: "linear-gradient(135deg,#2563eb,#9333ea)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "34px",
    color: "white"
  },

  uploadTitle: {
    fontSize: "22px",
    color: "#0f172a",
    margin: 0
  },

  uploadText: {
    color: "#64748b",
    marginTop: "8px"
  }

};
export default App;