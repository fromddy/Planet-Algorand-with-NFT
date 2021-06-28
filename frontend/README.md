## Planet-Algorand-with-NFT

maybe 战队

我们实现了一个在algorand上进行NFT交易的平台，用户可以上传和购买NFT作品。



前端主要采用了html, javascript 和 bootstrap3库;

后端主要使用了go语言和gin框架。



github地址：https://github.com/fromddy/Planet-Algorand-with-NFT

demo地址： http://101.133.135.126:8080/public/



前后的代码均已上传到github

为了展示的方便，所以直接将前端部分的代码发送给学长。

后端部分的代码已经部署在服务器上，前端可以直接访问。



首先要求系统装有node.js, 可以运行npm命令。

在本目录下打开命令行，输入如下代码：

```js
npm install 
npm install http-server 
http-server . 
```

就可以在浏览器中打开对应的地址查看网页了。

**注意，浏览器需要保持网络通畅，可以访问国外的网站，同时浏览器安装有AlgoSigner钱包。**

推荐使用 带有AlgoSigner的chrome浏览器。



网页简介

详细的网页介绍见github.com 上的README.md文件

访问网站需要首先点击右上角的account进行钱包地址的选择，

然后在sign up界面完成注册 和 邮箱的绑定和验证。

upload界面用于上传作品，上传的作品会在voyage界面随机展示。

之后 star界面和 collect界面分别显示 用户 传作的NFT作品和用户拥有的NFT作品。

voyage界面用来欣赏高清大图，同时从上到下点击按钮，完成出价(bid)的过程，之后拥有该作品的用户会收到一封邮件。

如果有用户的作品被人购买的话，那么在order界面就会显示订单，我们这里的假设是拥有画作的用户一定会出售该作品，所以会点击accept，从而实现把NFT传给出价的用户，以及从用户发起的智能合约中获得对应的algos代币。

sell 界面原计划是 在collect 的画作上添加 sell按钮，这样就可以进行二次出售，由于时间紧张，暂未实现。

具体的交互过程也设置有很多贴心的小提示，希望Planet平台能给您带来良好的体验。









