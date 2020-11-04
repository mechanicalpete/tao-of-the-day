process.env.AWS_XRAY_CONTEXT_MISSING = 'LOG_ERROR';
if (process.platform === 'win32') {
    // Use this when you are running on Windows with Docker Toolbox.
    process.env.OVERRIDE_AWSSDK_ENDPOINT = process.env.OVERRIDE_AWSSDK_ENDPOINT || 'http://192.168.99.100:4566';
} else {
    // Use this when you are running on Linux or OSX
    process.env.OVERRIDE_AWSSDK_ENDPOINT = process.env.OVERRIDE_AWSSDK_ENDPOINT || 'http://localhost:4566';
}

// If you want to reference other typescript modules, do it via require:
const initialise = require('./_initialise');

module.exports = async function () {
    await initialise.initialise();
    return null;
};