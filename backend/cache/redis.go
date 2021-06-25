package cache

import (
"fmt"
"github.com/garyburd/redigo/redis"
	"github.com/spf13/viper"
	"log"
	"os"
	"time"

)
//已完成 邮箱验证码迁移至redis
// token迁移至redis
var(
	pool *redis.Pool
	redisHost = "127.0.0.1:6379"
	redisPass = "test123"
)

func newRedisPool() *redis.Pool{
	return &redis.Pool{
		Dial: func()(redis.Conn,error){
			c,err :=redis.Dial("tcp",redisHost)
			if err !=nil{
				fmt.Println(err)
				return nil, err
			}
			if _,err=c.Do("AUTH",redisPass);err!=nil{
				c.Close()
				return nil, err
			}
			return c,nil
		},
		TestOnBorrow: func(c redis.Conn, t time.Time) error{
			if time.Since(t)<time.Minute{
				return nil
			}
			_,errcon := c.Do("PING")
			return errcon
		},
		MaxIdle:         50,
		MaxActive:       30,
		IdleTimeout:     300*time.Second,
		Wait:            false,
	}
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
func init(){
	InitConfig()

	pool =newRedisPool()

}

func RedisPool() *redis.Pool{
	return pool
}
