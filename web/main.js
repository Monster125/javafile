// npm install express ejs mysql body-parser cookie-parser
var express      = require('express')
var server       = express()  // var app = express()
var bodyParser   = require('body-parser')
var readBody     = bodyParser.urlencoded( {extended: false} )
var cookieParser = require('cookie-parser')
var readCookie   = cookieParser()
var ejs     = require('ejs') // embedded javascript
server.engine('html', ejs.renderFile)
server.listen(2000)
var mysql   = require('mysql')
var source  = { host: 'localhost', database: 'web',
				user: 'jeff',      password: 'bezos' }
var pool    = mysql.createPool(source)
var valid   = [ ]
// ถ้าข้อมูลถูกส่งมาผ่าน http get ใน express จะเก็บข้อมูลไว้ที่ req.query
// แต่ใน http post ต้องอ่านข้อมูลเอง หรือ เรียกใช้ middleware
server.get ('/',        showHome)
server.get (['/login','/signin'], showLogInPage)
server.post(['/login','/signin'], readBody, checkPassword)
server.get ('/profile', readCookie, showProfilePage)
server.get ('/logout',  readCookie, showLogOutPage)
server.get ('/create',  readCookie, showCreatePage)
server.post('/create',  readCookie, readBody, savePost)
server.get ('/show',    showPost)
server.get ('/view/:id',showPostById)
server.get ('/search',  showSearchResult)
server.use(showError)

function showSearchResult(req, res) {
	var sql = 'select * from post where title like ? or detail like ?'
	var data = [ '%'+req.query.text+'%', '%'+req.query.text+'%' ]
	pool.query(sql, data, function f(e, result) {
		res.render('search.html', {result: result})
	})
}

function showHome(req, res) {
	res.render('index.html')
}

function showPostById(req, res) {
	// req.params.id, req.query.id
	req.query.id = req.params.id // copy id
	showPost(req, res)
}

function showPost(req, res) {
	var data = [req.query.id]
	var sql  = 'select * from post where id=?'
	pool.query(sql, data, function f(e,r) {
		if (r.length == 1) {
			res.render('detail.html', {post: r[0]})
		}
		else {
			res.render('error.html')
		}
	})
}

function savePost(req, res) {
	var card = req.cookies.card
	if (valid[card]) {
		var sql = 'insert into post(title,detail,owner) values(?,?,?)'
		var data = [req.body.title, req.body.detail, valid[card].id ]
		pool.query(sql, data, function f(e,r) {
			res.redirect('/profile')
		})
	} else {
		res.redirect('/login')
	}
}

function showCreatePage(req, res) {
	var card = req.cookies.card
	if (valid[card]) {
		res.render('create.html')
	} else {
		res.redirect('/login')
	}
}

function showLogOutPage(req, res) {
	var card = req.cookies.card
	delete valid[card]
	res.render('logout.html')
}

function showProfilePage(req, res) {
	var card = req.cookies.card
	if (valid[card]) {
		res.render('profile.html', { member: valid[card] } )
	} else {
		res.redirect('/login')
	}
}

function checkPassword(req, res) {
	var sql = 'select * from member where email=? and password=sha2(?,512)'
	var data = [req.body.email, req.body.password]
	pool.query(sql, data, function f(error, result) {
		if (result.length == 1) {
			var card = createCard()
			valid[card] = result[0] // เก็บไว้ว่าเขาคือใคร
			res.set('Set-Cookie', 'card=' + card)
			res.redirect('/profile')
		} else {
			res.redirect('/login?message=Invalid Password')
		}
	})
}

function createCard() {
	var card = ''
	for (var i = 0; i < 8; i++) {
		var r = parseInt( Math.random() * 10000 )
		if (i >    0) card = card + '-'
		if (r <   10) card = card + '0'
		if (r <  100) card = card + '0'
		if (r < 1000) card = card + '0'
		card = card + r
	}
	return card
}

function showLogInPage(req, res) {
	res.render('login.html')
}

function showError(req, res, next) {
	res.render('error.html')
	// don't call next()
}

