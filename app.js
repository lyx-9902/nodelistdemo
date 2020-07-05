//app application 应用程序
//把当前模块所有的依赖项都声明在文件模块的最上面
//为了保持目录结构保持统一，html文件，都放到views（视图）文件夹里。
//lib第三方的包放到里面
//静态资源放到public里面
var http = require('http')
var fs = require('fs')
var template = require('art-template')
var url = require('url')

var comments = [{
		name: '张四',
		message: '今天是个好日子',
		dataTime: '2020.03.03'
	},
	{
		name: '张三',
		message: '今天是个好日子',
		dataTime: '2020.03.03'
	}
]

http
	.createServer(function(req, res) {
		var parseObj = url.parse(req.url, true)
		var pathname = parseObj.pathname //单独获取url？后面的路径
		if (pathname == '/') {
			fs.readFile('./views/index.html', function(err, data) {
				if (err) {
					return res.end('404 not found')
				} else {
					var htmlstr = template.render(data.toString(), {
						comments: comments
					})
					res.end(htmlstr)
				}
			})
		} else if (pathname === '/post') {
			//其他的都处理成404找不到
			fs.readFile('./views/post.html', function(err, data) { //注意路径 服务器里面都用绝对路径
				if (err) {
					return res.end("404 non found")
				}
				res.end(data)

			})
		} else if (pathname === '/pinglun') {
			// 注意:一次请求,对应一次响应. 只会返回第一个碰到的end, 它就带着数据返回浏览器了

			//注意：这个是偶偶无论评论?后面是什么都不用担心了，因为使用url方法，只获取路径。
			// console.log(JSON.stringify(parseObj).query);
			// 我们已经使用url模块的parse方法把请求路径中的查询字符串解析成了一个对象.
			//      所以接下来要做的就是:
			// 	   1.获取表单提交的数据 parseobj.query
			// 	   2.生成日期到数据对象中,然后存储到数组中.
			// 	   3.让用户重定向跳转到首页
			// 	   当用户重新请求/de 时候,我数组中的数据已经发生变化了,所以用户看到的时候,已经变化.
			var comment = parseObj.query
			comment.dataTime = '2020-11-02'
			comment.message = (comment.message).trim()
			comments.unshift(comment)

			//服务端这个时候已经把数据存储好了，接下来就是让用户重新请求/首页。就可以看到列表了。

			//如何通过服务器让客户端重定向？
			// 1.状态码设置为302临时重定向.
			//statusCode
			//2. 在响应头中通过Location 告诉客户端该往哪里重定向。
			//如果客户端发现收到服务端的响应状态码是302就会自动去响应头中找location.
			//所以你就会自动看到客户端自动跳转
			res.statusCode = 302
			res.setHeader('Location', "/") //  /就是http://127.0.0.1:3000/
			// return	res.end(JSON.stringify(parseObj.query))
			res.end()

		} else if (pathname.indexOf('/public/') === 0) {

			fs.readFile('.' + pathname, function(err, data) {
				if (err) {
					return res.end("404 non found")
				}
				res.end(data)

			})

		} else {

			return res.end("404 non found")
		}


	})
	.listen(3000, function() {
		console.log("running...");
	})

// 1.idnex.html
// 2.开放public中的静态资源 当请求/public/xxx的时候,读取响应public目录中的具体资源
// 3./post  post.html
// 4. /pinglun
//    4.1 接受变淡提交数据
//    4.2 存储变淡提交的数据
//    4.3 让变淡重定向到/
//    statusCode
//    setHeader
   
   

