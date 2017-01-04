using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using jMVC_Testing.Models;

namespace jMVC_Testing.Controllers
{
    public class TestController : DataController
    {
        //
        // GET: /Test/
        public ActionResult Index()
        {
            return View();
        }

        private List<TestDataModel> list = null;
        private Respository repo = new Respository();

        private void InicializaDados()
        {

            list = (List<TestDataModel>)Session["LISTDADOS"];

            if (list == null)
            {
                list = DAO.CreateData();
                Session["LISTDADOS"] = list;
            }
            
            repo.SetData(list);

        }

        public void Persists(Respository repo)
        {
            Session["LISTDADOS"] = repo.GetData();            
        }

        
        [HttpPost]
        public JsonResult List(TestSearchModel param)
        {

            this.InicializaDados();

            list = repo.List(param);

            ret.returns = list;

            return Json(ret);
        }

        public JsonResult Get(string id)
        {

            this.InicializaDados();

            TestDataModel obj = null;
            
            TestSearchModel param = new TestSearchModel(){pID=id};

            obj = repo.Get(param);

            if (obj == null)
            {
                ret.SetFailStatus("Item não encontrado.");
            }
            else
            {
                ret.returns = obj;
            }

            return Json(ret,JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult Set(TestDataModel param)
        {

            this.InicializaDados();

            bool isnew = false;
            TestDataModel obj = null;

            obj = repo.Set(param, ref isnew);

            this.Persists(this.repo);
           
            ret.returns = obj;

            return Json(ret);
        }

        [HttpPost]
        public JsonResult Delete(TestDataModel param)
        {

            this.InicializaDados();

            bool flag = false;

            flag = repo.Delete(param);

            this.Persists(this.repo);

            if (!flag)
            {
                ret.SetFailStatus("Não foi possível remover.");
            }
            else
            {
                this.Persists(this.repo);
            }
            
            return Json(ret);
        }
	}
}