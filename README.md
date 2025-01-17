# File Upload and Virus Scan API

This project provides a secure file upload service with virus scanning capabilities using the Cloudmersive API. The service validates file types based on their magic numbers and scans them for potential threats before accepting them.

## Features

- **Secure File Upload**: Accepts files through a POST request with validation.
- **File Type Validation**: Ensures only specific file types are processed by checking magic numbers.
- **Virus Scanning**: Uses Cloudmersive Virus API to scan files for malware.
- **File Cleanup**: Deletes infected or corrupted files after validation and scanning.

## Prerequisites

- Node.js (v14 or higher)
- npm (Node Package Manager)
- A Cloudmersive API key

## Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/yourusername/your-repo-name.git
   cd your-repo-name
   ```

2. Install the dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and add your Cloudmersive API key:
   ```env
   SECRET_KEY=your_cloudmersive_api_key
   ```

4. Start the server:
   ```bash
   node index.js
   ```

## API Endpoints

### Upload File

**POST** `/upload`

Uploads and scans a file for viruses.

#### Request Parameters

- **File**: Attach the file using the `file` key in the form-data.

#### Response

- `200 OK`: File uploaded and scanned successfully.
- `400 Bad Request`: File is corrupted, infected, or invalid.
- `500 Internal Server Error`: An error occurred while processing the file.

### Example Usage

Using `curl`:
```bash
curl -X POST -F "file=@path/to/your/file" http://localhost:3000/upload
```

## File Validation Rules

Supported file types are validated using magic numbers:
- **PDF**: `%PDF`
- **Images**: JPG, JPEG, PNG
- **Documents**: CSV, XLSX, DOCX
- **Others**: EXE, HTML, XML, ZIP

## Folder Structure

```plaintext
.
├── uploads/               # Directory for temporary file storage
├── index.js               # Main entry point
├── routes/
├── middleware/
├── services/
├── .env                   # Environment variables
├── package.json           # Project metadata
└── README.md              # Project documentation
```

## Error Handling

- **Corrupted Files**: Files with invalid or empty content are rejected.
- **Infected Files**: Files flagged by Cloudmersive API are deleted and not processed further.

## Contributing

1. Fork the repository.
2. Create a new branch for your feature:
   ```bash
   git checkout -b feature-name
   ```
3. Commit your changes:
   ```bash
   git commit -m "Add feature name"
   ```
4. Push to your branch:
   ```bash
   git push origin feature-name
   ```
5. Open a pull request on GitHub.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Cloudmersive Virus Scan API](https://www.cloudmersive.com/virus-api)
- Node.js and npm ecosystem
