(function(vc) {

    vc.extends({
        propTypes: {
            callBackListener: vc.propTypes.string, //父组件名称
            callBackFunction: vc.propTypes.string //父组件监听方法
        },
        data: {
            addAppServiceInfo: {
                asId: '',
                asName: '',
                asType: '',
                asDesc: '',
                asCount: '1',
                asGroupId: '',
                asGroups: [],
                hostGroups: [],
                groupId: '',
                asDeployType: '1001',
                hosts: [],
                hostId: '',
                imagesId: '',
                images: [],
                appServicePorts: [],
                appServiceDirs: [],
                appServiceHosts: [],
                appServiceVars: []
            }
        },
        _initMethod: function() {

        },
        _initEvent: function() {
            vc.on('addAppService', 'openAddAppServiceModal', function() {
                //$('#addAppServiceModel').modal('show');
                $that._listAddAppVarGroups();
                $that._listAddHostGroups();
                $that._listAddBusinessImagess();
            });
        },
        methods: {
            addAppServiceValidate() {
                return vc.validate.validate({
                    addAppServiceInfo: vc.component.addAppServiceInfo
                }, {
                    'addAppServiceInfo.asName': [{
                            limit: "required",
                            param: "",
                            errInfo: "应用名称不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "128",
                            errInfo: "应用名称太长"
                        },
                    ],
                    'addAppServiceInfo.asType': [{
                            limit: "required",
                            param: "",
                            errInfo: "服务类型不能为空"
                        },
                        {
                            limit: "num",
                            param: "",
                            errInfo: "服务类型格式错误"
                        },
                    ],
                    'addAppServiceInfo.asCount': [{
                            limit: "required",
                            param: "",
                            errInfo: "副本数不能为空"
                        },
                        {
                            limit: "num",
                            param: "",
                            errInfo: "副本数不是有效数字"
                        },
                    ],
                    'addAppServiceInfo.asDesc': [{
                            limit: "required",
                            param: "",
                            errInfo: "服务描述不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "512",
                            errInfo: "描述太长"
                        },
                    ],
                });
            },
            saveAppServiceInfo: function() {
                if (!vc.component.addAppServiceValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }

                if ($that.addAppServiceInfo.asDeployType == '1001') {
                    $that.addAppServiceInfo.asDeployId = $that.addAppServiceInfo.groupId
                } else {
                    $that.addAppServiceInfo.asDeployId = $that.addAppServiceInfo.hostId
                }

                vc.http.apiPost(
                    '/appService/saveAppService',
                    JSON.stringify(vc.component.addAppServiceInfo), {
                        emulateJSON: true
                    },
                    function(json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            vc.component.clearAddAppServiceInfo();
                            vc.emit('appServiceManage', 'listAppService', {});

                            return;
                        }
                        vc.message(_json.msg);

                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');

                        vc.message(errInfo);

                    });
            },
            _goBack: function() {
                vc.emit('appServiceManage', 'listAppService', {});
            },
            clearAddAppServiceInfo: function() {
                vc.component.addAppServiceInfo = {
                    asName: '',
                    asType: '',
                    asDesc: '',
                    asCount: '1',
                    asGroupId: '',
                    asGroups: [],
                    hostGroups: [],
                    groupId: '',
                    asDeployType: '1001',
                    hosts: [],
                    hostId: '',
                    imagesId: '',
                    appServicePorts: [],
                    appServiceDirs: [],
                    appServiceHosts: [],
                    appServiceVars: []
                };
            },
            _listAddAppVarGroups: function(_page, _rows) {
                var param = {
                    params: {
                        page: 1,
                        row: 50
                    }
                };
                //发送get请求
                vc.http.apiGet('/appService/getAppVarGroup',
                    param,
                    function(json, res) {
                        var _appVarGroupManageInfo = JSON.parse(json);
                        vc.component.addAppServiceInfo.asGroups = _appVarGroupManageInfo.data;
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _listAddHostGroups: function() {
                let param = {
                    params: {
                        page: 1,
                        row: 50
                    }
                };
                //发送get请求
                vc.http.apiGet('/host/getHostGroup',
                    param,
                    function(json, res) {
                        let _hostGroupManageInfo = JSON.parse(json);
                        vc.component.addAppServiceInfo.hostGroups = _hostGroupManageInfo.data;
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _changeHostGroup: function() {
                $that._listAddHosts();
            },
            _listAddHosts: function() {


                var param = {
                    params: {
                        page: 1,
                        row: 100,
                        groupId: $that.addAppServiceInfo.groupId
                    }
                };

                //发送get请求
                vc.http.apiGet('/host/getHosts',
                    param,
                    function(json, res) {
                        var _hostManageInfo = JSON.parse(json);
                        vc.component.addAppServiceInfo.hosts = _hostManageInfo.data;

                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _listAddBusinessImagess: function(_page, _rows) {
                var param = {
                    params: {
                        page: 1,
                        row: 100
                    }
                };

                //发送get请求
                vc.http.apiGet('/soft/getBusinessImages',
                    param,
                    function(json, res) {
                        var _businessImagesManageInfo = JSON.parse(json);
                        vc.component.addAppServiceInfo.images = _businessImagesManageInfo.data;
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _addPort: function() {
                $that.addAppServiceInfo.appServicePorts.push({
                    srcPort: '',
                    targetPort: ''
                })
            },
            _deletePort: function(_index) {
                $that.addAppServiceInfo.appServicePorts.splice(_index, 1);
            },
            _addDir: function() {
                $that.addAppServiceInfo.appServiceDirs.push({
                    srcDir: '',
                    targetDir: ''
                })
            },
            _deleteDir: function(_index) {
                $that.addAppServiceInfo.appServiceDirs.splice(_index, 1);
            },
            _addHosts: function() {
                $that.addAppServiceInfo.appServiceHosts.push({
                    hostname: '',
                    ip: ''
                })
            },
            _deleteHosts: function(_index) {
                $that.addAppServiceInfo.appServiceHosts.splice(_index, 1);
            },
            _addVar: function() {
                $that.addAppServiceInfo.appServiceVars.push({
                    varSpec: '',
                    varName: '',
                    varValue: ''
                })
            },
            _deleteVar: function(_index) {
                $that.addAppServiceInfo.appServiceVars.splice(_index, 1);
            }
        }
    });

})(window.vc);