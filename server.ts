import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import nodemailer from "nodemailer";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize MongoDB Connection in a highly resilient way
const MONGODB_URI = process.env.MONGODB_URI;

let isMongoConnected = false;

if (MONGODB_URI && !MONGODB_URI.includes("<db_password>")) {
  console.log("🔌 Attempting to connect to MongoDB Atlas...");
  mongoose.connect(MONGODB_URI, {
    serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
  })
    .then(() => {
      console.log("✅ Connected to MongoDB Atlas successfully");
      isMongoConnected = true;
    })
    .catch((err: any) => {
      console.error("❌ MongoDB connection error:", err.message);
      if (err.message.includes("ENOTFOUND")) {
        console.error("\n--- DNS ERROR DETECTED ---");
        console.error("The system cannot find the MongoDB host. This usually means:");
        console.error("1. The cluster address in your MONGODB_URI is incorrect.");
        console.error("2. Your MongoDB Atlas cluster might be paused or deleted.");
        console.error("3. There is a temporary DNS resolution issue.");
        console.error("\nACTION: Please double-check your connection string in the MongoDB Atlas dashboard.");
        console.error("It should look something like: mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/database\n");
      } else if (err.message.includes("MongooseServerSelectionError")) {
        console.error("\n--- ACTION REQUIRED ---");
        console.error("This error usually means your IP address is not whitelisted in MongoDB Atlas.");
        console.error("1. Go to: https://cloud.mongodb.com/");
        console.error("2. Navigate to 'Network Access' in the left sidebar.");
        console.error("3. Click 'Add IP Address'.");
        console.error("4. Select 'Allow Access From Anywhere' (0.0.0.0/0) for testing, or add your current IP.");
        console.error("5. Click 'Confirm' and wait a minute for the changes to apply.\n");
      }
    });
} else {
  console.warn("⚠️ MongoDB URI contains default placeholder or is empty. MongoDB functionality is bypassed (resilient mode).");
}

// Message schema
const messageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

// Drop model if compilation/HMR restarts cause duplicates, otherwise retrieve/compile
const Message = mongoose.models.Message || mongoose.model("Message", messageSchema);

const app = express();
app.use(express.json());
app.use(express.static("public"));

// API Diagnostics Endpoint
app.get("/api/status", async (req, res) => {
  const hasSMTP = !!(process.env.SMTP_USER && 
                    process.env.SMTP_USER !== "your-email@gmail.com" && 
                    process.env.SMTP_USER.trim() !== "" &&
                    process.env.SMTP_PASS && 
                    process.env.SMTP_PASS !== "your-app-password" &&
                    process.env.SMTP_PASS.trim() !== "");

  const hasMongo = !!(MONGODB_URI && !MONGODB_URI.includes("<db_password>"));

  res.json({
    database: {
      configured: hasMongo,
      connected: mongoose.connection.readyState === 1,
      status: ["disconnected", "connected", "connecting", "disconnecting"][mongoose.connection.readyState] || "disconnected"
    },
    email: {
      smtpConfigured: hasSMTP,
      destinationEmail: process.env.CONTACT_EMAIL || "satadeep798@gmail.com",
    },
    serverTime: new Date().toISOString()
  });
});

// API routes
app.post("/api/contact", async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ success: false, message: "All fields are required." });
  }

  try {
    // 1. Try to Save to MongoDB if configured
    if (MONGODB_URI && !MONGODB_URI.includes("<db_password>")) {
      try {
        console.log("💾 Saving contact message to MongoDB Atlas...");
        const newMessage = new Message({ name, email, message });
        await newMessage.save();
        console.log("✅ Message saved to MongoDB Atlas.");
      } catch (dbError: any) {
        console.error("⚠️ Database storage skipped/failed:", dbError.message);
        // We do not fail the request; email delivery proceeds for maximum resilience
      }
    }

    // 2. Send Email
    let transporter;
    let fromEmail = "portfolio@example.com";
    
    const hasSMTP = process.env.SMTP_USER && 
                    process.env.SMTP_USER !== "your-email@gmail.com" && 
                    process.env.SMTP_USER.trim() !== "" &&
                    process.env.SMTP_PASS && 
                    process.env.SMTP_PASS !== "your-app-password" &&
                    process.env.SMTP_PASS.trim() !== "";

    if (hasSMTP) {
      transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || "smtp.gmail.com",
        port: Number(process.env.SMTP_PORT) || 587,
        secure: (process.env.SMTP_PORT === "465"),
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });
      fromEmail = process.env.SMTP_USER!;
    } else {
      console.log("No SMTP credentials supplied or placeholder detected. Generating dynamic Ethereal SMTP test account...");
      const testAccount = await nodemailer.createTestAccount();
      transporter = nodemailer.createTransport({
        host: testAccount.smtp.host,
        port: testAccount.smtp.port,
        secure: testAccount.smtp.secure,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
      fromEmail = testAccount.user;
    }

    const mailOptions = {
      from: `"${name}" <${fromEmail}>`,
      to: process.env.CONTACT_EMAIL || "satadeep798@gmail.com",
      replyTo: email,
      subject: `Portfolio Message: ${name}`,
      text: `You have a new message from your portfolio contact form.\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent successfully! Message ID:", info.messageId);
    
    if (!hasSMTP) {
      console.log("💌 View test email here:", nodemailer.getTestMessageUrl(info));
    }

    res.json({ success: true, message: "Message sent successfully!" });
  } catch (error) {
    console.error("Error processing contact form:", error);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
});

async function setupVite() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }
}

const PORT = process.env.PORT || 3000;

if (process.env.NODE_ENV !== "production" && !process.env.VERCEL) {
  setupVite().then(() => {
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on port ${PORT}`);
    });
  });
} else {
  setupVite().then(() => {
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Production server running on port ${PORT}`);
    });
  });
}
export default app;
