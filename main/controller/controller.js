const multer = require("multer")
const cloudmersive = require("cloudmersive-virus-api-client")
const fs = require("fs")
require("dotenv").config()

const upload = multer({ dest: "uploads/" })

const defaultClient = cloudmersive.ApiClient.instance
const ApiKey = defaultClient.authentications["Apikey"]
ApiKey.apiKey = process.env.SECRET_KEY

const apiInstance = new cloudmersive.ScanApi()

const scanFileForVirus = (filePath) => {
  console.log("Scanning file...")

  return new Promise((resolve, reject) => {
    try {
      const inputFile = fs.readFileSync(filePath)

      if (inputFile.length === 0) {
        throw new Error("File buffer is empty. Possible corruption.")
      } 

      console.log("File buffer size:", inputFile.length)

      if (!isValidFile(inputFile)) {
        throw new Error("File appears to be corrupted or invalid.")
      }

      apiInstance.scanFile(inputFile, (error, data) => {
        if (error) {
           console.error("Antivirus scan error:", error)   
          return reject("Antivirus scan failed.")
        }

        console.log("Cloudmersive API Response:", data)

        if (data && data.CleanResult) {
          console.log("File is clean.")
          resolve(true)
        } else {
          console.warn("File is infected.")
          resolve(false)
        }
      })
    } catch (err) {
      console.error("Error processing file:", err.message)
      reject("Failed to process file.")
    }
  })
}

const isValidFile = (inputFile) => {
  const headers = {
    pdf: [0x25, 0x50, 0x44, 0x46], 
    jpg: [0xFF, 0xD8, 0xFF], 
    jpeg: [0xFF, 0xD8, 0xFF],
    png: [0x89, 0x50, 0x4E, 0x47], 
    csv: [0xEF, 0xBB, 0xBF], 
    xlsx: [0x50, 0x4B, 0x03, 0x04], 
    docx: [0x50, 0x4B, 0x03, 0x04],
    exe: [0x4D, 0x5A], 
    html: [0x3C, 0x21, 0x44, 0x4F], 
    xml: [0x3C, 0x3F, 0x78, 0x6D], 
    zip: [0x50, 0x4B, 0x03, 0x04], 
  }

  const checkMagicNumber = (header) => {
    for (const [key, value] of Object.entries(headers)) {
      if (header.slice(0, value.length).every((byte, index) => byte === value[index])) {
        return true
      }
    }
    return false
  }

  return checkMagicNumber(inputFile)
}

const validateFile = (filePath) => {
  try {
    const stats = fs.statSync(filePath)
    if (stats.size === 0) {
      throw new Error("File is empty or corrupted.")
    }
    return true
  } catch (error) {
    console.error("File validation failed:", error.message)
    return false
  }
}

const uploadHandler = async (req, res) => {
  const filePath = req.file.path

  try {
    const isValid = validateFile(filePath)
    if (!isValid) {
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath)
      return res.status(400).send("File is corrupted and cannot be processed.")
    }

    const isFileClean = await scanFileForVirus(filePath)

    if (!isFileClean) {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath)
      } else {
        console.warn(`File not found at ${filePath}, likely already removed.`)
      }
      return res.status(400).send("File is infected and was rejected.")
    }

    res.status(200).send("File uploaded and scanned successfully.")
  } catch (error) {
    console.error("Error in file upload:", error)

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath)
    }

    res.status(500).send("Error processing the file.")
  }
}

module.exports = { upload, uploadHandler }