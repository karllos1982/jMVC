/*
	JMVC.UI.JS
	JS Code for UI and Data operations.    
	VERSÃO 1.0 / 2017-01-05
	DIRETÓRIO NO GITHUB:  https://github.com/karllos1982/jMVC/Framework
    C. Fonteles 

*/

var chronos_id = 0;
var time = 0;

function upadateLoadingChronos() {
    var crn = $('#md-loading-timer')
    time = time + 1;
    crn.html('Tempo de execução: ' + time + ' s');
    this.chronos_id = setTimeout("upadateLoadingChronos()", 1000);

}

(function ($) {

    //atributos básicos dos inputs
    $.InputSettings = function (control) {
        this.id = control.attr("id");
        this.labelforid = control.attr("labelforid");
        this.displaytext = control.attr("displaytext");
        this.minlength = control.attr("minlength");
        this.required = control.attr("required");
        this.datatype = control.attr("datatype");
        this.validation = control.attr("validation");
    }

    //atributos dos controles select
    $.SelectSettings = function (control) {
        this.autocomplete = control.attr("autocomplete");
        this.defaultvalue = control.attr("defaultvalue");
        this.defaulttext = control.attr("defaulttext");
        this.fieldvalue = control.attr("fieldvalue");
        this.fieldtext = control.attr("fieldtext");

        if (this.autocomplete == null) {
            this.autocomplete = false
        }

        if (this.defaultvalue == null) {
            this.defaultvalue = "0";
        }

        if (this.defaulttext == null) {
            this.defaulttext = "Selecione um item...";
        }

        if (this.fieldvalue == null) {
            this.fieldvalue = "id";
        }

        if (this.fieldtext == null) {
            this.fieldtext = "text";
        }
    }

    //atributos dos controles table
    $.TableSettings = function (control) {
        this.bPaginate = $.Parsing.toBoolean(control.attr("paginate"));
        this.bLengthChange = $.Parsing.toBoolean(control.attr("lengthchange"));
        this.bFilter = $.Parsing.toBoolean(control.attr("filter"));
        this.bSort = $.Parsing.toBoolean(control.attr("sort"));
        this.bInfo = $.Parsing.toBoolean(control.attr("info"));
        this.bAutoWidth = $.Parsing.toBoolean(control.attr("autowidth"));
    }

    //enumeração dos tipos de controles usados nos controles table
    $.INPUTTYPE = function () {
        this.NONE = { value: 0, name: "NONE" },
        this.TEXT = { value: 1, name: "TEXT" },
        this.CHECK = { value: 2, name: "CHECK" },
        this.RADIO = { value: 3, name: "RADIO" },
        this.SELECT = { value: 4, name: "SELECT" },
        this.COMMAND = { value: 5, name: "COMMAND" },
        this.IMAGE = { value: 6, name: "IMAGE" },
        this.EDITICON = { value: 7, name: "EDITICON" },
        this.REMOVEICON = { value: 8, name: "REMOVEICON" },
        this.DETAILSICON = { value: 9, name: "DETAILSICON" },
        this.TEMPLATE = { value: 10, name: "TEMPLATE" },
        this.CURRENCY = { value: 11, name: "CURRENCY" }
    }

    //enumeração dos tipos de box dos widgets
    $.BOXTYPE = function () {
        this.DEFAULT = { value: 'aqua', name: "DEFAULT" },
		this.SUCCESS = { value: 'green', name: "SUCCESS" },
		this.WARNING = { value: 'yellow', name: "WARNING" },
		this.DANGER = { value: 'red', name: "DANGER" }
    }

    $.MODALTYPE = function () {
        this.DEFAULT = { value: 'default', name: "DEFAULT", iconname: "" },
		this.PRIMARY = { value: 'primary', name: "PRIMARY", iconname: "" },
		this.INFO = { value: 'info', name: "INFO", iconname: "fa-info" },
		this.WARNING = { value: 'warning', name: "WARNING", iconname: "fa-warning" },
		this.SUCCESS = { value: 'success', name: "SUCCESS", iconname: "fa-check" },
		this.DANGER = { value: 'danger', name: "DANGER", iconname: "fa-ban" }
    }
    //objeto que representa o model para preencher a table
    $.TableColumn = function (fieldname, caption, type, controlstyle,
            rowstyle, callBack, onFillControl, onSummary) {
        this.fieldname = fieldname;
        this.caption = caption;
        this.type = type;
        this.controlstyle = controlstyle;
        this.rowstyle = rowstyle;
        this.callBack = callBack;
        this.onFillControl = onFillControl;
        this.onSummary = onSummary;
    }

    $.DataUI = {

        buildSelect: function (data, control, fieldvalue, fieldtext, defaultvalue, defaulttext, selectedvalue, autocomplete) {
            control.html("");
            control.append("<option value='" + defaultvalue + "'>" + defaulttext + "</option>");
            $.each(data, function (key, val) {
                control.append("<option value='" + val[fieldvalue].toString().trim() + "'>" + val[fieldtext].toString().trim() + "</option>");
            });

            if (selectedvalue != null) { control.val(selectedvalue); }
            if (autocomplete) { control.select2(); }
        },

        buildTable: function (data, control, columns, onCreateTemplate, afterCreateTable) {
            var ind = 0;
            var html = '';
            var tblid = '';
            var css = "";
            var attr = new $.TableSettings(control);

            css = $(control).attr("class");
            tblid = control.selector.replace('#', '') + "grid";
            $(control).html('');
            $(control).append("<table id='" + tblid + "'> <thead> </thead> <tbody></tbody><tfoot></tfoot>");

            $('#' + tblid + ' thead').append("<tr></tr>");
            $('#' + tblid).addClass(css);

            for (i = ind; i < columns.length; i++) {
                html = '';
                html += "<th>";
                html += columns[i].caption;
                html += "</th>";

                $('#' + tblid + ' thead tr').append(html);
            }

            $('#' + tblid + ' tbody tr').remove();

            var id = 0;
            $.each(data, function (key, val) {
                id++;
                v = val;
                $.DataUI.buildRow(control, id, v, columns, onCreateTemplate, null);
            });

            //desenhando o rodapé
            $('#' + tblid + ' tfoot').append("<tr></tr>");

            for (i = ind; i < columns.length; i++) {
                html = '';
                html += "<th>";
                if (columns[i].onSummary != null) {
                    html += columns[i].onSummary(data);
                }
                html += "</th>";

                $('#' + tblid + ' tfoot tr').append(html);
            }

            $('#' + tblid).dataTable({
                "bPaginate": attr.bPaginate,
                "bLengthChange": attr.bLengthChange,
                "bFilter": attr.bFilter,
                "bSort": attr.bSort,
                "bAutoWidth": attr.bAutoWidth
            });

            if (afterCreateTable != null) {
                afterCreateTable();

            }

        },

        buildRow: function (control, rowid, rowdata, columns, onCreateTemplate, animate) {
            var html = '';
            var rid = '';
            var ind = 0;
            var tablename = control.selector.replace('#', '') + "grid";
            var sty = ""
            rid = tablename + "_rw_" + rowid.toString()
            html = "<tr id=" + rid + ">";

            for (i = ind; i < columns.length; i++) {
                if (columns[i].rowstyle != null) {
                    sty = " style='" + columns[i].rowstyle + "'";
                }
                html += "<td " + sty + ">";
                html += $.DataUI.buildRowContent(rowdata, i, columns[i], rid, onCreateTemplate);
                html += "</td>";
            }

            html += "</tr>";
            $("#" + tablename + ' tbody').append(html);
            if (animate) {
                $.DataUI.animateRow("#" + rid);
            }
        },

        buildRowContent: function (rowdata, columnid, column, rowid, onCreateTemplate) {
            var ret = "";
            var inpid = rowid + "_" + column.fieldname;
            var checked = '';
            var value = $.Parsing.unicodeToChar(rowdata[column.fieldname]);
            var name = " name='" + column.fieldname + "'";
            var val = " value= '" + value + "'";
            var typ = "";
            var sty = "";

            if (column.controlstyle != null) {
                sty = " style='" + column.controlstyle + "'";
            }

            switch (column.type.name) {
                case "NONE":
                    ret = value;
                    break;

                case "TEXT":
                    typ = " type='text'";
                    id = " id='" + inpid + "_txt'";
                    ret = "<input " + id + name + typ + val + sty + "/>";
                    break;

                case "CHECK":

                    if ($.Parsing.toBoolean(value)) { checked = ' checked '; };
                    typ = " type='checkbox'";
                    id = " id='" + inpid + "_ckc'";
                    ret = "<input " + id + name + typ + val + checked + sty + "/>";
                    break;

                case "RADIO":
                    if ($.Parsing.toBoolean(value)) { checked = 'checked'; };
                    typ = " type='radio'";
                    id = " id='" + inpid + "_rdo'";
                    ret = "<input " + id + name + typ + val + checked + sty + "/>";
                    break;

                case "SELECT":
                    id = " id='" + inpid + "_sel'";
                    ret = "<select " + id + name + " data-native-menu='false'" + sty + "/>";
                    column.onFillControl("#" + inpid + "_sel", value);
                    break;

                case "COMMAND":
                    id = " id='" + inpid + "_cmd'";
                    var aux = column.CallBack + "('" + rowid + "','" + value + "')";
                    ret += "<a ";
                    ret += " href='#'" + id + " onclick=" + aux + sty + ">" + column.caption + "</a>";
                    break;

                case "IMAGE":
                    id = " id='" + inpid + "_img'";
                    ret = "<img class='imgstyle'" + id + name + " src='" + value + "'" + sty + "'/>";
                    break;

                case "EDITICON":
                    id = " id='" + inpid + "_edt'";
                    var aux = column.callBack + "('" + rowid + "','" + value + "')";
                    ret += "<a ";
                    ret += " href='#'" + id + " onclick=" + aux + "><i class='fa fa-edit'></i><span> " + column.caption + "</span></a>";

                    break;

                case "REMOVEICON":
                    id = " id='" + inpid + "_del'";
                    var aux = column.callBack + "('" + rowid + "','" + value + "')";
                    ret += "<a ";
                    ret += " href='#'" + id + "onclick=" + aux + "><i class='fa fa-trash'></i><span> " + column.caption + "</span></a>";

                    break;

                case "DETAILSICON":
                    id = " id='" + inpid + "_det'";
                    var aux = column.callBack + "('" + rowid + "','" + value + "')";
                    //var aux = column.callBack(rowid, value);
                    ret += "<a ";
                    ret += " href='#'" + id + "onclick=" + aux + "><i class='fa fa-list'></i><span> " + column.caption + "</span></a>";

                    break;

                case "TEMPLATE":
                    var aux = column.onCreateTemplate(rowid, rowdata, column);
                    ret += aux;

                    break;

                case "CURRENCY":

                    value = $.Parsing.stringToFloat(value);
                    ret = $.Parsing.toCurrency(value, "R$ ");

                    break;

            }

            return ret;
        },

        animateRow: function (rowid) {
            var oldcolor = $(rowid).css("backgroundColor");
            $(rowid).animate({ backgroundColor: '#FCF803' }, 2000, function () {
                $(rowid).animate({ backgroundColor: oldcolor }, 2000, null);
            });
        },

        removeRow: function (control, rowid) {
            var rw = null;
            var tablename = control.replace('#', '');

            rw = "#" + tablename + "_rw_" + rowid;
            $(rw).remove();
            $(control).table("refresh");
        },

        buildTableEmpty: function (control, columns, message) {
            var html = '';
            var hasedit = false;
            var ind = 0;

            $(control).html('');

            var mt = new $.MODALTYPE();

            $.Widgets.buildSingleAlert(control, "Aviso", message, mt.WARNING);
        },

        buildRepeater: function (data, control, onItemCreating, afterAppend, onLoad) {
            $(control).html("");
            $.each(data, function (key, val) {
                html = onItemCreating(key, val);
                $(control).append(html);
                if (afterAppend != null) {
                    afterAppend(key, val);
                }
            });
            if (onLoad != null) {
                onLoad(data);
            }
        },

        clearValidationSummary: function (labelforid, displaytext) {
            $('#dv-' + labelforid).removeClass("has-error");
            $('#i-' + labelforid).removeClass("fa fa-times-circle-o");
            $('#' + labelforid).html(displaytext);
        },

        buildValidationSummary: function (labelforid, message) {
            $("#dv-" + labelforid).addClass("has-error");
            labeltext = $("#" + labelforid).html();
            labeltext = "<i class='fa fa-times-circle-o'></i>  " + labeltext + ": " + message;
            $("#" + labelforid).html(labeltext);
        },

        bindControls: function (data) {

            var inputfields = $(":input,select");
            var name = "";
            var columname = "";
            var obj;
            var type;

            inputfields.each(function (index, element) {
                type = $(this).attr("type")
                name = $(this).attr("name");

                if (typeof (name) != 'undefined') {
                    name = name.toUpperCase();
                    obj = $(this);

                    $.each(data, function (key, val) {
                        columname = key.toString().toUpperCase();
                        if (name == columname) {
                            switch (type) {
                                case "text":
                                    obj.val($.Parsing.unicodeToChar(val));
                                    break;

                                case "select":
                                    obj.val($.Parsing.unicodeToChar(val));
                                    break;

                                case "checkbox":
                                    if ($.Parsing.toBoolean(val)) {
                                        obj.iCheck('check');
                                    }
                                    else {
                                        obj.iCheck('uncheck');
                                    };
                                    break;
                            }

                        }
                    });

                }

            });
        },

        setDefaulsValues: function () {
            var inputfields = $(":input,select");
            var defaultvalue = "";
            var obj;
            var type;

            inputfields.each(function (index, element) {
                type = $(this).attr("type")
                defaultvalue = $(this).attr("defaultvalue");

                if (typeof (defaultvalue) != 'undefined') {

                    obj = $(this);

                    switch (type) {
                        case "text":
                            obj.val(defaultvalue);
                            break;

                        case "select":
                            obj.val(defaultvalue);
                            //obj.selectmenu('refresh', true);
                            break;

                        case "checkbox":
                            if ($.Parsing.toBoolean(defaultvalue)) {
                                obj.iCheck('check');
                            }
                            else {
                                obj.iCheck('uncheck');
                            };
                            break;
                    }

                }

            });
        },

        clearControls: function () {
            var inputfields = $(":input,select");
            var obj;
            var type;

            inputfields.each(function (index, element) {
                type = $(this).attr("type");

                obj = $(this);

                switch (type) {
                    case "text":
                        obj.val("");
                        break;

                    case "select":
                        obj.val("0");
                        break;

                    case "checkbox":
                        obj.iCheck('uncheck');
                        break;
                }

            });
        }

    }

    $.Widgets = {

        buildBoxInfo: function (text, value, boxtype, icon) {
            var ret = "";

            ret = "<div class='col-md-3 col-sm-6 col-xs-12'>";
            ret = ret + "<div class='info-box'>";
            ret = ret + "<span class='info-box-icon bg-" + boxtype.value + "'><i class='" + icon + "'></i></span>";
            ret = ret + "<div class='info-box-content'>";
            ret = ret + "<span class='info-box-text'>" + text + "</span>";
            ret = ret + "<span class='info-box-number'>" + value + "</span>";

            ret = ret + "</div></div></div>"

            return ret;
        },

        buildBoxProgress: function (text, value, boxtype, icon, width, description) {
            var ret = "";

            ret = "<div class='col-md-3 col-sm-6 col-xs-12'>";
            ret = ret + "<div class='info-box bg-" + boxtype.value + "'>";
            ret = ret + "<span class='info-box-icon'><i class='" + icon + "'></i></span>";
            ret = ret + "<div class='info-box-content'>";
            ret = ret + "<span class='info-box-text'>" + text + "</span>";
            ret = ret + "<span class='info-box-number'>" + value + "</span>";
            ret = ret + "<div class='progress'>";
            ret = ret + "<div class='progress-bar' style='width:" + width + "'></div></div>";
            ret = ret + " <span class='progress-description'>" + description + "</span>";
            ret = ret + "</div></div></div>"

            return ret;
        },

        buildBoxLink: function (text, value, boxtype, icon, url, urltitle) {
            var ret = "";

            ret = "<div class='col-lg-3 col-xs-6'>";
            ret = ret + "<div class='small-box bg-" + boxtype.value + "'>";
            ret = ret + "<div class='inner'>";
            ret = ret + "<h3>" + value + "</h3>";
            ret = ret + "<p>" + text + "</p></div>";
            ret = ret + "<div class='icon'>";
            ret = ret + "<i class='" + icon + "'></i></div>";
            ret = ret + "<a href='" + url + "' class='small-box-footer'>";
            ret = ret + urltitle + " <i class='fa fa-arrow-circle-right'></i>";
            ret = ret + "</a>";
            ret = ret + "</div></div>"

            return ret;
        },

        buildModalBox: function (controlid, title, message, type) {
            var ret = "";
            var btnclass = "outline";
            var id = controlid;

            if (type == $.MODALTYPE.DEFAULT) { btnclass = "default"; }

            ret = "<div id='md-" + id + "' class='modal fade modal-" + type.value + "' tabindex=-1  role='dialog' aria-labelledby='myModalLabel' aria-hidden='true'>";
            ret = ret + "<div class='modal-dialog'><div class='modal-content'>";
            ret = ret + "<div class='modal-header'>";
            ret = ret + "<button type='button' class='close' data-dismiss='modal'>";
            ret = ret + "<span aria-hidden='true'>&times;</span><span class='sr-only'>Close</span></button>";
            ret = ret + "<h3 class='modal-title' id='" + id + "'><strong>" + title + "</strong></h3></div>";
            ret = ret + "<div class='modal-body'><h4>" + message + "</h4></div>";
            ret = ret + "<div class='modal-footer'>";
            ret = ret + "<button type='button' class='btn btn-" + btnclass + "' data-dismiss='modal'>OK</button>";
            ret = ret + "</div> </div></div></div>";

            $('#' + id).html(ret);
            $('#md-' + id).modal('show');

            return ret;
        },

        buildSingleAlert: function (placeid, title, message, type) {
            var ret = "";

            ret = ret + "<div class='alert alert-" + type.value + " alert-dismissable'>";
            ret = ret + "<button class='close' aria-hidden='true' data-dismiss='alert' type='button'>×</button>";
            ret = ret + "<h4><i class='icon fa " + type.iconname + "'></i>" + title + "</h4>";
            ret = ret + message;
            ret = ret + "</div>";

            $(placeid).html(ret);

            return ret;

        },

        buildAlertContent: function (header, message, alerttype) {
            var ret = "";
            var imgname = "";
            var colorname = "";
            var imgpath = document.URL;

            switch (alerttype) {

                case "success":
                    imgname = "../success_icon.png";
                    colorname = "#3C763D";
                    break;

                case "error":
                    imgname = "../error_icon.png";
                    colorname = "#A94442";
                    break;

                case "warning":
                    imgname = "../warning_icon.png";
                    colorname = "#F8BB86";
                    break;
            }

            var imgsrc = imgname;
            var sty = 'style=\'text-align:center\'';
            var sty2 = 'style=\'color:' + colorname + '\'';
            ret = '<div ' + sty + '> <img src=\'' + imgsrc + '\'/><b><h2 ' + sty2 + ' >' + header + '</h2></b><p>' + message + '</p></div>';

            return ret;

        },

        showAlert: function (header, message, alerttype) {

            var msg = $.Widgets.buildAlertContent(header, message, alerttype);
            vex.dialog.alert({
            	className: 'vex-theme-os',
            	message: msg
            });
        },

        showAlertSuccess: function (header, message) {
            $.Widgets.showAlert(header, message, 'success');
        },

        showAlertError: function (header, message) {
            $.Widgets.showAlert(header, message, 'error');
        },

        showAlertWarning: function (header, message) {
            $.Widgets.showAlert(header, message, 'warning');
        },

        showConfirm: function (message, callback) {
            var msg = $.Widgets.buildAlertContent("Confirma?", message, "warning");
            vex.dialog.confirm({
                className: 'vex-theme-os',
                message: msg,
                callback: function (value) {
                    return callback(value);
                }
            });

        },

        showNotifyInfo: function (message) {
            $.Widgets.showNotify(message, 'info');
        },

        showNotifySuccess: function (message) {
            $.Widgets.showNotify(message, 'success');
        },

        showNotifyError: function (message) {
            $.Widgets.showNotify(message, 'error');
        },

        showNotifyWarning: function (message) {
            $.Widgets.showNotify(message, 'warn');
        },

        showNotify: function (message, type) {            
            $.notify.defaults({ showDuration: 200, autoHide: "true", clickToHide: "true",globalPosition:"top center"});
            $.notify(message, type);
        },

        //CRIA O PAINEL QUE MOSTRA AS INFORMAÇÕES DO USUÁRIO	
        buildUserWidget: function (placeid, username, imageurl, sincedate, logoutcallback, profileurl) {
            var ret = "";

            ret = ret + "<li class='dropdown user user-menu'>";
            ret = ret + "<a href='#' class='dropdown-toggle' data-toggle='dropdown'>";
            ret = ret + "<img src='" + imageurl + "' class='user-image' alt='Logo'/>";
            ret = ret + "<span class='hidden-xs'>" + username + "</span></a>";
            ret = ret + "<ul class='dropdown-menu'>";
            ret = ret + "<li class='user-header'>";
            ret = ret + "<img src='" + imageurl + "' class='img-circle' alt='User Image' /><p>";
            ret = ret + username + "<small>Tipo de Perfil: " + sincedate + "</small></p></li>";
            ret = ret + "<li class='user-footer'>";
            ret = ret + "<div class='pull-left'>";
            ret = ret + "<a href='" + profileurl + "' style='display:none' class='btn btn-default btn-flat'>Perfil</a></div>";
            ret = ret + "<div class='pull-right'>";
            ret = ret + "<a href='" + logoutcallback + "' class='btn btn-default btn-flat'>Sair</a>";
            ret = ret + "</div></li></ul></li>";

            $(placeid).append(ret);

            return ret;
        },

        buildUserAnonymousWidget: function (placeid, url) {

            var ret = "";

            ret = ret + "<li class='dropdown user user-menu'>";
            ret = ret + "<a href='" + url + "'>";
            ret = ret + "<i class='fa fa-user-times'></i>";
            ret = ret + "<span class='hidden-xs'>Você não está logado</span></a></li>";

            $(placeid).append(ret);

            return ret;

        },

        buildModalLoading: function (description) {
            var ret = "";

            ret = "<div id='md-loading' class='modal fade modal-default' tabindex=-1  role='dialog' aria-labelledby='myModalLabel' aria-hidden='true'>";
            ret = ret + "<div class='modal-dialog'><div class='modal-content'>";
            ret = ret + "<div class='modal-header'>";
            ret = ret + "<h3 class='modal-title' ><strong>Processando. Aguarde... </strong></h3></div>";
            ret = ret + "<div class='modal-body'><h4>" + description + "</h4> <h4 id='md-loading-timer'><h4>";
            ret = ret + "<img src='../loader.GIF'/></div>";
            ret = ret + "</div></div></div>";

            $('#loadingplace').html(ret);
            $('#md-loading').modal({
            	backdrop: 'static', keyboard: false
            });
            $('#md-loading').modal('show');

            chronos_id = setTimeout("upadateLoadingChronos()", 1000);

            return ret;

        },

        hideModalLoading: function () {
            $('#md-loading').modal('hide');

            if (chronos_id) {
            	clearTimeout(chronos_id);
            	chronos_id = 0;
            	time = 0;
            }
        },

        renderCheckBox: function () {
            $('input').iCheck({
                checkboxClass: 'icheckbox_square-blue',
                radioClass: 'iradio_square-blue',
                increaseArea: '20%' // optional
            });

        }
    }

    $.Navigation = {

        buildMenu: function (data, control, title) {

            control.html("");
            control.append($.Navigation.createTitleTag(title));
            $.Navigation.recBuildMenu(data, control);
            $.AdminLTE.tree('.sidebar');
        },

        recBuildMenu: function (itens, control) {
            var routeurl = "";
            var routealias = "";
            var classname = "";
            var id = "";
            var nodes = null;
            var ndobj = null;
            var ndobjcdl = null;

            $.each(itens, function (key, val) {
                routeurl = $.Parsing.unicodeToChar(val.routename);
                routealias = $.Parsing.unicodeToChar(val.routealias);
                classname = $.Parsing.unicodeToChar(val.classname);
                id = $.Parsing.unicodeToChar(val.id);
                nodes = val.nodes;

                if (nodes.length == 0) {
                    control.append($.Navigation.createSingleNode(routealias, routeurl, classname));
                }
                else {
                    nodobj = control.append($.Navigation.createTreeView(id));
                    nodobj = $('#tvw' + id);
                    nodobj.append($.Navigation.createAnchorNode(routealias, classname));
                    nodobj.append($.Navigation.createTreeViewChild(id));
                    ndobjcdl = $('#tvwchd' + id);
                    $.Navigation.recBuildMenu(nodes, ndobjcdl);
                }

            });
        },

        createTitleTag: function (title) {
            var ret = "";
            ret = "<li class='header'>" + title + "</li>";
            return ret;
        },

        createSingleNode: function (title, url, classname) {
            var ret = "";
            ret = "<li><a href='" + url + "'><i class='" + classname + "'></i><span>" + title + "</span></a></li>";
            return ret;
        },

        createTreeViewChild: function (id) {
            var ret = "";
            ret = "<ul id='tvwchd" + id + "' class='treeview-menu'></ul>";
            return ret;
        },

        createTreeView: function (id) {
            var ret = "";
            ret = "<li id='tvw" + id + "' class='treeview'></li>";
            return ret;
        },

        createAnchorNode: function (title, classname) {
            var ret = "";
            ret = "<a href='#'>";
            ret = ret + "<i class='" + classname + "'></i>";
            ret = ret + "<span>" + title + "</span>";
            ret = ret + "<i class='fa fa-angle-left pull-right'></i></a>";
            return ret;
        }


    }


    $.Validator = {

        clearForm: function () {
            var ret = 0;
            var inputfields = $(":input,select");

            inputfields.each(function (index, element) {
                $(this).clearValidation();                
            });

            return ret;
        },

        formValidation: function () {
            var ret = 0;
            var inputfields = $(":input,select");

            inputfields.each(function (index, element) {
                $(this).clearValidation();
                if (!$(this).validate()) {
                    ret = ret + 1;
                }
                $(this).showValidation();
            });

            return ret;
        },

        forRequired: function (control) {
            var ret = "OK";
            var aux = true;
            var value = control.val();

            if (value != null) {
                value = value.trim();
                if (value.length == 0) {
                    aux = false;
                }
            }
            else {
                aux = false;
            }

            if (!aux) {
                ret = "Preenchimento obrigatório";
            }

            return ret;
        },

        forInputMinLength: function (control, charlength) {

            var ret = "OK";
            var value = control.val();

            if (value.length < charlength) {
                ret = 'Este campo requer no mínimo ' + charlength + ' caracteres.';
            }

            return ret;
        },

        forDate: function (control) {
            var ret = "OK";
            var aux = true;

            var sdate = control.val();

            var datafilter = /^((((0?[1-9]|1\d|2[0-8])\/(0?[1-9]|1[0-2]))|((29|30)\/(0?[13456789]|1[0-2]))|(31\/(0?[13578]|1[02])))\/((19|20)?\d\d))$|((29\/0?2\/)((19|20)?(0[48]|[2468][048]|[13579][26])|(20)?00))$/;
            aux = datafilter.test(sdate);

            if (!aux) {
                ret = 'Este campo tem um valor inválido.';
            }

            return ret;
        },

        forBirthDayDate: function (control) {
            var ret = "OK";
            var aux = true;

            var d1 = control.val();
            var data;

            data = new Date(d1);
            hoje = new Date();
            a = data.getTime();
            h = hoje.getTime();
            if (data > h || data == h) {
                aux = false;
            } else {
                aux = true;
            }

            if (!aux) {
                ret = 'O campo ' + fieldname + ' deve ser menor que a data atual.';
            }

            return ret;

        },

        forCPF: function (control) {
            var ret = "OK";
            var aux = true;
            var out = [];
            var cpf = control.val();

            cpf = cpf.split(".").join("");
            cpf = cpf.split("-").join("");

            var numeros, digitos, soma, i, resultado, digitos_iguais;
            digitos_iguais = 1;
            if (cpf.length < 11) {
                aux = false;
            }
            for (i = 0; i < cpf.length - 1; i++)
                if (cpf.charAt(i) != cpf.charAt(i + 1)) {
                    digitos_iguais = 0;
                    break;
                }
            if (!digitos_iguais) {
                numeros = cpf.substring(0, 9);
                digitos = cpf.substring(9);
                soma = 0;
                for (i = 10; i > 1; i--) {
                    soma += numeros.charAt(10 - i) * i;
                    resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
                }
                if (resultado != digitos.charAt(0)) {
                    aux = false;
                }
                numeros = cpf.substring(0, 10);
                soma = 0;
                for (i = 11; i > 1; i--) {
                    soma += numeros.charAt(11 - i) * i;
                    resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
                }
                if (resultado != digitos.charAt(1)) {
                    aux = false;
                } else {
                    aux = true;
                }
            }
            else {
                aux = false;
            }

            if (!aux) {
                ret = 'Este campo tem um valor inválido.';
            }

            return ret;

        },

        forCNPJ: function (control) {
            var ret = "OK";
            var aux = true;
            var cnpj = control.val();

            cnpj = cnpj.split(".").join("");
            cnpj = cnpj.split("-").join("");
            cnpj = cnpj.split("/").join("");

            var numeros, digitos, soma, i, resultado, pos, tamanho, digitos_iguais;
            digitos_iguais = 1;
            if (cnpj.length < 14 && cnpj.length < 15) {
                aux = false;
            }
            for (i = 0; i < cnpj.length - 1; i++)
                if (cnpj.charAt(i) != cnpj.charAt(i + 1)) {
                    digitos_iguais = 0;
                    break;
                }
            if (!digitos_iguais) {
                tamanho = cnpj.length - 2
                numeros = cnpj.substring(0, tamanho);
                digitos = cnpj.substring(tamanho);
                soma = 0;
                pos = tamanho - 7;
                for (i = tamanho; i >= 1; i--) {
                    soma += numeros.charAt(tamanho - i) * pos--;
                    if (pos < 2)
                        pos = 9;
                }
                resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
                if (resultado != digitos.charAt(0)) {
                    aux = false;
                }
                tamanho = tamanho + 1;
                numeros = cnpj.substring(0, tamanho);
                soma = 0;
                pos = tamanho - 7;
                for (i = tamanho; i >= 1; i--) {
                    soma += numeros.charAt(tamanho - i) * pos--;
                    if (pos < 2)
                        pos = 9;
                }
                resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
                if (resultado != digitos.charAt(1)) {
                    aux = false;
                }
            }
            else {
                aux = false;
            }

            if (!aux) {
                ret = 'Este campo tem um valor inválido.';
            }

            return ret;
        },

        forEmail: function (control) {
            var ret = "OK";
            var aux = true;

            var sEmail = control.val();
            // filtros
            var emailFilter = /^.+@.+\..{2,}$/;
            var illegalChars = /[\(\)\<\>\,\;\:\\\/\"\[\]]/
            // condição
            if (!(emailFilter.test(sEmail)) || sEmail.match(illegalChars)) {
                aux = false;
            }

            if (!aux) {
                ret = 'Este campo tem um valor inválido.';
            }

            return ret;
        },

        forURL: function (control) {
            var ret = "OK";
            var aux = true;

            var surl = control.val();

            var urlfilter = /^(([\w]+:)?\/\/)?(([\d\w]|%[a-fA-f\d]{2,2})+(:([\d\w]|%[a-fA-f\d]{2,2})+)?@)?([\d\w][-\d\w]{0,253}[\d\w]\.)+[\w]{2,4}(:[\d]+)?(\/([-+_~.\d\w]|%[a-fA-f\d]{2,2})*)*(\?(&?([-+_~.\d\w]|%[a-fA-f\d]{2,2})=?)*)?(#([-+_~.\d\w]|%[a-fA-f\d]{2,2})*)?$/;
            aux = urlfilter.test(surl);

            if (!aux) {
                ret = 'Este campo tem um valor inválido.';
            }

            return ret;
        },

        forPhone: function (control) {
            var ret = "OK";
            var aux = true;

            var sphone = control.val();
            var phonefilter;
            phonefilter = /^[(]\d{2}([)]\d{4}[-]\d{4})?$/;
            aux = phonefilter.test(sphone);

            if (!aux) {
                ret = 'Este campo tem um valor inválido.';
            }

            return ret;

        },

        isPhone9Digits: function (phonenumber) {
            var ret = false;
            var ddds = ["11", "12", "13", "14", "15", "16", "17", "18", "19", "21", "22", "24", "27", "28"];
            var ddd = "";
            ddd = phonenumber.toString();
            ddd = phonenumber.substring(1, 3);

            for (i = 0; i < ddds.length - 1; i++) {
                if (ddds[i] == ddd) {
                    ret = true;
                    break;
                }
            }
            return ret;
        },

        forCellPhone: function (control) {
            var ret = "OK";
            var aux = true;

            var sphone = control.val();
            var phonefilter;
            if ($.Validator.isPhone9Digits(sphone)) {
                phonefilter = /^[(]\d{2}([)]\d{5}[-]\d{4})?$/;
            }
            else {
                phonefilter = /^[(]\d{2}([)]\d{4}[-]\d{4})?$/;
            }

            aux = phonefilter.test(sphone);

            if (!aux) {
                ret = 'Este campo tem um valor inválido.';
            }

            return ret;

        },

        forCard: function (control) {
            var ret = "OK";
            var aux = true;

            var scard = control.val();
            var cardfilter;
            cardfilter = /^[3-6]{1}[0-9]{12,15}$/;;
            aux = cardfilter.test(scard);

            if (!aux) {
                ret = 'Este campo tem um valor inválido.';
            }

            return ret;
        },

        forCEP: function (control) {
            var ret = "OK";
            var aux = true;

            var scep = control.val();
            var cepfilter;
            cepfilter = /^\d{5}([\-]\d{3})?$/;;
            aux = cepfilter.test(scep);

            if (!aux) {
                ret = 'Este campo tem um valor inválido.';
            }

            return ret;

        }

    }

    $.fn.extend({

        //serializa o formulário num objeto 
        toObject: function (oModel) {
            var frm = $(this);
            var o = oModel;
            var a = frm.serializeArray();
            $.each(a, function () {
                o[this.name] = undefined;
                if (o[this.name] !== undefined) {
                    if (!o[this.name].push) {
                        o[this.name] = [o[this.name]];
                    }
                    o[this.name].push(this.value || '');
                } else {
                    o[this.name] = this.value || '';
                }
            });
            return o;
        },

        loadSelect: function (isremote, source, selectedvalue, onSuccess) {
            var inp = $(this);
            var sets = new $.SelectSettings($(this));

            if (isremote) {
                var request = $.Http.getAsJSON(source);

                request.done(function (data) {
                    if (data.status == 'success') {
                        $.DataUI.buildSelect(data.returns, inp, sets.fieldvalue, sets.fieldtext,
                                    sets.defaultvalue, sets.defaulttext, selectedvalue, sets.autocomplete);
                        if (onSuccess != null) {
                            onSuccess(data.returns);
                        }
                    }
                });

                request.fail(function (jqXHR, statusText, statusCode) {

                });

            }
            else {

                $.DataUI.buildSelect(source, inp, sets.fieldvalue, sets.fieldtext,
                    sets.defaultvalue, sets.defaulttext, selectedvalue, sets.autocomplete);
            }

        },

        loadTable: function (isremote, source, columns, formid, onCreateTemplate, afterCreateTable) {
            var inp = $(this);

            if (isremote) {
                var request = null;

                if (formid != null) {
                    request = $.Http.postAsJSON(formid, source);
                }
                else {
                    request = $.Http.getAsJSON(source);
                }

                request.done(function (data) {
                    if (data.status == 'success') {
                        $.DataUI.buildTable(data.returns, inp, columns, onCreateTemplate, afterCreateTable);
                    }
                });

                request.fail(function (jqXHR, statusText, statusCode) {
                    $.DataUI.buildTableEmpty(inp, columns, "Aviso de erro: " + statusCode);
                });

            }
            else {

                $.DataUI.buildTable(source, inp, columns, onCreateTemplate, afterCreateTable);
            }

        },

        //data, control, onItemCreating, afterAppend, onLoad
        loadRepeater: function (isremote, source, onItemCreating, afterAppend, onLoad) {
            var inp = $(this);

            if (isremote) {
                var request = null;
                request = $.Http.getAsJSON(source);

                request.done(function (data) {
                    if (data.status == 'success') {
                        $.DataUI.buildRepeater(data.returns, inp, onItemCreating, afterAppend, onLoad);
                    }
                    else {
                        inp.html("Aviso de Erro: " + data.message);
                    }
                });

                request.fail(function (jqXHR, statusText, statusCode) {
                    inp.html("Aviso de Erro: " + statusCode);
                });

            }
            else {

                $.DataUI.buildRepeater(source, inp, onItemCreating, afterAppend, onLoad);
            }

        },

        validate: function () {
            var ret = true;
            var inp = $(this);
            var attr = new $.InputSettings($(this));
            var msg = "OK";

            if (typeof (attr.required) != 'undefined') {

                if (typeof ($("#" + attr.id + " option:selected").val()) != 'undefined') {
                    if ($("#" + attr.id + " option:selected").val() == "0") {
                        msg = "Preenchimento obrigatório.";
                    }
                }
                else {
                    msg = $.Validator.forRequired(inp);
                }
            }

            if (msg == "OK") {
                if (typeof (attr.minlength) != 'undefined') {
                    msg = $.Validator.forInputMinLength(inp, attr.minlength);
                }
            }

            if (msg == "OK") {
                if (typeof (attr.datatype) != 'undefined') {
                    if (inp.val().trim().length > 0) {
                        switch (attr.datatype) {
                            case "email":
                                msg = $.Validator.forEmail(inp);
                                break;

                            case "cpf":
                                msg = $.Validator.forCPF(inp);
                                break;

                            case "cnpj":
                                msg = $.Validator.forCNPJ(inp);
                                break;

                            case "date":
                                msg = $.Validator.forDate(inp);
                                break;

                            case "phone":
                                msg = $.Validator.forPhone(inp);
                                break;

                            case "cellphone":
                                msg = $.Validator.forCellPhone(inp);
                                break;

                            case "cep":
                                msg = $.Validator.forCEP(inp);
                                break;

                            case "card":
                                msg = $.Validator.forCard(inp);
                                break;

                            case "url":
                                msg = $.Validator.forURL(inp);
                                break;

                        }
                    }
                }
            }

            if (msg != "OK") {
                inp.attr("validation", msg);
                ret = false;
            }

            return ret;

        },

        showValidation: function () {
            var inp = $(this);
            var attr = new $.InputSettings($(this));

            if (typeof (attr.validation) != 'undefined') {
                if (attr.validation != "OK") {
                    $.DataUI.buildValidationSummary(attr.labelforid, attr.validation);
                }
            }

        },

        clearValidation: function () {
            var inp = $(this);
            var attr = new $.InputSettings($(this));

            if (typeof (attr.displaytext) != 'undefined') {
                inp.attr("validation", "OK");
                $.DataUI.clearValidationSummary(attr.labelforid, attr.displaytext);
            }

        },

        loadBoxInfo: function (text, value, boxtype, icon) {
            var inp = $(this);
            var content = $.Widgets.buildBoxInfo(text, value, boxtype, icon);

            inp.html(content);
        },

        loadBoxProgress: function (text, value, boxtype, icon, width, description) {
            var inp = $(this);
            var content = $.Widgets.buildBoxProgress(text, value, boxtype, icon, width, description);
            inp.html(content);
        },

        loadBoxLink: function (text, value, boxtype, icon, url, urltitle) {
            var inp = $(this);
            var content = $.Widgets.buildBoxLink(text, value, boxtype, icon, url, urltitle);
            inp.html(content);
        },

        loadMenu: function (isremote, source, title) {
            var inp = $(this);

            if (isremote) {
                var request = null;
                request = $.Http.getAsJSON(source);

                request.done(function (data) {
                    if (data.status == 'success') {
                        $.Navigation.buildMenu(data.returns, inp, title);
                    }
                    else {
                        inp.append($.Navigation.createTitleTag(data.message))
                    }
                });

                request.fail(function (jqXHR, statusText, statusCode) {
                    inp.append($.Navigation.createTitleTag("Erro: " + statusCode));
                });

            }
            else {
                $.Navigation.buildMenu(source, inp, title);
            }

        },

        test: function () {
            var attr = new $.InputAttributes($(this));
            alert(attr.id);
            $.fn.loadSelectRemote('a');
        }

    });

})(jQuery)