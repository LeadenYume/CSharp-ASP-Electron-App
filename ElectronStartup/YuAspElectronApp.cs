using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Hosting;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Net;
using System.Net.NetworkInformation;
using System.Threading;

namespace ElectronStartup
{
    public class YuAspElectronApp<T> where T : class
    {
        public static YuAspElectronApp<T> Instance;
        private IHost WebHost = null;
        private Thread waitClose = null;
        private string url = "";
        string[] args;


        private YuAspElectronApp(string[] args) { this.args = args; }

        public static YuAspElectronApp<T> Create(string[] args)
        {
            return Instance = new YuAspElectronApp<T>(args);
        }
        public void Start()
        {
            var myArgs = new Dictionary<string, string>();
            foreach (var arg in args)
            {
                if (arg.IndexOf('=') != -1)
                {
                    var nameAndArg = arg.Split('=');
                    myArgs[nameAndArg[0]] = nameAndArg[1];
                }
            }

            if (Environment.GetEnvironmentVariable("OPEN_IIS_WINDOW") == "true")
            {
                CreateHostBuilder(args).Build().Run();
            }

            if (Environment.GetEnvironmentVariable("OPEN_ELECTRON_WINDOW") == "true")
            {
                url = "http://localhost:" + GetFreePort().ToString();
                WebHost = CreateHostBuilder(args).Build();

                ProcessStartInfo procInfo = new ProcessStartInfo();

                var ElectronPath = Directory.GetCurrentDirectory() + @"\chromeWindow\";
                var BuildPath = new DirectoryInfo(ElectronPath).GetDirectories("*-win32-x64");
                var exeFile = new DirectoryInfo(BuildPath[0].FullName).GetFiles("*.exe");
                procInfo.FileName = exeFile[0].FullName;
                procInfo.Arguments = "startUrl=" + url;
                var process = Process.Start(procInfo);

                waitClose = new Thread(() =>
                {
                    process.WaitForExit();
                    Close();
                });
                waitClose.Start();

                process.OutputDataReceived += new DataReceivedEventHandler((sender, args) =>
                {
                    var data = args.Data;
                });
                WebHost.Run();
            }

            if (myArgs.ContainsKey("startURL"))
            {
                url = "http://localhost:" + GetFreePort().ToString();
                WebHost = CreateHostBuilder(args).Build();
                Console.WriteLine("%g7nTzEA0Bxi6ZyRN%loadURL$" + url + "%ZCUORn5Pn0dJ8Y7L%");
                WebHost.Run();
            }
        }
        static bool IsBusy(int port)
        {
            IPGlobalProperties ipGP = IPGlobalProperties.GetIPGlobalProperties();
            IPEndPoint[] endpoints = ipGP.GetActiveTcpListeners();
            if (endpoints == null || endpoints.Length == 0) return false;
            for (int i = 0; i < endpoints.Length; i++)
                if (endpoints[i].Port == port)
                    return true;
            return false;
        }
        static int GetFreePort()
        {
            var currentPort = 5000;
            while (IsBusy(currentPort))
                currentPort++;
            return currentPort;
        }

        public void Close()
        {
            WebHost?.StopAsync();
            System.Diagnostics.Process.GetCurrentProcess().Kill();
        }

        public IHostBuilder CreateHostBuilder(string[] args)  =>
           Host.CreateDefaultBuilder(args)
               .ConfigureWebHostDefaults(webBuilder =>
               {
                   webBuilder.UseStartup<T>();
                   if (url != "")
                       webBuilder.UseUrls(url);
                   webBuilder.ConfigureLogging((context, logging) =>
                   {
                       //logging.ClearProviders();
                       //logging.AddConsole();

                       //logging.ClearProviders();
                   });
               });
    }
}
