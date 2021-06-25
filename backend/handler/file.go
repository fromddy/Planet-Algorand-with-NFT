package handler

import (
	"Algo/dao"
	"Algo/oss"
	util "Algo/utils"
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/spf13/viper"
	"log"
	"net/http"
	"os"
	"strconv"
)

// @Summary 上传作品
// @Produce json
// @Param address string "用户钱包地址"
// @Param sha1 string "上传作品文件sha1"
// @Param up_file file "上传的文件流“
// @Success 0 "OK"
//

func UploadHandler(c *gin.Context){
	UserAddress := c.PostForm("address")
	FileSha1 := c.PostForm("sha1")
	if UserAddress=="" || FileSha1 == ""{
		c.JSON(200,gin.H{
			"code":-1,
			"msg":"invalid parameters",
			"data":nil,
		})
		return
	}
	isExist := dao.IsUserExist(UserAddress)
	if !isExist{
		c.JSON(200,gin.H{
			"code":-1,
			"msg":"please first signup",
			"data":nil,
		})
		return
	}
	isVal := dao.IsEmailValidate(UserAddress)
	if !isVal{
		c.JSON(200,gin.H{
			"code":-1,
			"msg":"email not validate",
			"data":nil,
		})
		return
	}
	isFileExist := dao.CheckFileWhetherExist(FileSha1)
	if isFileExist{
		log.Printf("file has existed")
		c.JSON(200,gin.H{
			"code":-1,
			"msg":"file has existed",
		})
		return
	}
	fmt.Println(UserAddress,FileSha1)
	_, video, err := c.Request.FormFile("up_file")
	filename :=video.Filename
	fmt.Println(filename)

	if err != nil {
		log.Printf("Error when try to get file: %v", err)
		c.JSON(200,gin.H{
			"code":-1,
			"msg":"Error when try to get file",
		})
		return
	}

	if video == nil {
		c.JSON(http.StatusInternalServerError,gin.H{
			"code":-1,
			"msg":"server error",
		})
		return
	}
	workDir,_ :=os.Getwd()
	vl := workDir+"/tmp/"
	src := vl + filename

	if err := c.SaveUploadedFile(video, src); err != nil {
		log.Println(err)
		c.JSON(http.StatusInternalServerError,gin.H{
			"code":-1,
			"msg":"server error",
		})
		return
	}
	file3,err1 := os.Open(src)
	if err1!=nil{
		log.Println(err1)
		c.JSON(http.StatusInternalServerError,gin.H{
			"code":-1,
			"msg":"server error",
		})
		return
	}
	filesha1 :=util.FileSha1(file3)
	//一个教训，很可能在使用file3的文件流计算后，内存中权限发生了改变，因此需要申请一个新的文件句柄
	file3.Close()
	if filesha1!=FileSha1{
		c.JSON(http.StatusInternalServerError,gin.H{
			"code":-1,
			"msg":"file not valid",
		})
		return
	}
	file4,_ := os.Open(src)
	defer file4.Close()
	ossPath := "test/"+filesha1
	err3 :=oss.Bucket().PutObject(ossPath,file4)
	if err3!=nil{
		fmt.Println(err3)
		return
	}
	OssAddress := viper.GetString("oss.OSSBucket")+"."+viper.GetString("oss.OSSEndpoint")+"/"+ossPath

	c.JSON(200,gin.H{
		"code":0,
		"msg":"ok",
		"data":gin.H{
			"ossAddress":OssAddress,
		},

	})
}


func UploadASA(c *gin.Context){
	UserAddress := c.PostForm("address")
	FileSha1 := c.PostForm("sha1")
	ASAddress := c.PostForm("asaId")
	Amount := c.PostForm("amount")
	isExist := dao.IsUserExist(UserAddress)
	if !isExist{
		c.JSON(200,gin.H{
			"code":-1,
			"msg":"please first signup",
			"data":nil,
		})
		return
	}
	isValidate := dao.IsEmailValidate(UserAddress)
	if !isValidate{
		c.JSON(200,gin.H{
			"code":-1,
			"msg":"email not validate",
			"data":nil,
		})
		return
	}
	amount,err := strconv.Atoi(Amount)
	if amount<=0 || err!=nil{
		c.JSON(200,gin.H{
			"code":-1,
			"msg":"invalid price",
			"data":nil,
		})
		return
	}
	//if err!=nil{
	//	c.JSON(500,util.GetResp(-1,"internal error",nil))
	//}
	ossPath := "test/"+FileSha1
	OssAddress := viper.GetString("oss.OSSBucket")+"."+viper.GetString("oss.OSSEndpoint")+"/"+ossPath
	err = dao.CreateASA(UserAddress,FileSha1,ASAddress,OssAddress,amount)
	if err!=nil{
		c.JSON(500,util.GetResp(-1,"duplicate upload",nil))
		return
	}
	c.JSON(200,util.GetResp(0,"OK",nil))
}

func GetMany(c *gin.Context){
	limit := c.PostForm("limit")
	num,err := strconv.Atoi(limit)
	if err!=nil{
		c.JSON(500,util.GetResp(-1,"server internal error",nil))
		return
	}
	asaList,err1 := dao.GetManyFromLimit(num)
	if err1!=nil{
		c.JSON(500,util.GetResp(-1,"too big limit",nil))
		return
	}
	len := strconv.Itoa(len(asaList))
	c.JSON(200,util.GetResp(0,len,asaList))
}

func GetOne(c *gin.Context){
	AsaId := c.PostForm("asaId")
	asa := dao.MakeAsaInfoFromAsaid(AsaId)
	c.JSON(200,util.GetResp(0,"OK",asa))
}

func History(c *gin.Context){
	AsaId := c.PostForm("asaId")
	his := dao.GetTransactionHistory(AsaId)
	c.JSON(200,util.GetResp(0,strconv.Itoa(len(his)),his))
}