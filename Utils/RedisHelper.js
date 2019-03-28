const redis = require("redis");
const RedisOptions = require('../config/redis.config.js'); //redis配置文件
const client = redis.createClient(RedisOptions.redis);
client.on("error", function (err) {
    console.log("Error " + err);
});
client.hmset('myname', {
    name: 'msq',
    truename: 'MaQun '
}, function (err) {
    console.log(err)
}); //建立一个字段存储对象
client.expire('myname', 8); //设置过期时间为8秒
redis.client = client;
module.exports = redis;
