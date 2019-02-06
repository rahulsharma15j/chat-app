let appCongig = {};
appCongig.port = 3000;
appCongig.allowedCorsOrigin = "*";
appCongig.env = "dev";
appCongig.apiVersion = "/api/v1";
appCongig.db = {
    uri:` `
};

module.exports = {
    port:appCongig.port,
    allowedCorsOrigin:appCongig.allowedCorsOrigin,
    environment:appCongig.env,
    db:appCongig.db,
    apiVersion:appCongig.apiVersion
}