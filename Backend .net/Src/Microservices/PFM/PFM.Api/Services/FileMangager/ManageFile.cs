using Microsoft.AspNetCore.StaticFiles;
using PFM.Api.Helper;
using ImageMagick;
using MediaToolkit;
using MediaToolkit.Model;
using MediaToolkit.Options;

namespace PFM.Api.Services.FileMangager;

public class ManageFile : IManageFile
{
    public async Task<string> UploadFile(IFormFile formFile)
    {
        string fileName = "";
        try
        {
            FileInfo fileInfo = new FileInfo(formFile.FileName);
            fileName = formFile.FileName;
            var filePath = Common.GetFilePath(fileName);

            if (formFile.ContentType.StartsWith("image"))
            {
                using (var memoryStream = new MemoryStream())
                {
                    await formFile.CopyToAsync(memoryStream);
                    using (var image = new MagickImage(memoryStream.ToArray()))
                    {
                        image.Resize(800, 800);
                        image.Quality = 75;
                        image.Write(filePath);
                    }
                }
            }
            else if (formFile.ContentType.StartsWith("video"))
            {
                var tempFilePath = Path.GetTempFileName();
                using (var tempFileStream = new FileStream(tempFilePath, FileMode.Create))
                {
                    await formFile.CopyToAsync(tempFileStream);
                }

                var inputFile = new MediaFile { Filename = tempFilePath };
                var outputFile = new MediaFile { Filename = filePath };

                var conversionOptions = new ConversionOptions
                {
                    VideoSize = VideoSize.Hd720,
                    VideoAspectRatio = VideoAspectRatio.R16_9,
                    VideoFps = 30
                };

                using (var engine = new Engine())
                {
                    engine.Convert(inputFile, outputFile, conversionOptions);
                }

                File.Delete(tempFilePath);
            }
            else
            {
                using (var fileStream = new FileStream(filePath, FileMode.Create))
                {
                    await formFile.CopyToAsync(fileStream);
                }
            }

            return fileName;
        }
        catch (Exception ex)
        {
            throw ex;
        }
    }

    public async Task<(byte[], string, string)> DownloadFile(string fileName)
    {
        try
        {
            var filePath = Common.GetFilePath(fileName);
            var provider = new FileExtensionContentTypeProvider();
            if (!provider.TryGetContentType(filePath, out var contentType))
            {
                contentType = "application/octet-stream";
            }
            var fileBytes = await File.ReadAllBytesAsync(filePath);
            return (fileBytes, contentType, Path.GetFileName(filePath));
        }
        catch (Exception ex)
        {
            throw ex;
        }
    }
}
