package handler

import (
	"Algo/dao"
	util "Algo/utils"
	"fmt"
	"github.com/gin-gonic/gin"
	"strconv"
)

func CreateTransaction(c *gin.Context){
	AliceAddress := c.PostForm("aliceAddress")
	BobAddress := c.PostForm("bobAddress")
	amout := c.PostForm("amount")
	ContractAddress :=c.PostForm("hash")
	Contract :=c.PostForm("contract")
	AsaId := c.PostForm("asaId")
	isExist := dao.IsUserExist(AliceAddress)
	if !isExist{
		c.JSON(200,gin.H{
			"code":-1,
			"msg":"please first signup",
			"data":nil,
		})
		return
	}
	isValidate := dao.IsEmailValidate(AliceAddress)
	if !isValidate{
		c.JSON(200,gin.H{
			"code":-1,
			"msg":"email not validate",
			"data":nil,
		})
		return
	}
	isValidate = dao.IsEmailValidate(BobAddress)
	if !isValidate{
		c.JSON(200,gin.H{
			"code":-1,
			"msg":"email not validate",
			"data":nil,
		})
		return
	}
	isExist = dao.IsUserExist(BobAddress)
	if !isExist{
		c.JSON(200,gin.H{
			"code":-1,
			"msg":"please first signup",
			"data":nil,
		})
		return
	}
	Amout,err := strconv.Atoi(amout)
	if err!=nil || Amout <=0{
		c.JSON(200,gin.H{
			"code":-1,
			"msg":"invalid price",
			"data":nil,
		})
		return
	}
	result := dao.CheckAuth(BobAddress,AsaId)
	if result{
		c.JSON(500,util.GetResp(-1,"you do not own this asa",nil))
		return
	}
	err =dao.CreateTransaction(AliceAddress,BobAddress,amout,ContractAddress,Contract,AsaId)
	if err!=nil{
		c.JSON(500,util.GetResp(-1,"fail to create transaction",nil))
		return
	}
	emailAddress := dao.GetEmailFromAddress(BobAddress)
	fmt.Println(emailAddress)
	if emailAddress ==""{
		c.JSON(401,util.GetResp(-1,"fail to get email",nil))
		return
	}
	result1 := util.SendEmail(emailAddress,Contract,ContractAddress,AliceAddress)
	if result1{
		fmt.Println("email has been send")
	}
	c.JSON(200,util.GetResp(0,"OK",nil))

}

func FinishTransaction(c *gin.Context){
	AliceAddress := c.PostForm("aliceAddress")
	BobAddress := c.PostForm("bobAddress")
	AsaId := c.PostForm("asaId")
	isExist := dao.IsUserExist(AliceAddress)
	if !isExist{
		c.JSON(200,gin.H{
			"code":-1,
			"msg":"please first signup",
			"data":nil,
		})
		return
	}
	isValidate := dao.IsEmailValidate(AliceAddress)
	if !isValidate{
		c.JSON(200,gin.H{
			"code":-1,
			"msg":"email not validate",
			"data":nil,
		})
		return
	}
	isValidate = dao.IsEmailValidate(BobAddress)
	if !isValidate{
		c.JSON(200,gin.H{
			"code":-1,
			"msg":"email not validate",
			"data":nil,
		})
		return
	}
	isExist = dao.IsUserExist(BobAddress)
	if !isExist{
		c.JSON(200,gin.H{
			"code":-1,
			"msg":"please first signup",
			"data":nil,
		})
		return
	}
	result := dao.CheckAuth(BobAddress,AsaId)
	if result{
		c.JSON(500,util.GetResp(-1,"you do not own this asa",nil))
		return
	}
	err := dao.ChangeUserFile(AliceAddress,BobAddress,AsaId)

	if err!=nil{
		c.JSON(500,util.GetResp(-1,"fail to update the transaction",nil))
		return
	}
	err = dao.UpdateTranStatus(AliceAddress,BobAddress,AsaId)

	if err!=nil{
		c.JSON(500,util.GetResp(-1,"fail to update the transaction",nil))
		return
	}
	c.JSON(200,util.GetResp(0,"OK",nil))
}

func SellASA(c *gin.Context){
	Address := c.PostForm("address")
	asaId := c.PostForm("asaId")
	amout := c.PostForm("amout")
	isExist := dao.IsUserExist(Address)
	if !isExist{
		c.JSON(200,gin.H{
			"code":-1,
			"msg":"please first signup",
			"data":nil,
		})
		return
	}
	isValidate := dao.IsEmailValidate(Address)
	if !isValidate{
		c.JSON(200,gin.H{
			"code":-1,
			"msg":"email not validate",
			"data":nil,
		})
		return
	}
	price,err := strconv.Atoi(amout)
	if err!=nil || price <=0{
		c.JSON(200,gin.H{
			"code":-1,
			"msg":"invalid price",
			"data":nil,
		})
		return
	}
	//实际上要做的只是去userfile表里更新价格
	//需要检查的一部就是判断是否拥有asa
	result := dao.CheckAuth(Address,asaId)
	if result{
		c.JSON(500,util.GetResp(-1,"you do not own this asa",nil))
		return
	}
	err1 := dao.ChangeUserFilePrice(asaId,price)
	if err1!=nil{
		c.JSON(500,util.GetResp(-1,"internal error",nil))
		return
	}
	c.JSON(200,util.GetResp(0,"OK",nil))
}

func Orders(c *gin.Context){
	AliceAddress := c.PostForm("aliceAddress")
	BobAddress := c.PostForm("bobAddress")
	AsaId := c.PostForm("asaId")
	if AliceAddress==""||BobAddress==""||AsaId==""{
		c.JSON(200,gin.H{
			"code":-1,
			"msg":"invalid parameters",
			"data":nil,
		})
		return
	}
	tran,err := dao.GetOrder(AliceAddress,BobAddress,AsaId)
	if err!=nil{
		c.JSON(200,gin.H{
			"code":-1,
			"msg":"no such transaction",
			"data":nil,
		})
		return
	}
	c.JSON(200,gin.H{
		"code":0,
		"msg":"OK",
		"data":tran,
	})
	return

}

func GetAllOrders(c *gin.Context){
	bobAddress := c.PostForm("bobAddress")
	if bobAddress==""{
		c.JSON(200,gin.H{
			"code":-1,
			"msg":"invalid parameters",
			"data":nil,
		})
		return
	}
	trans,err := dao.GetAllOrder(bobAddress)
	if err!=nil{
		c.JSON(200,gin.H{
			"code":-1,
			"msg":"no such transaction exists",
			"data":nil,
		})
		return
	}
	c.JSON(200,gin.H{
		"code":0,
		"msg":"OK",
		"data":trans,
	})

}