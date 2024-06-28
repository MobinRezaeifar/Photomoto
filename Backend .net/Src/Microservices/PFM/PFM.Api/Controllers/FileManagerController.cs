using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using PFM.Api.Services.FileMangager;

namespace PFM.Api.Controllers;

[Route("api/[controller]")]
[ApiController]
public class FileManagerController : ControllerBase
{
    private readonly IManageFile _manageFile;
    public FileManagerController(IManageFile manageFile)
    {
        _manageFile = manageFile;
    }

    [HttpPost]
    [Route("uploadfile")]
    [Consumes("multipart/form-data")]
    public async Task<IActionResult> UploadFile(IFormFile file)
    {
        var result = await _manageFile.UploadFile(file);
        return Ok(result);
    }

    [HttpGet]
    [Route("downloadfile")]
    public async Task<IActionResult> DownloadFile(string fileName)
    {
        var result = await _manageFile.DownloadFile(fileName);
        return File(result.Item1, result.Item2, true);
    }
}
