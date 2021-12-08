using ElectronStartup;

namespace App
{
    public class Program
    {
        public static void Main(string[] args)
        {
            YuAspElectronApp<Startup>.Create(args).Start();
        }
    }
}
