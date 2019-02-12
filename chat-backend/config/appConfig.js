let appCongig = {};
appCongig.port = 3000;
appCongig.allowedCorsOrigin = "*";
appCongig.env = "dev";
appCongig.apiVersion = "/api/v1";
appCongig.db = {
    uri:`mongodb://node-shop:node-shop@cluster0-shard-00-00-zvxva.mongodb.net:27017,cluster0-shard-00-01-zvxva.mongodb.net:27017,cluster0-shard-00-02-zvxva.mongodb.net:27017/chat?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true`
};

module.exports = {
    port:appCongig.port,
    allowedCorsOrigin:appCongig.allowedCorsOrigin,
    environment:appCongig.env,
    db:appCongig.db,
    apiVersion:appCongig.apiVersion
}