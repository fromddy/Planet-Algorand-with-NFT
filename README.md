# Plant-Algorand-with-NFT

6.20-6.30期间，升级了交易合约，增加了取消订单功能，优化界面与后端。

---

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

在执行任何操作之前都需要用户连接钱包,右上角会变成用户在注册钱包时使用的昵称

![image](https://user-images.githubusercontent.com/34564669/123567594-19846b00-d7f5-11eb-995c-a65ab489b175.png)

### 用户注册功能

说是注册，其实是用户在后端绑定邮箱和其他相关信息的一个过程。需要用户选择上传头像，用户名，邮箱地址和个人介绍，在点击signup之后，用户的邮箱会收到一封验证码邮箱，需要进行验证后才能使用其他功能。

![image](https://user-images.githubusercontent.com/34564669/123567656-45075580-d7f5-11eb-8b4e-90040248f210.png)

### 创建NFT功能

任何注册好的用户都可以上传NFT，上传之后依次点击三个按钮可以得到唯一的asset index，并且asset的note中会存有该图片在阿里云oss中的存储地址和文件哈希，以确保你的asa是独一无二的。

![image](https://user-images.githubusercontent.com/34564669/123567682-551f3500-d7f5-11eb-956e-f9ebb217a321.png)

### 查看所有资产

asset界面可以展示你所拥有的全部NFT，包括你购买得到的和你上传的。

![image](https://user-images.githubusercontent.com/34564669/123567792-8992f100-d7f5-11eb-8073-b57977df6dc6.png)

### 挑选你心仪的NFT作品

首页功能会随机刷新7张NFT，可以选择你喜欢的NFT进入购买界面购买。

![image](https://user-images.githubusercontent.com/34564669/123567879-bcd58000-d7f5-11eb-90a0-afc7673b9778.png)

### NFT交易功能

在商品详情界面你可以购买你想要的NFT，这一步利用了Algorand的智能合约的原子交易功能，在正常交易流程下，用户选择好NFT之后会向生成的合约地址中打钱，然后由卖家签名ASA转账的交易，最后交易完成。当然交易的第一步是要求首先添加这个ASA。

交易的第一步是添加该ASA的过程，也就是add to my like list

![image](https://user-images.githubusercontent.com/34564669/123568117-3c634f00-d7f6-11eb-8f29-288df506b69f.png)

等待上一个交易的过程被确认之后，就可以进行向合约支付的过程，也就是bid

![image](https://user-images.githubusercontent.com/34564669/123568230-7af90980-d7f6-11eb-84db-676ddaea41d1.png)

你可以在bid界面查看你所有已经支付的订单。

![image](https://user-images.githubusercontent.com/34564669/123568298-9a903200-d7f6-11eb-81e4-6280f749ed96.png)

在买家完成支付之后，卖家会收到一封通知邮件，在卖家去order界面确认订单之后，整个交易过程结束。

![image](https://user-images.githubusercontent.com/34564669/123569697-6d914e80-d7f9-11eb-8def-32a89a89587b.png)

![image](https://user-images.githubusercontent.com/34564669/123570837-a03c4680-d7fb-11eb-96b6-43d9046addb3.png)

### 取消订单功能

在bid界面你可以查看全部的已支付的订单，并且可以选择取消订单，从合约中取走资金，并且之前被购买锁定的NFT会重新允许购买

![image](https://user-images.githubusercontent.com/34564669/123569814-a0d3dd80-d7f9-11eb-97e7-42f4daa39a56.png)

### 二次出售功能

对于你购买到的NFT，你可以选择在collect界面进行二次定价和出售

![image](https://user-images.githubusercontent.com/34564669/123570932-c530b980-d7fb-11eb-955b-1694098ca723.png)

## TODO List

* 将前端迁移至react
* 允许alice在一段时间之后可以撤回交易（已完成）
* 允许用户重新定价NFT并且出售（已完成）
* 在展示界面可以一次性获取多个随机作品。（已完成）

