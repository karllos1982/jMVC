using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using jMVC_Testing;

namespace jMVC_Testing.Models
{
    public class TestSearchModel: SearchModel
    {

        public string pID { get; set; }
        public string pNome { get; set; }

        public string pEmail { get; set; }

    }

    public static class DAO
    {
        public static List<TestDataModel> CreateData()
        {
            List<TestDataModel> ret = new List<TestDataModel>();
            TestDataModel obj;
            TestItemDataModel itemobj;
            Random rdn = new Random();


            obj = new TestDataModel("1","Mark Zukenberg", "mark@facebook.com", "01/01/1985", "M");
            obj.Itens = new List<TestItemDataModel>();
            itemobj = new TestItemDataModel("101", obj.ID, "Facebook");
            obj.Itens.Add(itemobj);
            itemobj = new TestItemDataModel("102", obj.ID, "WhatsUp");
            obj.Itens.Add(itemobj);
            itemobj = new TestItemDataModel("103", obj.ID, "Instagram");
            obj.Itens.Add(itemobj);
            ret.Add(obj);

            obj = new TestDataModel("2","Bill Gates", "gates@microsoft.com", "01/01/1950", "M");
            itemobj = new TestItemDataModel("201", obj.ID, "Visual Basic");
            obj.Itens.Add(itemobj);
            itemobj = new TestItemDataModel("202", obj.ID, "Windows 95");
            obj.Itens.Add(itemobj);
            itemobj = new TestItemDataModel("203", obj.ID, "Office");
            obj.Itens.Add(itemobj);
            ret.Add(obj);

            obj = new TestDataModel("3","Steve Jobs", "jobs@apple.com", "01/01/1950", "M");
            itemobj = new TestItemDataModel("301", obj.ID, "iMac");
            obj.Itens.Add(itemobj);
            itemobj = new TestItemDataModel("302", obj.ID, "iPod");
            obj.Itens.Add(itemobj);
            itemobj = new TestItemDataModel(rdn.Next(1, 100).ToString(), obj.ID, "iPhone");
            obj.Itens.Add(itemobj);
            ret.Add(obj);

            obj = new TestDataModel("4","Larry Page", "page@google.com", "01/01/1980", "M");
            itemobj = new TestItemDataModel("401", obj.ID, "Google");
            obj.Itens.Add(itemobj);
            itemobj = new TestItemDataModel("402", obj.ID, "Youtube");
            obj.Itens.Add(itemobj);
            itemobj = new TestItemDataModel("403", obj.ID, "Gmail");
            obj.Itens.Add(itemobj);
            ret.Add(obj);

            return ret;
        }
                    
    }

    public class TestDataModel: DataModel
    {

        public TestDataModel()
        {

        }

        public TestDataModel(string id, string nome, string email, string data, string sexo)
        {
             Random rdn = new Random();

             this.ID = id;
             this.Nome = nome;
             this.Email = email;
             this.DataNascimento = data;
             this.Sexo = sexo;
             Itens = new List<TestItemDataModel>();

        }

        public string ID { get; set; }

        public string Nome { get; set; }

        public string Email { get; set; }

        public string DataNascimento { get; set; }

        public string Sexo { get; set; }

        public List<TestItemDataModel> Itens { get; set; }

    }

    public class TestItemDataModel: DataModel
    {
        public TestItemDataModel()
        {
            
        }

        public TestItemDataModel(string id, string iditem, string texto)
        {
            
            this.ID = id;
            this.IdItem = iditem;
            this.Texto = texto;
        }

        public string ID { get; set; }

        public string IdItem { get; set; }

        public string Texto { get; set; }

    }

    public class Respository
    {

        private List<TestDataModel> data;

        public void SetData(List<TestDataModel> data)
        {
            this.data = data;
        }

        public List<TestDataModel> GetData()
        {
            return this.data;
        }
    

        public List<TestDataModel> List(TestSearchModel param)
        {
            List<TestDataModel> ret = new List<TestDataModel>();

            ret = this.data;

            if (param.pNome != null)
            {
                if (param.pNome.Trim().Length > 0)
                {
                    ret = ret.Where(t => t.Nome.ToUpper().Contains(param.pNome.ToUpper())).ToList();
                }
            }

            if (param.pEmail != null)
            {
                if (param.pEmail.Trim().Length > 0)
                {
                    ret = ret.Where(t => t.Email == param.pEmail).ToList();
                }
            }
            
            return ret;
        }

        public TestDataModel Get(TestSearchModel param)
        {
            TestDataModel ret = null;           

            if (param.pID != null)
            {
                if (param.pID.Trim().Length > 0)
                {
                    ret = this.data.Where(t => t.ID == param.pID).FirstOrDefault();
                }
            }
                       
            return ret;
        }

        public TestDataModel Set(TestDataModel obj, ref bool isnew)
        {
            TestDataModel ret = null;
            
            TestDataModel oldobj = this.Get(new TestSearchModel() { pID = obj.ID });
           
            if (oldobj == null)
            {
                oldobj = new TestDataModel(obj.ID, obj.Nome, obj.Email, obj.DataNascimento, obj.Sexo);
                isnew = true;
            }
            else
            {
                oldobj.Nome = obj.Nome;
                oldobj.Email = obj.Email;
                oldobj.DataNascimento = obj.DataNascimento;
                oldobj.Sexo = obj.Sexo;
                
            }

            if (obj.Itens != null)
            {
                oldobj.Itens = obj.Itens;
            }

            foreach (TestItemDataModel t in oldobj.Itens)
            {
                t.IdItem = obj.ID;
            }
                       
            ret = oldobj;

            if (isnew)
            {
                this.data.Add(oldobj);
            }
            
            return ret;
        }

        
        public bool Delete(TestDataModel obj)
        {
            bool ret = false;

            TestDataModel oldobj = this.Get(new TestSearchModel() { pID = obj.ID });

            if (oldobj != null)
            {
                this.data.Remove(oldobj);
                ret = true;
            }
            
            return ret;
        }

    }

}