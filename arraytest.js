var data = ["Latte", "Mocha", "Amaricano", "Expresso", "Mocha"] //create หลายข้อมูล
data.sort()
console.log(data)
var a = [7,9,12,11,10,7,8]
a.sort(compares)
console.log(a)

function compares(x, y)
	{return x - y}

function compare(x,y){
	if (x < y) return -1
	if (x > y) return +1
	return 0
}
