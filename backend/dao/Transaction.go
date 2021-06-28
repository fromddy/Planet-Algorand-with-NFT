package dao

import (
	"Algo/global"
	"Algo/model"
	"errors"
	"fmt"
	"strconv"
)

func CreateTransaction(AliceAddress,BobAddress,amout,ContractAddress,Contract,AsaId string)error{
	price,_ := strconv.Atoi(amout)
	tran := &model.Transaction{
		AsaId:            AsaId,
		Contract:        Contract,
		Money:            price,
		ContractAddress: ContractAddress,
		AliceAddress:     AliceAddress,
		BobAddress:       BobAddress,
	}
	err :=global.DBEngine.Create(&tran).Error
	if err!=nil{
		fmt.Printf("fail to create a transaction:%v",err)
		return err
	}
	var tmpFile model.File
	err = global.DBEngine.Where("asa_id = ?",AsaId).Find(&tmpFile).Error
	if err!=nil{
		fmt.Printf("%v",err)
		return err
	}
	tmpFile.IsOnSail=0
	global.DBEngine.Save(&tmpFile)
	return nil
}

func ChangeUserFilePrice(asaid string,amout int)error{
	var tmpUserFile model.UserFile
	err := global.DBEngine.Where("asa_id = ?",asaid).Find(&tmpUserFile).Error
	if err!=nil{
		return err
	}
	tmpUserFile.Money = amout
	global.DBEngine.Save(&tmpUserFile)
	var tmpFile model.File
	err = global.DBEngine.Where("asa_id = ?",asaid).Find(&tmpFile).Error
	if err!=nil{
		fmt.Printf("%v",err)
		return err
	}
	tmpFile.IsOnSail=1
	global.DBEngine.Save(&tmpFile)

	return nil
}

func UpdateTranStatus(AliceAddress,BobAddress,AsaId string) error{
	var trans model.Transaction
	err := global.DBEngine.Where("asa_id = ?",AsaId).Where("bob_address = ?",BobAddress).Where("alice_address = ?",AliceAddress).Where("status = ?",0).Find(&trans).Error
	if err!=nil{
		return err
	}
	if trans == (model.Transaction{}){
		return errors.New("fail to find the transaction")
	}
	trans.Status = 1
	global.DBEngine.Save(&trans)
	return nil
}

func Withdraw(AliceAddress,BobAddress,AsaId string) error{
	var trans model.Transaction
	err := global.DBEngine.Where("asa_id = ?",AsaId).Where("bob_address = ?",BobAddress).Where("alice_address = ?",AliceAddress).Where("status = ?",0).Find(&trans).Error
	if err!=nil{
		return err
	}
	if trans == (model.Transaction{}){
		return errors.New("fail to find the transaction")
	}
	trans.Status = -1
	global.DBEngine.Save(&trans)
	var tmpUser model.File
	err = global.DBEngine.Where("asa_id = ?",AsaId).Find(&tmpUser).Error
	if err!=nil{
		return err
	}
	tmpUser.IsOnSail = 1
	global.DBEngine.Save(&tmpUser)
	return nil
}

func GetOrder(AliceAddress,BobAddress,AsaId string)(model.Transaction,error){
	var trans model.Transaction
	err := global.DBEngine.Where("asa_id = ?",AsaId).Where("bob_address = ?",BobAddress).Where("alice_address = ?",AliceAddress).Where("status = ?",1).Find(&trans).Error
	if err!=nil{
		return model.Transaction{},nil
	}
	return trans,nil
}

func GetAllOrder(bobAddress string)([]model.Transaction,error){
	var trans []model.Transaction
	err := global.DBEngine.Where("bob_address = ?",bobAddress).Where("status = ?",0).Find(&trans).Error
	if err!=nil{
		return trans,err
	}
	return trans,nil
}

func GetAliceOrder(address string)([]model.Transaction,error){
	var trans []model.Transaction
	err := global.DBEngine.Where("alice_address = ?",address).Where("status = ?",0).Find(&trans).Error
	if err!=nil{
		return trans,err
	}
	return trans,nil
}
