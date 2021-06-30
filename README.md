# Planet-Algorand-with-NFT

项目名称：Planet

战队名称：maybe战队

Algorand黑客松挑战主题： 基于区块链的虚拟物品交易平台

我们实现了一个**基于Algorand区块链的NFT交易平台**。

前端主要使用的是html，javascript 和 bootstrap3，后端主要使用go语言和gin框架，

和Algorand区块链的交互都是在TestNet中进行。

为了展示的方便，我们直接将前后端的代码部署到了服务器上，

这里有直接展示的demo地址：[Planet-demo](http://101.133.135.126:8080/public/)  ：）

需要注意的是，浏览器（推荐使用chrome）需要保持网络通畅，可以访问国外的网站，同时浏览器安装有AlgoSigner钱包。

## 如何使用

如果你想本地运行程序的话，也可以选择将github仓库中的代码下载到本地，按照如下的操作指南进行操作。

### 前端代码的使用

#### 基本要求

运行前端代码要求安装有node.js环境， 命令行当中可以执行npm的命令。

浏览器（推荐使用chrome）需要保持网络通畅，可以访问国外的网站。

浏览器安装有AlgoSigner钱包。

#### 前端代码的具体操作

下载本仓库的代码文件，打开frontend文件夹,

在该文件夹目录下打开命令行，输入如下命令

```
npm install
npm install http-server 
http-server .
```

就可以在对应的地址查看前端网页了 : ）

注意：现在的前端代码所访问的后端接口是定位到我们所运行的服务器上的。由于后端的配置是较为复杂的，所以我们**强烈推荐**用户通过我们所提供的 [Planet-demo](http://101.133.135.126:8080/public/) 来进行体验。

如果想要更换为本地运行的后端服务，前端部分需要打开 frontend/utility文件夹，把该文件夹下所有js文件中的url接口地址修改为本地运行的后端服务的接口地址。

### 后端代码的使用

服务端需要配置mysql和redis，mysql版本推荐使用5.7，其中并不需要创建数据表，gorm会自动迁移表。

```
mysql: create database AlgoServer charset=utf8;
redis: config set requirepass test123
```

下载代码 go build之后得到可执行的server文件,编译所需要的依赖详见go.mod文件，
在服务端文件根目录下新建四个个文件夹

```
mkdir avatar # 暂存用户头像
mkdir tmp # 暂存用户上传的ntf作品
mkdir config # 配置文件存放处
mkdir static # 前端页面存放处
```

config文件夹下需要编辑application.yaml文档，模板代码中已给出，

主要配置mysql的连接以及阿里云oss的配置和后端邮箱服务的配置,redis的配置在cache文件夹下的redis.go中，

创建和配置好数据库之后直接运行后端即可。

访问xxxx:8080/public/index.html即可看到页面。

后端文档和具体接口使用在https://hackmd.summershrimp.com/iF-HJ2YYTw-9Y5AaJRthOg?both 

这里可以看到，static目录中应该存的是整个前端的文件夹，配置好的目录结构如下 (将仓库中的frontend文件夹改名为genesis，然后放入static文件夹中即可）

![image](https://user-images.githubusercontent.com/34564669/122196534-e45d4c00-cec9-11eb-818e-3bf2f88087f1.png)





## 功能演示

### 主页（Planet）

打开网址首先看到的就是 Planet页面，处于销售状态的NFT作品会在这里随机地被展示。

如果想要购买的话，需要点击右上角的account，注册完成和邮箱通过验证的用户会看到自己的注册昵称显示在了右上角。

之后点击自己心仪的NFT作品 对应的 [check]按钮，就可以跳转到 voyage页面 进行更为清晰地查看和购买。

![pic4](https://user-images.githubusercontent.com/25214732/123894096-2ab5af00-d990-11eb-9990-b800e3bb2028.png)

<br>


### 用户注册（signup） 和 连接钱包（account）

除了Planet页面 和 voyage页面 所提供的NFT作品基础展示功能以外，其他所有的操作都需要用户连接钱包（比如NFT作品的购买等）。

点击右上角的account按钮，就会进行钱包的连接，可以选择对应的钱包地址（现阶段是TestNet上的账户），

如果之前已经注册并且通过了邮箱验证的话，右上角会变成用户注册提供的昵称；

初次登录的话，需要用户在signup界面进行注册，提交必要的信息后点击 [ come up to sign up ! ] 按钮，用户邮箱就会收到验证码；

将用户邮箱当中的注册码填入下方的 email verification code 输入框中，点击 [ come up to verify email ! ] 按钮 就完成了邮箱的验证。

完成信息注册和邮箱验证的用户才能够方便地使用我们所提供的后续的服务 ：）

![pic1](https://user-images.githubusercontent.com/25214732/123894105-2ee1cc80-d990-11eb-9e95-5fcc5612af61.png)


### 上传NFT作品 (upload)

upload页面实现上传NFT作品的功能， 完成信息注册和邮箱验证的用户可以拥有上传NFT作品的权限。

上传NFT和输入预期价格之后，点击 [ get your permission ] 按钮，在AlgoSigner钱包弹出的页面当中点击确认就可以进行NFT作品的创建，这个过程包括了将图片传送到阿里云oss服务，后端给前端返回图片存储地址，用户确认创建包含NFT信息的ASA 这三个具体的流程，用户可能需要稍微耐心的等待一小段时间。

之后点击 [ get your NFT unique ID ] 按钮，如果出现需要等待一段时间的提示，就等待5秒之后再次点击该按钮，直到出现 具体的 NFT的ID号，这里的NFT ID，就是 包含NFT信息的ASA的ID，用户可以在钱包当中的Assets处根据对应的ID进行查看。

最后点击 [ create your NFT ] 按钮，出现绿色的提示框表明NFT作品已经创建成功了 ：）用户可以按照提示在asset页面的Created处查看自己创作的作品。

![pic2](https://user-images.githubusercontent.com/25214732/123894124-343f1700-d990-11eb-9190-f95897fb8de8.png)




### 查看资产（asset）

在asset页面中点击 Created 按钮 后，下方会显示用户自己创作的NFT作品；

在asset页面点击 Collected按钮 后，下方会显示用户购买的NFT作品； 

点击上方导航栏的asset后默认显示的是 Created 的作品。

![pic3](https://user-images.githubusercontent.com/25214732/123894138-386b3480-d990-11eb-9599-935b97bd9f6a.png)

<br>


对于单独的NFT作品来说，点击 [ check ] 按钮后会跳转到voyage页面，进行单独的展示；

在Collected中的NFT作品还有[ sell ] 按钮，代表二次出售，点击之后会跳转到 sell页面，用户可以重新定价。

![pic5](https://user-images.githubusercontent.com/25214732/123894151-3bfebb80-d990-11eb-8c92-839af1e66b42.png)






### NFT交易（voyage, bid, order）

在交易部分，为了理解上的方便，我们把拥有Algo币的买家称作Alice，拥有NFT作品的卖家称作Bob。

买家Alice可以在voyage页面对NFT作品进行购买。 

注意： voyage页面本身也承担了高清展示NFT作品的任务，点击导航栏处的voyage，或者最下方的 [change to another one ]按钮 就可以显示另外的NFT作品 ：）

NFT的交易利用了Algorand的智能合约的原子交易功能，在正常交易流程下，买家选择好NFT之后会向生成的合约地址中打钱，然后由卖家签名ASA转账的交易，最后交易完成。

交易的第一步是买家Alice点击 [ add to my list list ] 按钮，添加NFT作品对应的ASA到自己的钱包。

![pic6](https://user-images.githubusercontent.com/25214732/123894164-415c0600-d990-11eb-951d-4ebab2dd1722.png)


等待出现 Transaction confirmed in round xxxx 的提示后，点击 [bid] 按钮，买家Alice向托管的智能合约进行转账。

![pic7](https://user-images.githubusercontent.com/25214732/123894173-4456f680-d990-11eb-9cf2-1ee537fd56f6.png)


在买家Alice完成支付之后，卖家Bob的注册邮箱会收到一封通知邮件，提醒Bob到Order页面进行订单的确认。




卖家Bob打开order页面，点击 [accept] 按钮之后稍等一段时间，NFT就会转移给买家Alice，同时卖家Bob从托管的智能合约中获得对应的Algo币。

![pic8](https://user-images.githubusercontent.com/25214732/123894189-4a4cd780-d990-11eb-877c-baaecd91c7ff.png)



卖家Alice可以在bid页面查看已经支付并且买家Bob还没有确认的的订单。

卖家Alice点击[withdraw]按钮后会取消对应的订单，等待操作在区块链上被confirm后，Alice会从托管的智能合约中收回资金，之前被锁定的NFT作品会重新允许购买。

![pic9](https://user-images.githubusercontent.com/25214732/123894198-4e78f500-d990-11eb-85e3-7dd64e0f6fbc.png)









## 任务记录

2021.6.20-2021.6.30，升级了交易合约，增加了取消订单功能，优化界面与后端。



## Todo List

* 对于智能合约和前后端代码进行充分的测试
* 美化alert弹出的窗口
* 将前端迁移至react
* 允许alice在一段时间之后可以撤回交易（已完成）
* 允许用户重新定价NFT并且出售（已完成）
* 在展示界面可以一次性获取多个随机作品。（已完成）
