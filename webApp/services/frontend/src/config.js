// If the BACKEND values aren't set, this means we are running in development mode locally.
// Otherwise, they are substituded by the production Node server into the root index.html.
if (window.BACKEND_HOST === "__BACKEND_HOST__") {
    window.BACKEND_HOST = "localhost";
}

if (window.BACKEND_PORT === "__BACKEND_PORT__") {
    window.BACKEND_PORT = "5000";
}

if (window.BACKEND_PROTOCOL === "__BACKEND_PROTOCOL__") {
    window.BACKEND_PROTOCOL = "http";
}

let BACKEND_URL = `${window.BACKEND_PROTOCOL}://${window.BACKEND_HOST}`;

if (window.BACKEND_PORT !== "80" && window.BACKEND_PORT !== "443") {
    BACKEND_URL = `${BACKEND_URL}:${window.BACKEND_PORT}`;
}

// Testing the BACKEND_URL for localhost is a good enough indicator of
// whether or not we're running in production or development
const IS_PRODUCTION = !BACKEND_URL.includes("localhost");

export {
    BACKEND_URL,
    IS_PRODUCTION
};
