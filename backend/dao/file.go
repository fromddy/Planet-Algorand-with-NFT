package dao

import (
	"Algo/global"
	"Algo/model"
	"errors"
	"fmt"
)

//func InsertUser(username,email,introduction string){
//	var user model.User
//
//}

func CreateASA(Useraddress,filesha1,ASAddress,OssAddress string,amount int) error{
	var file model.UserFile
	file.FileHash = filesha1
	file.AsaId = ASAddress
	file.Address = Useraddress
	file.Money = amount
	if global.DBEngine.Create(&file).Error !=nil{
		fmt.Println("fail to insert file")
		return errors.New("duplicate upload")
	}
	var file1 model.File
	file1.AsaId = ASAddress
	file1.FileHash = filesha1
	file1.CreatorAddress = Useraddress
	file1.OssAddress = OssAddress
	global.DBEngine.Create(&file1)

	return nil

}

func ChangeUserFile(AliceAddress,BobAddress,AsaId string)error{
	var userFile model.UserFile
	err := global.DBEngine.Where("address = ?",BobAddress).Where("asa_id = ?",AsaId).Find(&userFile).Error
	if err!=nil{
		return err
	}
	userFile.Address = AliceAddress
	global.DBEngine.Save(&userFile)
	return nil
}

func GetFileFromAsaId(asaId string) (model.File,model.UserFile,error){
	var asaFile model.UserFile
	err :=global.DBEngine.Where("asa_id = ?",asaId).Find(&asaFile).Error
	if err !=nil{
		return model.File{},model.UserFile{},err
	}
	var creatorInfo model.File
	err1 :=global.DBEngine.Where("asa_id = ?",asaId).Find(&creatorInfo).Error
	if err1 !=nil{
		return model.File{},model.UserFile{},err
	}

	return creatorInfo,asaFile,nil
}
func MakeAsaInfoFromAsaid(asaId string) model.AsaInfo{
	file,userfile,err := GetFileFromAsaId(asaId)
	if err!=nil{
		fmt.Println("fail to find this asa")
		return model.AsaInfo{}
	}
	asa :=&model.AsaInfo{
		AsaId: asaId,
		OssAddress:    file.OssAddress,
		OwnerAvatar:    GetAvatarFromAddress(userfile.Address),
		CreatorAvatar:  GetAvatarFromAddress(file.CreatorAddress),
		OwnerAddress:   userfile.Address,
		CreatorAddress: file.CreatorAddress,
		Price:          userfile.Money,
	}
	return *asa
}
func GetManyFromLimit(limit int) ([]model.AsaInfo,error){
	var list []model.AsaInfo
	var asaFile []model.UserFile
	err :=global.DBEngine.Order("RAND()").Limit(limit).Find(&asaFile).Error
	if err !=nil{
		return nil,err
	}
	for _,v := range asaFile{
		asaid := v.AsaId
		file,userfile,err := GetFileFromAsaId(asaid)
		if err!=nil{
			fmt.Println("fail to find this asa")
			break
		}
		asa :=&model.AsaInfo{
			AsaId: asaid,
			OssAddress:    file.OssAddress,
			OwnerAvatar:    GetAvatarFromAddress(userfile.Address),
			CreatorAvatar:  GetAvatarFromAddress(file.CreatorAddress),
			OwnerAddress:   userfile.Address,
			CreatorAddress: file.CreatorAddress,
			Price:          userfile.Money,
		}
		list = append(list, *asa)
	}
	return list,nil

}

func CheckFileWhetherExist(filesha1 string)bool{
	var file model.File
	err := global.DBEngine.Where("file_hash = ?",filesha1).Find(&file).Error

	if err !=nil{
		return false
	}
	return  true

}

func GetTransactionHistory(asaid string)[]model.Transaction{
	var tranHistory []model.Transaction
	global.DBEngine.Where("asa_id = ?",asaid).Find(&tranHistory)
	return tranHistory
}