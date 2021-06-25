# Plant-Algorand-with-NFT

这是Maybe战队参加algorand hackathon提交的作品，是一个基于algorand区块链的NTF交易平台，后端主要使用go语言和gin框架，前端目前使用的是bootstrap，后面可能会美化并且迁移到react上。demo地址101.133.135.126:8080/public/index.html。

## 如何使用

### 前端代码的使用

[前端部分的简介文件](https://github.com/fromddy/Planet-Algorand-with-NFT/blob/main/genesis/README.md)


下载本仓库的代码文件，打开genesis文件夹，<br>
在该文件夹目录下打开命令行，输入如下代码

```
npm install
npm install http-server 
http-server .
```

就可以在对应的浏览器查看前端网页了。
需要网络保持通畅，同时浏览器装有AlgoSigner钱包，且钱包可以正常运行。



### 后端代码的使用

下载代码 go build之后得到可执行的server文件,然后在服务端文件根目录下新建三个文件夹

```
mkdir avatar # 暂存用户头像
mkdir tmp # 暂存用户上传的ntf作品
mkdir config # 配置文件存放处
mkdir static # 前端页面存放处
```

config文件夹下需要编辑application.yaml文档，模板代码中已给出，其中主要是mysql数据库的配置，其中并不需要创建数据表，后端会自动迁移表，以及阿里云oss的配置和后端邮箱服务的配置,redis的配置在cache文件夹下的redis.go中，创建和配置好数据库之后直接运行后端即可。访问xxxx:8080/public/index.html即可看到页面。后端文档和具体接口使用在https://hackmd.summershrimp.com/iF-HJ2YYTw-9Y5AaJRthOg?both 这里可以看到，static目录中应该存的是整个前端的文件夹，配置好的目录结构如下。

![image](https://user-images.githubusercontent.com/34564669/122196534-e45d4c00-cec9-11eb-818e-3bf2f88087f1.png)


## 功能演示

### 连接钱包

在执行任何操作之前都需要用户连接钱包

![image](https://user-images.githubusercontent.com/34564669/122152396-cd9c0280-ce93-11eb-8c43-884e43c93fc7.png)


### 用户注册功能

说是注册，其实是用户在后端绑定邮箱和其他相关信息的一个过程。

![image](https://user-images.githubusercontent.com/34564669/122152509-fcb27400-ce93-11eb-8de9-77957802854b.png)

需要用户选择上传头像，用户名，邮箱地址和个人介绍，在点击signup之后，用户的邮箱会收到一封验证码邮箱，需要进行验证后才能使用其他功能。

### 创建NFT功能

任何注册好的用户都可以上传NFT，上传之后依次点击三个按钮可以得到唯一的asset index，并且asset的note中会存有该图片在阿里云oss中的存储地址和文件哈希，以确保你的asa是独一无二的。

![image](https://user-images.githubusercontent.com/34564669/122152717-469b5a00-ce94-11eb-90c0-e85e8a518754.png)

### 查看创作的所有NFT

star界面中会存有你上传过的全部NFT，其中有asaId和创作时间，但是没有价格，因为该作品的拥有人并不一定是你

![image](https://user-images.githubusercontent.com/34564669/122152956-a3971000-ce94-11eb-85ff-2a1fd3f0a8b1.png)

### 查看拥有的NTF

collect界面会保存你拥有的全部NFT，可能是买来的，也可能是创作的，总之你可以看到NFT和购买时的价格。

![image](https://user-images.githubusercontent.com/34564669/122153247-2b7d1a00-ce95-11eb-9dda-f57a004afa06.png)

### 随机刷新NFT

这个功能也就是购买界面，你可以看到别人上传的NFT和价格，并且可以进行购买，购买之前需要先添加这个asa，这一步需要签名。

![image](https://user-images.githubusercontent.com/34564669/122154270-3042cd80-ce97-11eb-82fa-4d2677dba98a.png)

在添加之后就可以进行bid，也就是购买，这一笔交易需要向合约转账，之后bob会收到一封邮件通知他有人要购买他的NFT。

![image](https://user-images.githubusercontent.com/34564669/122154320-4f415f80-ce97-11eb-81f3-aabef686cadd.png)

### 查看订单功能

这一过程中，需要bob查看订单并且给订单签名，然后订单就会完成，交易的安全性由智能合约保证。

![image](https://user-images.githubusercontent.com/34564669/122154458-a6dfcb00-ce97-11eb-9246-0b9a76bb642f.png)

确认好订单之后，alice就会拥有这个NFT以及ASA，可以在个人收藏界面看到。

![image](https://user-images.githubusercontent.com/34564669/122154605-f1f9de00-ce97-11eb-8c08-c6aafbcb680b.png)


## TODO List

* 将前端迁移至react
* 允许alice在一段时间之后可以撤回交易
* 允许用户重新定价NFT并且出售
* 在展示界面可以一次性获取多个随机作品。

