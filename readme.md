### Barcode-Scan Custom Element

The `barcode-scan` custom element is designed to simplify the process of scanning and validating barcodes in web applications. It listens for keyboard input and triggers a custom event, providing information about the scanned barcode's validity and other details.

#### Installation

You can install the `barcode-scan` custom element via npm:

```bash
npm install barcode-scan-js
```

#### Stackblitz Demo

https://stackblitz.com/edit/js-j8zukx?file=index.js,index.html

#### Usage

1. Include the `barcode-scan` custom element in your HTML file:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <!-- ... -->
</head>
<body>
    <barcode-scan></barcode-scan>
    <!-- ... -->
</body>
</html>
```

2. Configure the element by setting its attributes or properties. You can configure it using a JSON string in the `config` attribute. Here's an example configuration:

```html
<barcode-scan config='{"minLength": 8, "maxLength": 12, "scanEndsWithKey": "Enter"}'></barcode-scan>
```

The available configuration options are:

- `minLength` (optional): The minimum length of a valid barcode (default: 1).
- `maxLength` (optional): The maximum length of a valid barcode (default: 14).
- `scanEndsWithKey` (optional): The key that indicates the end of a barcode scan (default: empty string).
- `scanTimeoutMs` (optional): The timeout (in milliseconds) to consider the input as a complete barcode (default: 3000).
- `ignoreOverElements` (optional): An array of HTML tag names to ignore when scanning (default: ["INPUT"]).

3. Listen for the `scan` event to receive barcode scan results:

```javascript
document.querySelector('barcode-scan').addEventListener('scan', (event) => {
    const scanResult = event.detail;
    if (scanResult.isValid) {
        console.log(`Valid barcode scanned: ${scanResult.code}`);
    } else {
        console.error(`Invalid barcode scanned: ${scanResult.code}, Error: ${scanResult.errorMessage}`);
    }
});
```

The `scan` event provides detailed information about the scanned barcode, including its code, length, validity, time taken to scan, cleaned code, and configuration.

4. That's it! You can now use the `barcode-scan` custom element to scan and validate barcodes in your web application.

### Example

Here's a simple example of how to use the `barcode-scan` custom element in an HTML file:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Barcode Scanner</title>
</head>
<body>
    <h1>Barcode Scanner</h1>
    <barcode-scan config='{"minLength": 6, "maxLength": 10, "scanEndsWithKey": "Enter"}'></barcode-scan>

    <div id="scan-result"></div>

    <script>
        const scanResultElement = document.getElementById('scan-result');

        document.querySelector('barcode-scan').addEventListener('scan', (event) => {
            const scanResult = event.detail;
            if (scanResult.isValid) {
                scanResultElement.innerHTML = `Valid barcode scanned: ${scanResult.code}`;
            } else {
                scanResultElement.innerHTML = `Invalid barcode scanned: ${scanResult.code}, Error: ${scanResult.errorMessage}`;
            }
        });
    </script>
</body>
</html>
```

This example sets up the `barcode-scan` custom element with a configuration and listens for the `scan` event to display the scan result on the page.

Feel free to customize the configuration and event handling to fit your specific barcode scanning needs.