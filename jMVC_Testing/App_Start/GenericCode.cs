using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace jMVC_Testing
{

    public class RequestStatus
    {
        public RequestStatus(string status, string message)
        {
            this._status = status;
            this._message = message;
            this._returns = null;
        }

        private string _status;
        public string status
        {
            get { return _status; }
            set { _status = value; }
        }

        private string _message;
        public string message
        {
            get { return _message; }
            set { _message = value; }
        }

        private object _returns;
        public object returns
        {
            get { return _returns; }
            set { _returns = value; }
        }

        public void SetFailStatus(string msg)
        {
            status = "fail";
            message = msg;
        }

    }

    public abstract class DataModel
    {

        public static string ToBooleanString(string value)
        {
            string ret = "false";

            if (value == "on")
            {
                ret = "true";
            }

            if (value == "true")
            {
                ret = "true";
            }

            if (value == "1")
            {
                ret = "true";
            }

            return ret;
        }
    }

    public abstract class SearchModel
    {

    }

    public abstract class DataEntity
    {

    }
   
    public abstract class GenericController : Controller
    {
        
        public void Initialize()
        {
                    
        }
        
        public RequestStatus ret = new RequestStatus("success", "OK");
    }

    public abstract class DataController : GenericController
    {
        
        //public abstract ActionResult Index();

        //public abstract JsonResult List(object paramlist);

        //public abstract JsonResult Get(string id);

        //public abstract JsonResult Set(object data);

    }

     

}