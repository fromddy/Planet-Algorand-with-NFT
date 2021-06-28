package model

import (
	"github.com/jinzhu/gorm"
)

type Transaction struct {
	*gorm.Model
	AsaId string `gorm:"type:varchar(128);not null;"`
	Contract string `gorm:"type:text;not null;"`
	//ConstractHash string `gorm:"type:varchar(125);unique_index;not null;"`
	Money int `gorm:"type:int(30);not null;"`
	ContractAddress string `gorm:"type:varchar(125);not null;"`
	AliceAddress string `gorm:"type:varchar(256);not null"`
	BobAddress string `gorm:"type:varchar(256);not null"`
	Status int `gorm:"type:int(10);default:'0'"`

}
