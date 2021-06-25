package model

import "github.com/jinzhu/gorm"

type User struct {
	*gorm.Model
	Address string `gorm:"type:varchar(256);unique_index;not null"`
	Introduction string `gorm:"type:text;"`
	UserName string `gorm:"type:varchar(64);default:'';"`
	Email string `gorm:"type:varchar(64);default:'';unique_index;not null;"`
	Avatar string `gorm:"type:varchar(128);default:'';"`
	Status int `gorm:"type:int(10);default:'0'"`
}