package handler

import (
	"Algo/cache"
	"Algo/dao"
	"Algo/model"
	"Algo/oss"
	util "Algo/utils"
	"fmt"
	"github.com/garyburd/redigo/redis"
	"github.com/gin-gonic/gin"
	"github.com/spf13/viper"
	"log"
	"net/http"
	"os"
	"strconv"
)

func ProfileHandler(c *gin.Context){
	Address := c.PostForm("address")
	Introduction := c.PostForm("introduction")
	UserName := c.PostForm("userName")
	Email := c.PostForm("email")
	_, avatar, err := c.Request.FormFile("up_avatar")
	if Address=="" || Email == ""{
		c.JSON(200,gin.H{
			"code":-1,
			"msg":"invalid parameters",
			"data":nil,
		})
		return
	}
	isEmail := dao.IsEmailUsed(Email)
	if isEmail{
		c.JSON(200,gin.H{
			"code":-1,
			"msg":"email has been used",
			"data":nil,
		})
		return
	}
	filename :=avatar.Filename
	fmt.Println(filename)
	if err != nil {
		log.Printf("Error when try to get file: %v", err)
		c.JSON(200,gin.H{
			"code":-1,
			"msg":"Error when try to get file",
		})
		return
	}

	if avatar == nil {
		c.JSON(http.StatusInternalServerError,gin.H{
			"code":-1,
			"msg":"server error",
		})
		return
	}
	workDir,_ :=os.Getwd()
	vl := workDir+"/avatar/"
	src := vl + filename

	if err := c.SaveUploadedFile(avatar, src); err != nil {
		log.Println(err)
		c.JSON(http.StatusInternalServerError,gin.H{
			"code":-1,
			"msg":"server error",
		})
		return
	}

	file4,_ := os.Open(src)
	defer file4.Close()
	ossPath := "avatar/"+Address
	err3 :=oss.Bucket().PutObject(ossPath,file4)
	if err3!=nil{
		fmt.Println(err3)
		return
	}
	OssAddress :=viper.GetString("oss.OSSBucket")+"."+viper.GetString("oss.OSSEndpoint")+"/"+ossPath
	avatarAddress := OssAddress
	var tmpUser model.User
	tmpUser.Address =Address
	tmpUser.Introduction = Introduction
	tmpUser.Avatar = avatarAddress
	tmpUser.Email = Email
	tmpUser.UserName = UserName
	dao.CreateUser(tmpUser)
	code :=util.RandomCode()
	result := util.SendValidationCode(Email,code)
	if !result{
		c.JSON(http.StatusInternalServerError,gin.H{
			"code":-1,
			"msg":"server error",
		})
		return
	}
	rConn := cache.RedisPool().Get()//连接池中获取
	defer rConn.Close()
	rConn.Do("SET",Email,code)
	c.JSON(200,gin.H{
		"code":0,
		"msg":"ok",
		"data":gin.H{
			"ossAddress":OssAddress,
		},

	})

}

func ListAllCreator(c *gin.Context){
	address := c.PostForm("address")
	if address=="" {
		c.JSON(200,gin.H{
			"code":-1,
			"msg":"invalid parameters",
			"data":nil,
		})
		return
	}
	file,err := dao.ListAllCreator(address)
	if err!=nil{
		c.JSON(404,util.GetResp(-1,"user not exists",nil))
		return
	}
	len := strconv.Itoa(len(file))
	c.JSON(200,util.GetResp(0,len,file))
}

func ListAllOwner(c *gin.Context){
	address := c.PostForm("address")
	if address=="" {
		c.JSON(200,gin.H{
			"code":-1,
			"msg":"invalid parameters",
			"data":nil,
		})
		return
	}
	file,err := dao.ListAllOwner(address)
	if err!=nil{
		c.JSON(404,util.GetResp(-1,"user not exists",nil))
		return
	}
	len := strconv.Itoa(len(file))
	c.JSON(200,util.GetResp(0,len,file))
}

func ValidateEmail(c *gin.Context){
	code := c.PostForm("code")
	email := c.PostForm("email")
	fmt.Println(code+" : "+email)
	if email=="" || code == ""{
		c.JSON(200,gin.H{
			"code":-1,
			"msg":"invalid parameters",
			"data":nil,
		})
		return
	}
	rConn := cache.RedisPool().Get()//连接池中获取
	defer rConn.Close()
	codeRedis, err := redis.String(rConn.Do("GET", email))
	if err != nil {
		fmt.Println("redis get failed:", err)
		return
	} else {
		fmt.Printf("Get mykey: %v \n", codeRedis)

	}
	if codeRedis==code{
		result := dao.ChangeUserStatus(email)
		if !result{
			c.JSON(200,gin.H{
				"code":-1,
				"msg":"no such user",
				"data":nil,
			})
			return
		}
		c.JSON(200,gin.H{
			"code":0,
			"msg":"OK",
			"data":nil,
		})
	}else{
		c.JSON(200,gin.H{
			"code":-1,
			"msg":"code not correct",
			"data":nil,
		})
	}

}

func QueryUser(c *gin.Context){
	address := c.PostForm("address")
	result := dao.IsUserExist(address)
	if !result{
		c.JSON(200,gin.H{
			"code":2,
			"msg":"no such user",
			"data":nil,
		})
		return
	}
	user,err := dao.GetUserInfo(address)
	if err!=nil || user==(model.User{}) {
		c.JSON(200,gin.H{
			"code":2,
			"msg":"no such user",
			"data":nil,
		})
		return
	}
	if user.Status ==1{
		c.JSON(200,gin.H{
			"code":0,
			"msg":"OK",
			"data":user,
		})
		return
	}else {
		c.JSON(200,gin.H{
			"code":1,
			"msg":"email not validate",
			"data":user,
		})
		return
	}
}