using Google.Cloud.Translation.V2;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace translator
{
  class Program
  {
    static void Main(string[] args)
    {

      string credential_path = @"C:\Source\CeliacRestaurantCard\My Project-edebac817f4a.json";
      System.Environment.SetEnvironmentVariable("GOOGLE_APPLICATION_CREDENTIALS", credential_path);

      Console.OutputEncoding = System.Text.Encoding.Unicode;
      TranslationClient client = TranslationClient.Create();
      var response = client.ListLanguages();

      using (var availableLangs = File.OpenWrite("availableLanguages.json"))
      {
        using (var writer = new StreamWriter(availableLangs))
        {
          //    export const availableLanguages = [
          //      { code: 'en', name: 'English' },
          //      { code: 'sk', name: 'Slovak' },
          //      { code: 'tk', name: 'Thai' }
          //    ];

          writer.WriteLine("export const availableLanguages = [");
          foreach (var l in response)
          {
            var lname = !string.IsNullOrWhiteSpace(l.Name) ? l.Name : new CultureInfo(l.Code).DisplayName;
            writer.WriteLine("\t{{code: '{0}', name: '{1}' }},", l.Code, lname);
          }
          writer.WriteLine("];");
        }
      }

      var enItem = LoadJson();
      foreach (var l in response)
      {
        if (l.Code == "en")
          continue;

        var lname = !string.IsNullOrWhiteSpace(l.Name) ? l.Name : new CultureInfo(l.Code).DisplayName;
        Console.WriteLine("Translating to: " + lname);

        var item = new Item();

        var trans = client.TranslateText(enItem.TITLE, l.Code);
        item.TITLE = trans.TranslatedText;

        trans = client.TranslateText(enItem.LINE1, l.Code);
        item.LINE1 = trans.TranslatedText;

        trans = client.TranslateText(enItem.LINE2, l.Code);
        item.LINE2 = trans.TranslatedText;

        trans = client.TranslateText(enItem.LINE3, l.Code);
        item.LINE3 = trans.TranslatedText;

        trans = client.TranslateText(enItem.LINE4, l.Code);
        item.LINE4 = trans.TranslatedText;

        trans = client.TranslateText(enItem.THANKYOU, l.Code);
        item.THANKYOU = trans.TranslatedText;

        SaveJson(l.Code, item);
      }


     // var response2 = client.TranslateText("Hello World.", "ru");
      //Console.WriteLine(response2.TranslatedText);
      Console.ReadLine();
    }

    static Item LoadJson()
    {
      using (StreamReader r = new StreamReader(@"C:\Source\CeliacRestaurantCard\app\src\assets\i18n\en.json"))
      {
        string json = r.ReadToEnd();
        return JsonConvert.DeserializeObject<Item>(json);
      }
    }

    static void SaveJson(string code, Item item)
    {
      using (StreamWriter w = new StreamWriter(@"C:\Source\CeliacRestaurantCard\app\src\assets\i18n\" + code + ".json"))
      {
        var json = JsonConvert.SerializeObject(item);
        w.Write(json);
      }
    }
  }

  class Item
  {
    public string TITLE;
    public string LINE1;
    public string LINE2;
    public string LINE3;
    public string LINE4;
    public string THANKYOU;
  }
}
