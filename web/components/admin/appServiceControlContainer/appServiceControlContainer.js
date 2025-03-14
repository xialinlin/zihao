/**
    入驻小区
**/
(function(vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            appServiceControlContainerInfo: {
                appServiceControlContainers: [],
                total: 0,
                records: 1,
                asId: '',
            }
        },
        _initMethod: function() {},
        _initEvent: function() {

            vc.on('appServiceControlContainer', 'switch', function(_param) {
                if (_param.asId == '') {
                    return;
                }
                vc.copyObject(_param, $that.appServiceControlContainerInfo)
                vc.component._listappServiceControlContainers(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('appServiceControlContainer', 'paginationPlus', 'page_event', function(_currentPage) {
                vc.component._listappServiceControlContainers(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listappServiceControlContainers: function(_page, _rows) {

                var param = {
                    params: {
                        page: _page,
                        row: _rows,
                        asId: $that.appServiceControlContainerInfo.asId
                    }
                };
                //发送get请求
                vc.http.apiGet('/appService/getAppServiceContainer',
                    param,
                    function(json, res) {
                        var _appServiceControlContainersInfo = JSON.parse(json);
                        vc.component.appServiceControlContainerInfo.total = _appServiceControlContainersInfo.total;
                        vc.component.appServiceControlContainerInfo.records = _appServiceControlContainersInfo.records;
                        vc.component.appServiceControlContainerInfo.appServiceControlContainers = _appServiceControlContainersInfo.data;
                        vc.emit('appServiceControlContainer', 'paginationPlus', 'init', {
                            total: vc.component.appServiceControlContainerInfo.records,
                            currentPage: _page
                        });
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _enterContainer: function(_container) {
                //获取主机访问token
                var param = {
                    params: {
                        hostId: _container.hostId
                    }
                };

                //发送get请求
                vc.http.apiGet('/host/getHostToken',
                    param,
                    function(json, res) {
                        let _hostManageInfo = JSON.parse(json);
                        let _zihaoToken = _hostManageInfo.data;
                        window.open("/webshell/console.html?hostId=" +
                            _container.hostId +
                            "&zihaoToken=" + _zihaoToken +
                            "&val=exec&command=" + _container.dockerContainerId,
                            '_blank')
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _viewContainerLog: function(_container) {
                //获取主机访问token
                var param = {
                    params: {
                        hostId: _container.hostId
                    }
                };

                //发送get请求
                vc.http.apiGet('/host/getHostToken',
                    param,
                    function(json, res) {
                        let _hostManageInfo = JSON.parse(json);
                        let _zihaoToken = _hostManageInfo.data;
                        window.open("/webshell/console.html?hostId=" +
                            _container.hostId +
                            "&zihaoToken=" + _zihaoToken +
                            "&val=log&command=" + _container.dockerContainerId,
                            '_blank')
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _restartContainer: function(_container) {
                //获取主机访问token
                var param = {
                    params: {
                        hostId: _container.hostId
                    }
                };

                //发送get请求
                vc.http.apiGet('/host/getHostToken',
                    param,
                    function(json, res) {
                        let _hostManageInfo = JSON.parse(json);
                        let _zihaoToken = _hostManageInfo.data;
                        window.open("/webshell/console.html?hostId=" +
                            _container.hostId +
                            "&zihaoToken=" + _zihaoToken +
                            "&val=restart&command=" + _container.dockerContainerId,
                            '_blank')
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _getOnline: function(_time) {
                if (!_time) {
                    return "离线";
                }
                _time = _time.replace('T', " ");
                _time = _time.replace('Z', "");
                let _date = new Date(_time);
                if (new Date().getTime() - _date.getTime() < 10 * 60 * 1000) {
                    return "在线"
                }

                return "离线"
            },
            _toHosts: function(_container) {
                vc.jumpToPage('/index.html#/pages/admin/hostDetailManage?hostId=' + _container.hostId)
            }


        }
    });
})(window.vc);