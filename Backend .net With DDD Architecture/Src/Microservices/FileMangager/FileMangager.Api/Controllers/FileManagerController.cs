using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using FileMangager.Api.Services.FileMangager;

namespace FileMangager.Api.Controllers;

[Route("api/[controller]")]
[ApiController]
public class FileManagerController : ControllerBase
{
    private readonly IManageFile _iManageImage;
    public FileManagerController(IManageFile iManageImage)
    {
        _iManageImage = iManageImage;
    }

    [HttpPost]
    [Route("uploadfile")]
    [Consumes("multipart/form-data")]
    public async Task<IActionResult> UploadFile(IFormFile file)
    {
        var result = await _iManageImage.UploadFile(file);
        return Ok(result);
    }

    [HttpGet]
    [Route("downloadfile")]
    public async Task<IActionResult> DownloadFile(string FileName)
    {
        var result = await _iManageImage.DownloadFile(FileName);
        return File(result.Item1, result.Item2, true);
    }
}

