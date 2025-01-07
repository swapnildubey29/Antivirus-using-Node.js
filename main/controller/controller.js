const multer = require("multer")
const cloudmersive = require("cloudmersive-virus-api-client")
const fs = require("fs")

const upload = multer({ dest: "uploads/" });

const defaultClient = cloudmersive.ApiClient.instance;
const ApiKey = defaultClient.authentications["Apikey"]
ApiKey.apiKey = "key";

const apiInstance = new cloudmersive.ScanApi()

const scanFileForVirus = (filePath) => {
  return new Promise((resolve, reject) => {
    const inputFile = Buffer.from(fs.readFileSync(filePath).buffer)

    apiInstance.scanFile(inputFile, (error, data) => {
      if (error) {
        console.error("Antivirus scan error:", error);
        return reject("Antivirus scan failed.");
      }

      if (data && data.cleanResult) {
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
        console.warn(`File not found at ${filePath}, likely already removed.`)
      }
      return res.status(400).send("File is infected and was rejected.")
    }
    res.status(200).send("File uploaded and scanned successfully.")
  } catch (error) {
    console.error("Error in file upload:", error)
    res.status(500).send("Error processing the file.")
  } finally {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath)
    }
  }
}

module.exports = { upload, uploadHandler }