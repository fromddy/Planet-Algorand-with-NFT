package dao

import (
	"Algo/cache"
	"Algo/global"
	"Algo/model"
	"fmt"
	"github.com/garyburd/redigo/redis"
)

func CreateUser(user model.User){
	if global.DBEngine.Create(&user).Error!=nil{
		fmt.Println("fail to create user")
	}
	rConn := cache.RedisPool().Get()//连接池中获取
	defer rConn.Close()
	rConn.Do("SET",user.Address,"0")
}
func GetEmailFromAddress(BobAddress string)string{
	var user1 model.User
	err:= global.DBEngine.Where("address = ?",BobAddress).Find(&user1).Error
	if err!=nil{
		fmt.Printf("fail to query email %v",err)
		return ""
	}
	return user1.Email
}

func GetAvatarFromAddress(address string)string{
	var tmpUser model.User
	err := global.DBEngine.Where("address = ?",address).Find(&tmpUser).Error
	if err!=nil{
		fmt.Println("fail to query avatar from db")
		return ""
	}
	return tmpUser.Avatar
}

func CheckAuth(address,asaid string) bool{
	var userFile model.UserFile
	err := global.DBEngine.Where("address = ?",address).Where("asa_id = ?",asaid).Find(&userFile).Error
	if err!=nil{
		return false
	}
	if userFile.AsaId == ""{
		return false
	}
	return false
}


func ListAllCreator(address string)([]model.File,error){
	var file []model.File
	err := global.DBEngine.Where("creator_address = ?",address).Find(&file).Error
	if err!=nil{
		return nil, err
	}
	return file,nil
}



func ListAllOwner(address string)([]model.UserFile,error){
	var file []model.UserFile
	err := global.DBEngine.Where("address = ?",address).Find(&file).Error
	if err!=nil{
		return nil, err
	}
	return file,nil
}

func IsUserExist(address string)bool{
	//var user model.User
	//err:=global.DBEngine.Where("address = ?",address).Find(&user).Error
	//if err!=nil{
	//	return false
	//}
	rConn := cache.RedisPool().Get()//连接池中获取
	defer rConn.Close()
	_, err := redis.String(rConn.Do("GET", address))
	if err!=nil{
		fmt.Println("no such user")
		return false
	}
	return true
}

func IsEmailValidate(address string)bool{
	//var user model.User
	//err :=global.DBEngine.Where("address = ?",address).Find(&user).Error
	//if err!=nil{
	//	return false
	//}
	//if user.Status !=1 {
	//	return false
	//}
	rConn := cache.RedisPool().Get()//连接池中获取
	defer rConn.Close()
	statusRedis, err := redis.String(rConn.Do("GET", address))
	if err!=nil{
		fmt.Println("no such user")
		return false
	}
	if statusRedis == "0"{
		return false
	}
	return true
}

func ChangeUserStatus(email string)bool{
	var user model.User
	err := global.DBEngine.Where("email = ?",email).Find(&user).Error
	if err!=nil{
		return false
	}
	if user == (model.User{}){
		return false
	}
	user.Status = 1
	global.DBEngine.Save(&user)
	rConn := cache.RedisPool().Get()//连接池中获取
	defer rConn.Close()
	rConn.Do("SET",user.Address,"1")
	//同时更新
	return true
}

func IsEmailUsed(email string) bool{
	var user model.User
	err := global.DBEngine.Where("email = ?",email).Find(&user).Error
	if err!=nil{
		return false
	}
	if user == (model.User{}){
		return false
	}
	return true
}

func GetUserInfo(address string)(model.User,error){
	var user model.User
	err := global.DBEngine.Where("address = ?",address).Find(&user).Error
	if err!=nil{
		return model.User{},err
	}
	return user,nil
}

//
//func GetAvatarFromOwner(asaid string) string{
//	var tmpUserFile model.UserFile
//	err := global.DBEngine.Where("asa_id = ?",asaid).Find(&tmpUserFile).Error
//	if err!=nil{
//		fmt.Println("fail to query avatar from db1")
//		return ""
//	}
//	address := tmpUserFile.Address
//	var tmpUser model.User
//	err1 := global.DBEngine.Where("address = ?",address).Find(&tmpUser).Error
//	if err1!=nil{
//		fmt.Println("fail to query avatar from db2")
//		return ""
//	}
//	return tmpUser.Avatar
//}
//
//file,userfile,err := dao.GetFileFromAsaId(AsaId)
//if err!=nil{
//c.JSON(500,util.GetResp(-1,"fail to find this asa",nil))
//return
//}
//asa :=&model.AsaInfo{
//OssAddress:    file.OssAddress,
//OwnerAvatar:    dao.GetAvatarFromAddress(userfile.Address),
//CreatorAvatar:  dao.GetAvatarFromAddress(file.CreatorAddress),
//OwnerAddress:   userfile.Address,
//CreatorAddress: file.CreatorAddress,
//Price:          userfile.Money,
//}
//c.JSON(200,util.GetResp(0,"OK",asa))