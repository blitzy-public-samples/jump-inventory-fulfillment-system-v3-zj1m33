// Import required modules
const fs = require('fs').promises;
const path = require('path');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUiExpress = require('swagger-ui-express');
const swaggerOptions = require('../src/backend/config/swagger');

/**
 * Main function to generate API documentation
 * @returns {Promise<void>} Resolves when documentation is generated
 */
async function generateApiDocs() {
    try {
        // Initialize Swagger specification using swagger-jsdoc
        const apiRoutes = await getApiRoutes(path.join(__dirname, '../src/backend/routes'));
        const swaggerSpec = swaggerJsdoc({
            ...swaggerOptions,
            apis: apiRoutes,
        });

        // Generate Swagger JSON
        const swaggerJson = JSON.stringify(swaggerSpec, null, 2);

        // Write Swagger JSON to file
        await fs.writeFile(path.join(__dirname, '../docs/swagger.json'), swaggerJson);

        // Generate HTML documentation using swagger-ui-express
        const htmlDoc = swaggerUiExpress.generateHTML(swaggerSpec);

        // Write HTML documentation to file
        await fs.writeFile(path.join(__dirname, '../docs/api-docs.html'), htmlDoc);

        console.log('API documentation generated successfully.');
    } catch (error) {
        console.error('Error generating API documentation:', error);
    }
}

/**
 * Function to recursively get all API route files
 * @param {string} dir - Directory to search for route files
 * @returns {Promise<string[]>} Array of file paths for API routes
 */
async function getApiRoutes(dir) {
    const files = await fs.readdir(dir);
    const routes = [];

    for (const file of files) {
        const filePath = path.join(dir, file);
        const stat = await fs.stat(filePath);

        if (stat.isDirectory()) {
            // Recursively search for files in subdirectories
            routes.push(...await getApiRoutes(filePath));
        } else if (file.endsWith('Routes.js')) {
            // Filter for JavaScript files that end with 'Routes.js'
            routes.push(filePath);
        }
    }

    return routes;
}

// Main execution block of the script
generateApiDocs().catch(error => {
    console.error('Unhandled error:', error);
    process.exit(1);
});

// Human tasks:
// TODO: Review generated documentation for completeness and accuracy
// TODO: Integrate this script into the CI/CD pipeline for automatic documentation updates
// TODO: Set up a process to version control the generated documentation