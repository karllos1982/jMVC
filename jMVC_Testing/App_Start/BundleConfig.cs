using System.Web;
using System.Web.Optimization;

namespace jMVC_Testing
{
    public class BundleConfig
    {
        // For more information on bundling, visit http://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
                        "~/Scripts/jquery-{version}.js"));

            bundles.Add(new ScriptBundle("~/bundles/jqueryval").Include(
                        "~/Scripts/jquery.validate*"));

            // Use the development version of Modernizr to develop with and learn from. Then, when you're
            // ready for production, use the build tool at http://modernizr.com to pick only the tests you need.
            bundles.Add(new ScriptBundle("~/bundles/modernizr").Include(
                        "~/Scripts/modernizr-*"));

            bundles.Add(new ScriptBundle("~/bundles/bootstrap").Include(
                      "~/Scripts/bootstrap.js",
                      "~/Scripts/respond.js"));

            bundles.Add(new ScriptBundle("~/bundles/jmvc").Include(
               "~/Scripts/jMVC/jmvc.util.js",
               "~/Scripts/jMVC/jmvc.ui.js",
               "~/Scripts/jMVC/jmvc.core.js",
               "~/Scripts/Controllers/Test.js"
               ));

               // .IncludeDirectory("~/Scripts/jMVC", "*.js", true));

            bundles.Add(new ScriptBundle("~/bundles/plugins").Include(
               "~/Scripts/vex/vex.js",
               "~/Scripts/vex/vex.dialog.js",
               "~/Scripts/notify/notify.js",
               "~/Scripts/datatable/jquery.dataTables.min.js",
                "~/Scripts/datatable/dataTables.bootstrap.min.js"
               ));

            bundles.Add(new StyleBundle("~/Content/css").Include(
                      "~/Content/bootstrap.css", 
                      "~/Content/site.css",
                      "~/Content/vex/vex.css",
                      "~/Content/vex/vex-theme-os.css"
                      ));

            
                 
        }
    }
}
