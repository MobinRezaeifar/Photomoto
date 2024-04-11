namespace WebApplication1.Services
{
    public interface IManageImage
    {
        Task<string> UploadFile(IFormFile _IFormFile);
        Task<(byte[], string, string)> DownloadFile(string FileName);
    }
}
