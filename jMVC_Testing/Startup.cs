using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(jMVC_Testing.Startup))]
namespace jMVC_Testing
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
