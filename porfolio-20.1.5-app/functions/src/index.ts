/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import {setGlobalOptions} from "firebase-functions";
import {onRequest} from "firebase-functions/https";
import * as logger from "firebase-functions/logger";

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

setGlobalOptions({ maxInstances: 10 });
  const functions = require("firebase-functions");
  const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "jorgeperiguell@gmail.com",
    pass: "tuContrasehaDeApp" // Contraseña de apps, no de Gmail
  }
});

exports.sendEmail = functions.https.onRequest(async (req, res) => {
  const { nom, correu, text, telefon } = req.body;

  await transporter.sendMail({
    from: correu,
    to: "jorgeperiguell@gmail.com",
    subject: `ol·licitud de contacte via Porfoli`,
    html: `<p>Nom: ${nom}</p>
           <p>Correu: ${correu}</p>
           <p>Telèfon: ${telefon}</p>
           <p>Missatge: ${text}</p>`
  });

  res.json({ success: true, message: "Email enviat" });
});

