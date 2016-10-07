var express=require('express'),
	app=express(),
	server=require('http').createServer(app),
	io=require('socket.io').listen(server);
app.get('/', function (req, res) {
    res.send('welcome to chatroom');
});
//用户列表{令牌:用户名}
var user_info={};
//status状态表{令牌:状态}
var coding_status={};
io.on('connection', function(socket){
	//服务器监听message事件
	socket.on('message', function(msg){
		//服务器向[全部客户端]发送message事件
		io.sockets.emit('message', {user:user_info[socket.id],data:msg});
	});
	//服务器监听login事件-->
	socket.on('login', function(name){
		//服务器向[请求客户端]发送login事件
		socket.emit('login',{self:true,data:name});
		//服务器向[其他客户端]发送login事件
		socket.broadcast.emit('login',{self:false,data:name});
		//服务器记录[请求客户端]的令牌与用户名
		user_info[socket.id]=name;
	});
	//服务器监听coding事件-->
	socket.on('coding',function(status){
		if(status!=coding_status[socket.id]){
			//服务器向[其他客户端]发送coding事件
			socket.broadcast.emit('coding',{user:user_info[socket.id],status:status});
		}
		//服务器记录[请求客户端]的令牌与status
		coding_status[socket.id]=status
	})
});
server.listen(8080);//服务器监听8080端口
