
//suport for Node.JS

var cash = 3000

while (cash != 0) {
    if (cash >= 1000) {
        console.log(1000)
        cash = cash - 1000
        continue
    }
    if (cash >= 500) {
        console.log(500)
        cash = cash - 500
        continue
    }
    if (cash >= 100) {
        console.log(100)
        cash = cash - 100
    }
}
