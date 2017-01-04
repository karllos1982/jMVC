(function ($) {

    $.Test = {
       
        app: null,

        initialize: function () {
            var cols = new this.getColumns();
            this.app = new $.App.createController(cols, "ID");
            this.app.services.getURL = "Test/Get?id=";
            this.app.services.setURL = "Test/Set";
            this.app.services.deleteURL = "Test/Delete";
            this.app.services.listURL = "Test/List";
            
            this.app.events.afterNew = this.onNew;
            this.app.events.beforeSave = null;
            this.app.events.onValidateForm = this.validateForm;
            
            this.app.controller.wireUpControls(this.app.controller);
            this.wireUp();
            this.app.controller.search();
        },

        wireUp: function () {
            var c = this.app.controller;
            $('#searchbutton').click(function (event) {
                event.preventDefault();
                c.search();
            });

            $('#additem').click(function (event) {
                event.preventDefault();
                var msg = "";
                if ($('#IdItem2').val().toString().trim().length > 0  &&
                    $('#Texto').val().toString().trim().length > 0) {
                    msg = $.Test.addItem($('#IdItem2').val(), $('#Texto').val());
                    if (msg != "OK") {
                        $.Widgets.showAlertError('Aviso', msg);
                    }
                    else {
                        $.Widgets.showNotifySuccess("Item incluído com sucesso.");
                        $('#IdItem2').val("") ;
                        $('#Texto').val("");
                        $('#modalAdd').modal('hide');
                        
                    }
                }
                else {
                    $.Widgets.showNotifyWarning("Informe os dados antes de confirmar.");
                }

            });

            $('#addbutton').click(function (event) {
                event.preventDefault();
                $('#modalAdd').modal('show');
                
            });
        },

        onEdit: function (rowid, dataid) {
            this.app.controller.loadForm(rowid, dataid, this.fillForm, function () {

            });
        },

        fillForm: function (data) {

            $.DataUI.bindControls(data);
            $.Test.loadItensTable();
        },

        onNew: function () {
            $.DataUI.clearControls();
            $('#ID').val("");

            $.Test.app.model.getModel().Itens = new Array();
            $.Test.loadItensTable();

        },

        validateForm: function () {
            return !($.Validator.formValidation() > 0);
        },

        getColumns: function () {
            var cols = new Array();

            var tp = new $.INPUTTYPE();
            cols.push(new $.TableColumn("ID", "ID", tp.NONE, null, null, null, null));
            cols.push(new $.TableColumn("Nome", "NOME", tp.NONE, null, null, null, null));
            cols.push(new $.TableColumn("Email", "E-MAIL", tp.NONE, null, null, null, null));
            cols.push(new $.TableColumn("Sexo", "SEXO", tp.NONE, null, null, null, null));
            cols.push(new $.TableColumn("ID", "EDITAR", tp.DETAILSICON, null, null, "$.Test.onEdit", null));
            
            return cols;
        }
            ,

        // funções dos itens
               
        getItensColmuns: function () {
            var cols = new Array();

            var tp = new $.INPUTTYPE();
            cols.push(new $.TableColumn("ID", "ID", tp.NONE, null, null, null, null));
            cols.push(new $.TableColumn("Texto", "TEXTO", tp.NONE, null, null, null, null));           
            cols.push(new $.TableColumn("ID", "EXCLUIR", tp.REMOVEICON, null, null, "$.Test.onDeleteItem", null));

            return cols;
        },

        loadItensTable: function () {

            $.DataUI.buildTable($.Test.app.model.getModel().Itens,
                $('#tbItens'), new $.Test.getItensColmuns, null, null);
        },

        newItem: function (p_ID, p_texto) {
            this.ID = p_ID;            
            this.Texto = p_texto;
            
        },

        onDeleteItem: function (rowid, dataid) {
       
            this.app.model.removeChild("Itens", "ID", dataid);
            $.Test.loadItensTable();
        }
        ,

        addItem: function (id, texto) {
            var ret = "OK";
            
            var obj = this.app.model.getChild("Itens", "ID", id);

            if (obj == null) {
                obj = new $.Test.newItem(id, texto);
                this.app.model.addChild("Itens", "ID", obj);
                $.Test.loadItensTable();
            }
            else {
                ret = "Este item já foi incluído na lista.";
            }
            return ret;
        }


    }

})(jQuery)

$(function () {

    $.Test.initialize();

});
