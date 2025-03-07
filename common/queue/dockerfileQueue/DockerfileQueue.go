package dockerfileQueue

import (
	"bufio"
	"fmt"
	"github.com/zihao-boy/zihao/common/cache/factory"
	"github.com/zihao-boy/zihao/common/costTime"
	"github.com/zihao-boy/zihao/common/date"
	"github.com/zihao-boy/zihao/common/seq"
	"github.com/zihao-boy/zihao/common/utils"
	"github.com/zihao-boy/zihao/config"
	"github.com/zihao-boy/zihao/entity/dto/businessDockerfile"
	"github.com/zihao-boy/zihao/entity/dto/businessImages"
	"github.com/zihao-boy/zihao/softService/dao"
	"os"
	"os/exec"
	"path"
	"path/filepath"
	"sync"
	"time"
)

var lock sync.Mutex
var que chan *businessDockerfile.BusinessDockerfileDto

/**
初始化
*/
func initQueue() {


	if que != nil {
		return
	}
	lock.Lock()
	defer func() {
		lock.Unlock()
	}()
	if que != nil {
		return
	}
	que = make(chan *businessDockerfile.BusinessDockerfileDto, 100)

	go readData(que)

}

func SendData(businessDockerfileDto *businessDockerfile.BusinessDockerfileDto) {
	defer costTime.TimeoutWarning("DockerfileQueue","SendData",time.Now())
	initQueue()
	que <- businessDockerfileDto
}

func readData(que chan *businessDockerfile.BusinessDockerfileDto) {
	for {
		select {
		case data := <-que:
			dealData(data)
		}
	}
}

func dealData(businessDockerfileDto *businessDockerfile.BusinessDockerfileDto) {
	var (
		dockerfile        = businessDockerfileDto.Dockerfile
		tenantId          = businessDockerfileDto.TenantId
		businessImagesDao dao.BusinessImagesDao
		f                 *os.File
		err               error
		cmd               *exec.Cmd
		version           string = "V" + date.GetNowAString()
	)
	defer costTime.TimeoutWarning("DockerfileQueue","dealData",time.Now())

	dest := filepath.Join(config.WorkSpace, "businessPackage/"+tenantId)

	tenantDesc := dest

	if !utils.IsDir(dest) {
		utils.CreateDir(dest)
	}

	dest += "/Dockerfile"

	if utils.IsFile(dest) {
		//f, err = os.OpenFile(dest, os.O_RDWR, 0600)
		os.Remove(dest)
	}
	f, err = os.Create(dest)

	defer f.Close()
	if err != nil {
		fmt.Println(err.Error())
	} else {
		_, err = f.Write([]byte(dockerfile))
		if err != nil {
			fmt.Print(err.Error())
		}
	}

	imageRepository, _ := factory.GetMappingValue("IMAGES_REPOSITORY")

	imageName := imageRepository + businessDockerfileDto.Name + ":" + version

	shellScript := "docker build -f " + dest + " -t " + imageName + " ."
	//生成镜像
	cmd = exec.Command("bash", "-c", shellScript)
	cmd.Dir = tenantDesc
	output, _ := cmd.CombinedOutput()

	//打开日志文件
	var logFile *os.File
	if businessDockerfileDto.LogPath == ""{
		businessDockerfileDto.LogPath = path.Join(tenantDesc,seq.Generator()+".log")
		logFile, err = os.Create(businessDockerfileDto.LogPath)
	}else{
		logFile, err = os.OpenFile(businessDockerfileDto.LogPath, os.O_WRONLY|os.O_CREATE|os.O_APPEND, 0666)
	}
	defer func() {
		logFile.Close()
	}()
	if err != nil {
		fmt.Println("文件打开失败", err)
	}
	//及时关闭file句柄

	write := bufio.NewWriter(logFile)
	fmt.Print("构建镜像：" + shellScript + " 返回：" + string(output))
	write.WriteString("构建镜像：" + shellScript + " 返回：" + string(output))
	write.Flush()
	dockerRepositoryUrl, _ := factory.GetMappingValue("DOCKER_REPOSITORY_URL")
	username, _ := factory.GetMappingValue("DOCKER_USERNAME")
	password, _ := factory.GetMappingValue("DOCKER_PASSWORD")
	//登录镜像仓库
	shellScript = "docker login --username=" + username + " --password=" + password + " " + dockerRepositoryUrl
	cmd = exec.Command("bash", "-c", shellScript)

	output, _ = cmd.CombinedOutput()
	fmt.Print("登录：" + shellScript + " 返回：" + string(output))
	write.WriteString("登录：" + shellScript + " 返回：" + string(output))
	write.Flush()
	//推镜像
	shellScript = "docker push " + imageName

	cmd = exec.Command("bash", "-c", shellScript)

	output, _ = cmd.CombinedOutput()

	fmt.Print("推镜像：" + shellScript + " 返回：" + string(output))
	write.WriteString("推镜像：" + shellScript + " 返回：" + string(output))
	write.Flush()

	businessImagesDto := businessImages.BusinessImagesDto{}
	businessImagesDto.TenantId = businessDockerfileDto.TenantId
	businessImagesDto.CreateUserId = businessDockerfileDto.CreateUserId
	businessImagesDto.Id = seq.Generator()
	businessImagesDto.Version = version
	businessImagesDto.ImagesType = businessImages.IMAGES_TYPE_DOCKER
	businessImagesDto.ImagesFlag = businessImages.IMAGES_FLAG_CUSTOM
	businessImagesDto.TypeUrl = imageName
	businessImagesDto.Name = businessDockerfileDto.Name

	err = businessImagesDao.SaveBusinessImages(businessImagesDto)
	if err != nil {
		fmt.Println("保存镜像失败" + err.Error())
	}
}
