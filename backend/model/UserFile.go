package model

import (
	"github.com/jinzhu/gorm"
)

type UserFile struct {
	*gorm.Model
	Address string `gorm:"type:varchar(128);not null"`
	FileHash string `gorm:"type:varchar(128);unique_index;not null"`
	AsaId string `gorm:"type:varchar(128);unique_index;not null"`
	Money int `gorm:"type:int(30);not null;"`
}
