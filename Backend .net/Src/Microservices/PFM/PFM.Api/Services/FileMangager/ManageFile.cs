using Microsoft.AspNetCore.StaticFiles;
using PFM.Api.Hepler;
using ImageMagick;
using MediaToolkit;
using MediaToolkit.Model;
using MediaToolkit.Options;

namespace PFM.Api.Services.FileMangager;

public class ManageFile : IManageFile
{
    public async Task<string> UploadFile(IFormFile _IFormFile)
    {
        string FileName = "";
        try
        {
            FileInfo _FileInfo = new FileInfo(_IFormFile.FileName);
            FileName = _IFormFile.FileName;
            var _GetFilePath = Common.GetFilePath(FileName);

            if (_IFormFile.ContentType.StartsWith("image"))
            {
                using (var memoryStream = new MemoryStream())
                {
                    await _IFormFile.CopyToAsync(memoryStream);
                    using (var image = new MagickImage(memoryStream.ToArray()))
                    {
                        image.Resize(800, 800);
                        image.Quality = 75;
                        image.Write(_GetFilePath);
                    }
                }
            }
            else if (_IFormFile.ContentType.StartsWith("video"))
            {
                var tempFilePath = Path.GetTempFileName();
                using (var tempFileStream = new FileStream(tempFilePath, FileMode.Create))
                {
                    await _IFormFile.CopyToAsync(tempFileStream);
                }

                var inputFile = new MediaFile { Filename = tempFilePath };
                var outputFile = new MediaFile { Filename = _GetFilePath };

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
                using (var _FileStream = new FileStream(_GetFilePath, FileMode.Create))
                {
                    await _IFormFile.CopyToAsync(_FileStream);
                }
            }

            return FileName;
        }
        catch (Exception ex)
        {
            throw ex;
        }
    }

    public async Task<(byte[], string, string)> DownloadFile(string FileName)
    {
        try
        {
            var _GetFilePath = Common.GetFilePath(FileName);
            var provider = new FileExtensionContentTypeProvider();
            if (!provider.TryGetContentType(_GetFilePath, out var _ContentType))
            {
                _ContentType = "application/octet-stream";
            }
            var _ReadAllBytesAsync = await File.ReadAllBytesAsync(_GetFilePath);
            return (_ReadAllBytesAsync, _ContentType, Path.GetFileName(_GetFilePath));
        }
        catch (Exception ex)
        {
            throw ex;
        }
    }
}
