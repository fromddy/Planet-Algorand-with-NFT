package oss

import (
	"fmt"
	"github.com/aliyun/aliyun-oss-go-sdk/oss"
	"github.com/spf13/viper"
)

var ossCli *oss.Client

func OssClient() *oss.Client{
	if ossCli!=nil{
		return ossCli
	}
	ossCli,err :=oss.New(viper.GetString("oss.OSSEndpoint"),viper.GetString("oss.OSSAccessKeyID"),viper.GetString("oss.OSSAccessKeySecret"))
	if err!=nil{
		fmt.Println(err.Error())
		return nil
	}
	return ossCli
}

func Bucket() *oss.Bucket{
	cli:=OssClient()
	if cli!=nil{
		bucket,err := cli.Bucket(viper.GetString("oss.OSSBucket"))
		if err!=nil{
			fmt.Println(err)
			return nil
		}
		return bucket
	}
	return nil
}
