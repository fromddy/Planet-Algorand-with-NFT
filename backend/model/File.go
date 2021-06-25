package model

import "github.com/jinzhu/gorm"

type File struct {
	*gorm.Model
	AsaId string `gorm:"type:varchar(64);unique_index;not null"`
	FileHash string `gorm:"type:varchar(128);unique_index;not null"`
	CreatorAddress string `gorm:"type:varchar(128);not null"`
	OssAddress string `gorm:"type:varchar(128);unique_index;not null"`
}

