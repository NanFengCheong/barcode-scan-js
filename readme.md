# Barcode Scan JavaScript Library

A JavaScript library for integrating barcode and QR code scanning into web applications using a scanner-like keyboard input. This library provides a customizable element, `barcode-scan`, that can be easily integrated into your web projects.

## Features

- Seamless integration of barcode and QR code scanning into web applications.
- Customizable configuration for different scanning requirements.
- Event-driven architecture for handling scan results.
- Supports specifying minimum and maximum barcode lengths.
- Ignores specified input elements to prevent interference with user input.

## Installation

npm install barcode-scan-js

## Usage

1. Import the library in your HTML file:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Barcode Scan Demo</title>
</head>
<body>
    <!-- Add the barcode-scan element -->
    <barcode-scan></barcode-scan>

    <script src="main.js"></script>
</body>
</html>

```

2. Use the `<barcode-scan>` element in your HTML:

```html
<barcode-scan config='{"minLength": 4, "maxLength": 12, "toUpper": true}'></barcode-scan>
```

3. Add an event listener in your JavaScript to capture scan results:

```javascript
// Import the library
import 'barcode-scan-js';

// Get a reference to the barcode-scan element
const barcodeScanner = document.querySelector('barcode-scan');

// Add an event listener to capture scan results
barcodeScanner.addEventListener('scan', (event) => {
  const scanResult = event.detail;
  // Handle the scan result here
  console.log('Scanned Barcode:', scanResult.code);
  console.log('Is Valid:', scanResult.isValid);
  console.log('Time Taken (ms):', scanResult.timeTakenMs);
  console.log('Cleaned Code:', scanResult.cleanedCode);
});

```

## Configuration

The `<barcode-scan>` element supports the following configuration options:

- `minLength`: Minimum length of the scanned barcode (default: 1).
- `maxLength`: Maximum length of the scanned barcode (default: 14).
- `codeStartsWith`: Start of the barcode string (default: empty string).
- `codeEndsWith`: End of the barcode string (default: empty string).
- `scanTimeoutMs`: Timeout (in milliseconds) to consider the input as a scan (default: 3000ms).
- `ignoreOverElements`: An array of HTML tag names to ignore when scanning (default: `['INPUT']`).
- `toUpper`: Convert scanned text to uppercase (default: false).

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

Feel free to modify and expand this README to suit your project's specific needs.