/*
	JMVC.CORE.JS
	JS Code for Web Application Controller.
	VERSÃO 1.0 / 2017-01-05
	DIRETÓRIO NO GITHUB:  https://github.com/karllos1982/jMVC/Framework
    C. Fonteles 

*/

(function ($) {

    $.REST = function() {

        this.list = function (oModel, serviceURL, doneCallback, failCallback) {
            var request;
            request = $.Http.postAsJSON(oModel, serviceURL, null);
            
            request.done(function (data) {
                doneCallback(data);
            });

            request.fail(function (jqXHR, statusText, statusCode) {
                failCallback(statusCode);
            });

        }
        ,

        this.get = function (serviceURL, doneCallback, failCallback) {
            var request;

            request = $.Http.getAsJSON(serviceURL, 0);

            request.done(function (data) {
                doneCallback(data);
            });

            request.fail(function (jqXHR, statusText, statusCode) {
                failCallback(statusCode);
            });
        }
        ,

        this.set = function (oModel, serviceURL, doneCallback, failCallback) {
            var request;

            request = $.Http.postAsJSON(oModel, serviceURL, null);

            request.done(function (data) {
                doneCallback(data);
            });

            request.fail(function (jqXHR, statusText, statusCode) {
                failCallback(statusCode);
            });

        }
        ,

        this.del = function (oModel, serviceURL, doneCallback, failCallback) {
            var request;

            request = $.Http.postAsJSON(oModel, serviceURL, null);

            request.done(function (data) {
                doneCallback(data);
            });

            request.fail(function (jqXHR, statusText, statusCode) {
                failCallback(statusCode);

            });

        }      
        
    }

    $.App = {

        setDOM: function () {
            this.dataform = $("#frmData");
            this.searchform = $("#frmSearch");
            this.table = $('#tblist');
            this.loadingpanel = $('#loadingpanel');
            this.searchbutton = $('#searchbutton');
            this.newbutton = $('#newbutton');
            this.backbutton = $('#backbutton');
            this.savebutton = $('#savebutton');
            this.deletebutton = $('#deletebutton');
            this.tablepanel = $('#tablepanel');
            this.searchpanel = $('#searchpanel');
            this.editpanel = $('#editpanel');
            this.operationtype = $('#operationtype');
            this.messagepanel = $('#messagepanel');
        },

        setServicesURL: function () {
            this.listURL = null;
            this.getURL = null;
            this.setURL = null;
            this.deleteURL = null
        },

        setEvents: function () {            
            this.afterLoadTable = null;
            this.afterWireUpPageControls = null;
            this.afterBack = null;
            this.afterNew = null;
            this.afterDelete = null;
            this.afterSave = null;
            this.beforeNew = null;
            this.beforeSave = null;
            this.beforeDelete = null;
            this.onValidateForm = null;
            this.onFillMasks = null;            
        },

        createController: function (columns, fieldkey, view ) {
            this.DOM = new $.App.setDOM();
            this.services = new $.App.setServicesURL();
            this.events = new $.App.setEvents();
            this.model = new $.Model();

            if (view == null) {
                this.view = new $.View(this.DOM, columns);
            }
            else {
                view.setDOM(this.DOM);
                this.view = view;
            }
            this.controller = new $.Controller(this.model, this.view, this.services, this.events, fieldkey);
        }

    }

    $.Model = function () {

        var oModel = null;

        this.createModel = function () {
            oModel = {};            
        }
        ,

        this.setModel = function (obj) {
            oModel = obj;
        }
        ,

        this.getModel = function() {
            return oModel;
        }
        ,

        this.addChild = function (childname,fieldkey,obj) {
            var has = false;

            if (oModel == null) {
                this.createModel(null);
            }

            if (oModel[childname] == undefined) {
                oModel[childname] = new Array();
            }
            
            $.each(oModel[childname], function (key, val) {
                if (val[fieldkey] == obj[fieldkey]) {
                    has = true;
                }
            });

            if (!has) {
                oModel[childname].push(obj);
            }
        },

        this.removeChild = function (childname, fieldkey,valuekey) {
            var ind = -1;
            var index = -1;

            if (oModel != null) {
                if (oModel[childname] != undefined) {
                    if (oModel[childname] != null) {
                        $.each(oModel[childname], function (key, val) {
                            ind = ind + 1;
                            if (val[fieldkey] == valuekey) {
                                index = ind;
                            }
                        });

                        if (index != -1) {
                            oModel[childname].splice(index, 1);
                        }

                    }
                }
            }          
          
        },

        this.getChild = function (childname, fieldkey, valuekey) {
            var ret = null;
            var has = false;

            if (oModel != null) {
                if (oModel[childname] != undefined) {
                    if (oModel[childname] != null) {
                        $.each(oModel[childname], function (key, val) {
                            if (val[fieldkey] == valuekey) {
                                ret = val;
                                has = true;
                            }
                        });
                        if (!has) {
                            ret = null;
                        }
                    }
                }
            }
        
            return ret;
        }
        ,

        this.ConvertChildsToJson = function (list) {
            var ret = "";

            if (list != null) {
                ret = JSON.stringify(list);
            }

            return ret;
        }

    }

    $.View = function (DOM, columns) {
        this.DOM = DOM;
        this.columns = columns;
        var _DOM = DOM;
        var _columns = columns;

        this.onInitLoadSearchResult = function () {
            if (_DOM.searchbutton != null) {
                _DOM.searchbutton.css("visibility", "hidden");
            }

            if (_DOM.newbutton != null) {
                _DOM.newbutton.css("visibility", "hidden");
            }

            if (_DOM.loadingpanel != null) {
                _DOM.loadingpanel.css("display", "block");
            }

            _DOM.tablepanel.slideUp("slow");
        },

        this.onLoadSearchResult = function (success, data, callback, message) {
            if (success) {
                $.DataUI.buildTable(data, _DOM.table, _columns, null, callback);
            }
            else {
                $.DataUI.buildTableEmpty(_DOM.table, _columns, message);
            }
        },

        this.onDoneLoadSearchResult = function (success) {

            if (success) {
                if (_DOM.searchbutton != null) {
                    _DOM.searchbutton.css("visibility", "visible");
                }

                if (_DOM.loadingpanel != null) {
                    _DOM.loadingpanel.css("display", "none");
                }

                if (_DOM.newbutton != null) {
                    _DOM.newbutton.css("visibility", "visible");
                }

                _DOM.tablepanel.slideDown("slow");
                $(_DOM.table).focus();
            }
            else {
                _DOM.searchbutton.html("Buscar");
                _DOM.tablepanel.slideDown("slow");
            }

        },

        this.resetSearchResult = function () {
            $(_DOM.table.attr("ID") + ' tbody').html('');
            $(_DOM.table.attr("ID") + ' thead').html('');

        },

        this.onInitNewRecord = function () {
            _DOM.searchpanel.slideUp("slow");
            _DOM.tablepanel.slideUp("slow");
            _DOM.editpanel.slideDown("slow");
            _DOM.operationtype.html('NOVO REGISTRO');
            _DOM.messagepanel.html('');
            _DOM.operationtype.focus();
        },

        this.onInitLoadForm = function () {
            $.Widgets.buildModalLoading("Carregando formulário.");
        },

        this.onDoneLoadForm = function (success, message) {
            if (success) {
                $.Widgets.hideModalLoading();
                _DOM.searchpanel.slideUp("slow");
                _DOM.tablepanel.slideUp("slow");
                _DOM.editpanel.slideDown("slow");
                _DOM.operationtype.html('EDITAR REGISTRO');
                _DOM.messagepanel.html('');
                _DOM.operationtype.focus();
            }
            else {
                $.Widgets.hideModalLoading();
                $.Widgets.showAlertError('Aviso de Erro', message);
            }
        },

        this.onDoneBack = function () {
            _DOM.editpanel.slideUp("slow");
            _DOM.tablepanel.slideDown("slow");
            _DOM.searchpanel.slideDown("slow");
        },

        this.onInitSave = function () {
            $.Widgets.buildModalLoading("Salvando.");
        },

        this.onSave = function (model, fieldkey) {

            $.DataUI.buildRow(_DOM.table, model[fieldkey], model, _columns, null, true);
        },

        this.onDoneSave = function (success, message) {
            $.Widgets.hideModalLoading();

            if (success) {
                $.Widgets.showNotifySuccess("Registro salvo com sucesso.");
                _DOM.editpanel.slideUp("slow");
                _DOM.tablepanel.slideDown("slow");
                _DOM.searchpanel.slideDown("slow");
            }
            else {
                $.Widgets.showAlertWarning("Aviso de erro", message);
            }

        },

        this.onInitDelete = function () {
            $.Widgets.buildModalLoading("Deletando registro.");
        },

        this.onDoneDelete = function (success, message) {
            $.Widgets.hideModalLoading();

            if (success) {
                $.Widgets.showNotifySuccess("Registro deletado com sucesso.");
                _DOM.editpanel.slideUp("slow");
                _DOM.tablepanel.slideDown("slow");
                _DOM.searchpanel.slideDown("slow");
            }
            else {
                $.Widgets.showAlertWarning("Erro ao deletar", message);
            }
        }


    }

    $.Controller = function (model, view, services, events, fieldkey) {
        var model = model;
        var view = view;        
        var service = services;
        var event = events;
        var isnew = false;
        var currentrowid = 0;
        var fieldkey = fieldkey;
        var rest = new $.REST();

        this.search = function () {

            view.onInitLoadSearchResult();

            var sData = {};
            sData = view.DOM.searchform.toObject(sData);

            rest.list(sData,service.listURL,
                function (data) {
                    if (data.status == "success") {
                        view.onLoadSearchResult(true, data.returns, events.afterLoadTable, null);
                    }
                    else {
                        view.onLoadSearchResult(false, null, null, "Sem registros : " + data.message);
                    }
                     view.onDoneLoadSearchResult(true);
                },
                function (statusCode) {
                   view.onLoadSearchResult(false, null, null, "Aviso de erro: " + statusCode);
                   view.onDoneLoadSearchResult(false);
                }
            );
        },

        this.loadForm = function (rowid, id, fillform, onDone) {

            view.onInitLoadForm();

            rest.get(service.getURL + id,
                function (data) {
                    if (data.status == 'success') {
                        isnew = false;
                        view.DOM.deletebutton.css('visibility', 'visible');
                        currentrowid = rowid;
                        model.setModel(data.returns);
                        fillform(data.returns)                        
                        if (onDone != null) {
                            onDone();
                        }
                        view.onDoneLoadForm(true);
                    }
                    else {
                        view.onDoneLoadForm(false, null);
                    }
                },

                function (statusCode) {
                    view.onDoneLoadForm(false, statusCode);
                }
            );

        },

        this.newRecord = function () {
            isnew = true;
            currentrowid = 0;
            $.Validator.clearForm();
            model.createModel(null);
            view.DOM.deletebutton.css('visibility', 'hidden');
            view.onInitNewRecord();

            if (events.afterNew != null) {
                events.afterNew();
            }
        },

        this.back = function () {
             view.onDoneBack();
             if (events.afterBack != null) {
                 events.afterBack();
            }
        },

        this.save = function () {
            
            var ret = event.onValidateForm();
            if (ret) {
                
                var obj = model.getModel();

                obj = view.DOM.dataform.toObject(obj);
                model.setModel(obj);

                view.onInitSave();

                if (event.beforeSave != null) {
                    event.beforeSave();
                }

                rest.set(model.getModel(), service.setURL,
                    function (data) {
                        if (data.status == 'success') {
                            view.onDoneSave(true, null);
                            model.setModel(data.returns);
                            if (!isnew) {
                                var rid = '#' + currentrowid;
                                var r = $(rid);
                                r.remove();
                            }
                            view.onSave(data.returns, fieldkey);
                            if (event.afterSave != null) {
                                event.afterSave();
                            }
                        }
                        else {
                            view.onDoneSave(false, data.message);
                            $.each(data.returns, function (key, val) {
                                $('#' + val.Key).attr("validation", val.Description);
                                $('#' + val.Key).showValidation();
                            });
                        }
                    },

                    function (statusCode) {
                        view.onDoneSave(false, statusCode);
                    }
                );

            }
            else {
                view.onDoneSave(false, "Existem erros de validação nos formulário.");
            }

        },

        this.delete = function () {

            $.Widgets.showConfirm("Deseja deletar este registro",
                function (value) {
                    if (value) {
                        if (event.beforeDelete != null) {
                            event.beforeDelete();
                        }
                        view.onInitDelete();
                        
                        rest.del(model.getModel(), service.deleteURL,
                            function (data) {
                                if (data.status == 'success') {
                                    view.onDoneDelete(true, null);
                                    var r = $("#" + currentrowid);
                                    r.remove();
                                    if (event.afterDelete != null) {
                                        event.afterDelete();
                                    }
                                }
                                else {
                                    view.onDoneDelete(false, data.message);
                                }
                            },
                            function (statusCode) {
                                view.onDoneDelete(false, statusCode);
                            }
                        )
                    }
                }

            );
        },

        this.wireUpControls = function (controller) {

            if (view.DOM.newbutton != null) {
                view.DOM.newbutton.click(function (event) {
                    event.preventDefault();
                    controller.newRecord();
                });
            }

            if (view.DOM.savebutton != null) {
                view.DOM.savebutton.click(function (event) {
                    event.preventDefault();
                    controller.save();
                });
            }

            if (view.DOM.deletebutton != null) {
                view.DOM.deletebutton.click(function (event) {
                    event.preventDefault();
                    controller.delete();
                });
            }

            if (view.DOM.backbutton != null) {
                view.DOM.backbutton.click(function (event) {
                    event.preventDefault();
                    controller.back();
                });
            }

            if (event.AfterWireUpPageControls != null) {
                event.afterWireUpPageControls();
            }

            if (event.onFillMasks != null) {
                event.onFillMasks();
            }
        }

    }
    

})(jQuery)