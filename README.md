# ds特征测试
----

## record_permission_test

用于测试 valve permission 对record订阅权限的影响。valve中可以使用user.id来引用访问者的名称的，这个测试就是通在record中动态的放置使用者的名称，来测试该使用者对record的访问能力。


###测试结果和结论：

首先，valve可以尽责的实现可预想的访问控制，对于使用record内容来实施对角色的鉴定也是完全可行。

其次，record的subscribe是一个一次性动作，订阅成功之后，即使record内容变化，订阅者失去订阅权力，也依然可以继续享受订阅之后的通知服务。

再其次，在客户端本地，即使没有写权限，使用set修改record，依然会触发本地的change事件，当然，有权限写入的客户端在修改record之后，依然可以通过服务端触发本地的change事件，将数据更新为真实数据。




###测试内容：

record名称为：app.catcher/queue/1234，其内容是一个数组，其中“可能”会放置 app.catch这个名字；

valve设置中 app.catcher 拥有这个record的全部权限，而app.catch则仅在record中包含其名称时才有订阅和读取的权限。

我们通过两个不同的客户端名称登录，实施相同的操作：读取订阅并且间隔5秒分三次向record写入数据，分别是 app.catch,app.catcher,app.catcher。




###测试方法：

首先，修改 permission.yml 文件，record权限附近改为：

record:
  "*":
    create: false
    write: false
    delete: false
    read: false
    listen: false
  "app.catcher/queue/$catcherID":
    create: "user.id === 'app.catcher' || _('app.catcher/queue/'+$catcherID).indexOf(user.id) > -1"
    write: "user.id === 'app.catcher'"
    read: "user.id === 'app.catcher' || _('app.catcher/queue/'+$catcherID).indexOf(user.id) > -1"
    delete: "user.id === 'app.catcher'"
    listen: "user.id === 'app.catcher'"

deepstream start -c conf/config.yml

其次在本路径运行 http-server

依次访问：record_permssion_test_1st/2nd.html，需要打开console哦。

如果首先运行2nd.html 可以看到使用app.catch登录，订阅和读取都是没法实施的；
只有先运行1st.htm，在5s内迅速运行2nd.html，才能订阅读取（不过依然没有写入权限）。之后，5s之后，1st会在record中覆盖掉app.catcher。




