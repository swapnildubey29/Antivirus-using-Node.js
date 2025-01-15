const multer = require("multer")
const cloudmersive = require("cloudmersive-virus-api-client")
const fs = require("fs")
require('dotenv').config()


const upload = multer({ dest: "uploads/" });

const defaultClient = cloudmersive.ApiClient.instance;
const ApiKey = defaultClient.authentications["Apikey"]
ApiKey.apiKey = process.env.SECRET_KEY;


const apiInstance = new cloudmersive.ScanApi()

const scanFileForVirus = (filePath) => {
  console.log("In process...")
  return new Promise((resolve, reject) => {
    const inputFile = Buffer.from(fs.readFileSync(filePath).buffer)

    apiInstance.scanFile(inputFile, (error, data) => {
      if (error) {
        console.error("Antivirus scan error:", error);
        return reject("Antivirus scan failed.");
      }
      if (data && data.CleanResult) {
        console.log("File is clean.")
        resolve(true)
      } else {
        console.warn("File is infected.")
        resolve(false)
      }
    })
  })
}

const uploadHandler = async (req, res) => {
  const filePath = req.file.path;

  try {
    const isFileClean = await scanFileForVirus(filePath);

    if (!isFileClean) {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      } else {
        console.warn(`File not found at ${filePath}, likely already removed.`);
      }
      return res.status(400).send("File is infected and was rejected.");
    }

    res.status(200).send("File uploaded and scanned successfully.");
  } catch (error) {
    console.error("Error in file upload:", error);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    res.status(500).send("Error processing the file.");
  }
};


module.exports = { upload, uploadHandler }