package main

import (
	"Algo/cache"
	"Algo/common"
	"Algo/global"
	"Algo/handler"
	"fmt"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/spf13/viper"
	"log"
	"net/http"
	"os"
)
func init(){
	InitConfig()
	global.DBEngine = common.InitDB()
	common.GetUserInfoToCache()
}

func InitConfig(){
	workDir,_ :=os.Getwd()
	viper.SetConfigName("application")
	viper.SetConfigType("yml")
	viper.AddConfigPath(workDir+"/config")
	err :=viper.ReadInConfig()
	if err!=nil{
		log.Println("read config failed")
	}
}
func RegistHandler()*gin.Engine{
	r := gin.Default()
	r.Use(cors.Default())
	r.StaticFS("/public", http.Dir("./static/genesis"))
	r.POST("/upload",handler.UploadHandler)
	r.POST("/upload/asa",handler.UploadASA)
	r.POST("/signup",handler.ProfileHandler)
	r.POST("/bid",handler.CreateTransaction)
	r.POST("/success",handler.FinishTransaction)
	r.POST("/one",handler.GetOne)
	r.POST("/list",handler.GetMany)
	r.POST("/sell",handler.SellASA)
	r.POST("/listcreate",handler.ListAllCreator)
	r.POST("/listown",handler.ListAllOwner)
	r.POST("/validate",handler.ValidateEmail)
	r.POST("/userinfo",handler.QueryUser)
	r.POST("/order",handler.GetAllOrders)
	r.POST("/history",handler.History)
	r.POST("/withdraw",handler.CancelTransaction)
	r.POST("/payed",handler.GetPayedTrans)
	return r
}
func main(){
	rConn := cache.RedisPool().Get()
	rConn.Do("SET","1","2")
	defer rConn.Close()
	fmt.Println("rConn",rConn)
	fmt.Println("DBEngine",global.DBEngine)
	r := RegistHandler()
	r.Run(":8080")
}
