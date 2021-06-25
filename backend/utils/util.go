package util


import (
	"crypto/md5"
	"crypto/sha1"
	"encoding/hex"
	"fmt"
	"github.com/spf13/viper"
	"gopkg.in/gomail.v2"
	"hash"
	"io"
	"math/rand"
	"os"
	"path/filepath"
	"strconv"
	"time"
)

type Sha1Stream struct {
	_sha1 hash.Hash
}

func (obj *Sha1Stream) Update(data []byte) {
	if obj._sha1 == nil {
		obj._sha1 = sha1.New()
	}
	obj._sha1.Write(data)
}

func (obj *Sha1Stream) Sum() string {
	return hex.EncodeToString(obj._sha1.Sum([]byte("")))
}

func Sha1(data []byte) string {
	_sha1 := sha1.New()
	_sha1.Write(data)
	return hex.EncodeToString(_sha1.Sum([]byte("")))
}

func FileSha1(file *os.File) string {
	_sha1 := sha1.New()
	io.Copy(_sha1, file)
	return hex.EncodeToString(_sha1.Sum(nil))
}

func MD5(data []byte) string {
	_md5 := md5.New()
	_md5.Write(data)
	return hex.EncodeToString(_md5.Sum([]byte("")))
}

func FileMD5(file *os.File) string {
	_md5 := md5.New()
	io.Copy(_md5, file)
	return hex.EncodeToString(_md5.Sum(nil))
}

func PathExists(path string) (bool, error) {
	_, err := os.Stat(path)
	if err == nil {
		return true, nil
	}
	if os.IsNotExist(err) {
		return false, nil
	}
	return false, err
}

func GetFileSize(filename string) int64 {
	var result int64
	filepath.Walk(filename, func(path string, f os.FileInfo, err error) error {
		result = f.Size()
		return nil
	})
	return result
}

func RandomCode()string{
	rand.Seed(time.Now().Unix())
	// Intn returns, as an int, a non-negative pseudo-random number in [0,n)
	num := rand.Intn(100000)
	return  strconv.Itoa(num)
}

func SendEmail(email string,contract,contracthash,buyer string)bool{
	m := gomail.NewMessage()
	//发送人
	m.SetHeader("From", "858689519@qq.com")
	//接收人
	m.SetHeader("To", email)
	//抄送人
	//m.SetAddressHeader("Cc", "xxx@qq.com", "xiaozhujiao")
	//主题
	m.SetHeader("Subject", "someone want to buy your nft!")
	//内容

	m.SetBody("text/html", "<h1>"+"hello, someone want to buy your ntf, buyer is "+buyer+"</h1></br>"+
		"the contract is "+contract+"</br>"+
		"the contract address is "+contracthash+"</br>please go to the webstie to confirm this transaction")
	//附件
	//m.Attach("./myIpPic.png")

	//拿到token，并进行连接,第4个参数是填授权码
	d := gomail.NewDialer("smtp.qq.com", 587, "858689519@qq.com", "bmdrkpxjbeaqbfbf")

	// 发送邮件
	if err := d.DialAndSend(m); err != nil {
		fmt.Printf("DialAndSend err %v:", err)
		panic(err)
	}
	fmt.Printf("send mail success\n")
	return true
}

func SendValidationCode(email,code string)bool{
	m := gomail.NewMessage()
	//发送人
	m.SetHeader("From", "858689519@qq.com")
	//接收人
	m.SetHeader("To", email)
	//抄送人
	//m.SetAddressHeader("Cc", "xxx@qq.com", "xiaozhujiao")
	//主题
	m.SetHeader("Subject", "please validate your email!")
	//内容

	m.SetBody("text/html", "<h1>"+"your code is  "+code+"</h1></br>")
	//附件
	//m.Attach("./myIpPic.png")

	//拿到token，并进行连接,第4个参数是填授权码
	fmt.Println(viper.GetString("email.email"),viper.GetString("email.password"))
	d := gomail.NewDialer("smtp.qq.com", 587, viper.GetString("email.email"), viper.GetString("email.password"))

	// 发送邮件
	if err := d.DialAndSend(m); err != nil {
		fmt.Printf("DialAndSend err %v:", err)
		panic(err)
	}
	fmt.Printf("send mail success\n")
	return true
}