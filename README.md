# wsock
用于服务器主动通知客户端<br>
普通属性<br>
data-wshost	用于指示不同的主机名称，如果本项设置了值，服务器必须关闭“启用子域名”，否则基于userID的notifyUser将不能正常工作。但是基于wsID的notifyTarget会继续工作。基于这个原因，服务器不推荐使用notifyUser来通知特定用户。	<br>
data-norun	当该属性值设置为“true”时，服务器返回的命令不执行。设置为false或者其他值，命令正常执行。默认为true	"true"<br>
控制属性<br>
data--url	填写进入的房间名. "group/" + name. "group/" 是固定的,url指示了使用哪个功能，如果是群组，需要指定为“/group/群组名称”：信息会通知所有群内人员。如果是个人反向通信，使用“/user/任意字串”：即便url相同，参与者之间信道彼此隔离，不会相同。	group/test<br>
data--wsurl	增加wsock的容错，对data--wsurl的前缀/进行容错	<br>
输出属性<br>
data-x-wid	本元素的id, 这个id需要在对应请求中带上.	dc1.s1.fec4393b.3<br>
data-x-status	与服务器连接的状态. 有已连接(connected)和未链接(disconnected)	connected<br>
# 注意事项
注:控制属性 data--url： 填写进入的房间名. "group/" + name. "group/" 是固定的，  url指示了使用哪个功能，如果是群组，需要指定为“/group/群组名称”：信息会通知所有群内人员。如果是个人反向通信，使用“/user/任意字串”：即便url相同，参与者之间信道彼此隔离，不会相同。 
