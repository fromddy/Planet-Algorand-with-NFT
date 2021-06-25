package common

import (
	"Algo/model"
	"fmt"
	_ "github.com/go-sql-driver/mysql"
	"github.com/jinzhu/gorm"
	"github.com/spf13/viper"
	"log"
)

func InitDB() *gorm.DB {
	//fmt.Println(viper.GetString("datasource.driverName"))
	driverName := viper.GetString("datasource.driverName")
	host := viper.GetString("datasource.host")
	port := viper.GetString("datasource.port")
	database := viper.GetString("datasource.database")
	username :=viper.GetString("datasource.username")
	password := viper.GetString("datasource.password")
	charset := viper.GetString("datasource.charset")
	dsn := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?charset=%s&parseTime=true",
		username,
		password,
		host,
		port,
		database,
		charset,
	)
	log.Println(dsn)
	//dsn := "root:001228@tcp(127.0.0.1:3306)/ginVueTest?charset=utf8mb4&parseTime=True&loc=Local"
	db, err := gorm.Open(driverName, dsn)

	if err != nil {
		log.Printf("data base connect failed %v",err)
	}
	db.LogMode(true)
	db.AutoMigrate(&model.User{})
	db.AutoMigrate(&model.UserFile{})
	db.AutoMigrate(&model.Transaction{})
	db.AutoMigrate(&model.File{})
	//标签加数据表迁移真好用
	return db
}