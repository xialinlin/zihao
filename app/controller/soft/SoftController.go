package soft

import (
	"github.com/kataras/iris/v12"
	"github.com/kataras/iris/v12/hero"
	"github.com/zihao-boy/zihao/softService/service"
)

type SoftController struct {
	businessPackageService service.BusinessPackageService
	businessDockerService service.BusinessDockerfileService
	businessImagesService service.BusinessImagesService
}

func SoftControllerRouter(party iris.Party) {
	var (
		adinMenu = party.Party("/soft")
		aus      = SoftController{
			businessPackageService: service.BusinessPackageService{},
			businessDockerService: service.BusinessDockerfileService{},
			businessImagesService: service.BusinessImagesService{},
		}
	)
	adinMenu.Get("/getBusinessPackages", hero.Handler(aus.GetBusinessPackages))

	adinMenu.Post("/saveBusinessPackages", hero.Handler(aus.SaveBusinessPackages))

	adinMenu.Post("/updateBusinessPackages", hero.Handler(aus.UpdateBusinessPackages))

	adinMenu.Post("/deleteBusinessPackages", hero.Handler(aus.DeleteBusinessPackages))

	adinMenu.Get("/getBusinessDockerfile", hero.Handler(aus.GetBusinessDockerfile))

	adinMenu.Post("/saveBusinessDockerfile", hero.Handler(aus.SaveBusinessDockerfile))

	adinMenu.Post("/updateBusinessDockerfile", hero.Handler(aus.UpdateBusinessDockerfile))

	adinMenu.Post("/deleteBusinessDockerfile", hero.Handler(aus.DeleteBusinessDockerfiles))

	adinMenu.Get("/getBusinessImages", hero.Handler(aus.GetBusinessImages))

	adinMenu.Post("/saveBusinessImages", hero.Handler(aus.SaveBusinessImages))

	adinMenu.Post("/updateBusinessImages", hero.Handler(aus.UpdateBusinessImages))

	adinMenu.Post("/deleteBusinessImages", hero.Handler(aus.DeleteBusinessImages))

	adinMenu.Post("/generatorImages", hero.Handler(aus.GeneratorImages))

	adinMenu.Get("/getImagesPool", hero.Handler(aus.getImagesPool))

	adinMenu.Post("/installImages", hero.Handler(aus.installImages))

}

/**
查询 业务包
*/
func (aus *SoftController) GetBusinessPackages(ctx iris.Context) {
	reslut := aus.businessPackageService.GetBusinessPackages(ctx)

	ctx.JSON(reslut)
}

/**
添加 业务包
*/
func (aus *SoftController) SaveBusinessPackages(ctx iris.Context) {
	reslut := aus.businessPackageService.SaveBusinessPackages(ctx)

	ctx.JSON(reslut)
}

/**
修改 业务包
*/
func (aus *SoftController) UpdateBusinessPackages(ctx iris.Context) {
	reslut := aus.businessPackageService.UpdateBusinessPackages(ctx)

	ctx.JSON(reslut)
}

/**
删除 业务包
*/
func (aus *SoftController) DeleteBusinessPackages(ctx iris.Context) {
	reslut := aus.businessPackageService.DeleteBusinessPackages(ctx)

	ctx.JSON(reslut)
}


/**
查询 dockerfile
*/
func (aus *SoftController) GetBusinessDockerfile(ctx iris.Context) {
	reslut := aus.businessDockerService.GetBusinessDockerfiles(ctx)

	ctx.JSON(reslut)
}

/**
添加 业务包
*/
func (aus *SoftController) SaveBusinessDockerfile(ctx iris.Context) {
	reslut := aus.businessDockerService.SaveBusinessDockerfiles(ctx)

	ctx.JSON(reslut)
}

/**
修改 业务包
*/
func (aus *SoftController) UpdateBusinessDockerfile(ctx iris.Context) {
	reslut := aus.businessDockerService.UpdateBusinessDockerfiles(ctx)

	ctx.JSON(reslut)
}

/**
删除 业务包
*/
func (aus *SoftController) DeleteBusinessDockerfiles(ctx iris.Context) {
	reslut := aus.businessDockerService.DeleteBusinessDockerfiles(ctx)

	ctx.JSON(reslut)
}


/**
查询 dockerfile
*/
func (aus *SoftController) GetBusinessImages(ctx iris.Context) {
	reslut := aus.businessImagesService.GetBusinessImages(ctx)

	ctx.JSON(reslut)
}

/**
添加 业务包
*/
func (aus *SoftController) SaveBusinessImages(ctx iris.Context) {
	reslut := aus.businessImagesService.SaveBusinessImages(ctx)

	ctx.JSON(reslut)
}

/**
修改 业务包
*/
func (aus *SoftController) UpdateBusinessImages(ctx iris.Context) {
	reslut := aus.businessImagesService.UpdateBusinessImages(ctx)

	ctx.JSON(reslut)
}

/**
删除 业务包
*/
func (aus *SoftController) DeleteBusinessImages(ctx iris.Context) {
	reslut := aus.businessImagesService.DeleteBusinessImages(ctx)

	ctx.JSON(reslut)
}

/**
删除 业务包
*/
func (aus *SoftController) GeneratorImages(ctx iris.Context) {
	reslut := aus.businessImagesService.GeneratorImages(ctx)

	ctx.JSON(reslut)
}

/**
查询远程镜像
*/
func (aus *SoftController) getImagesPool(ctx iris.Context) {
	reslut := aus.businessImagesService.GetImagesPool(ctx)

	ctx.JSON(reslut)
}

/**
查询远程镜像
*/
func (aus *SoftController) installImages(ctx iris.Context) {
	reslut := aus.businessImagesService.InstallImages(ctx)

	ctx.JSON(reslut)
}


