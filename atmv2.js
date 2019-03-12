var prompt = require('prompt'); //Request npm install prompt

var schema = {
    properties: {
      money: {
        pattern: /^\d*$/,
        message: 'Number Only',
        required: true
      },
    }
  };

prompt.start();

prompt.get(schema, function (err, result) {

while (result.money != 0) {
    if (result.money >= 1000) {
        console.log(1000)
        result.money = result.money - 1000
        continue
    }
    if (result.money >= 500) {
        console.log(500)
        result.money = result.money - 500
        continue
    }
    if (result.money >= 100) {
        console.log(100)
        result.money = result.money - 100
    }
}
 });
