using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using WebApplication1.Models;
using WebApplication1.Services;
using Microsoft.AspNetCore.JsonPatch;
using MongoDB.Driver;
using MongoDB.Bson;
using Newtonsoft.Json.Linq;
using System.Text.Json.Nodes;
using System.Text.Json.Serialization;
using Newtonsoft.Json;
using System.Runtime.InteropServices.JavaScript;
using Microsoft.Win32;

namespace WebApplication1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RegistersController : ControllerBase
    {
        private readonly IRegistersService _registersService;

        public RegistersController(IRegistersService registersService)
        {
            _registersService = registersService;
        }

        [HttpGet]
        public ActionResult<List<Registers>> Get()
        {
            return _registersService.Get();
        }


        [HttpGet("{id}")]
        public ActionResult<Registers> Get(string id)
        {
            var register = _registersService.Get(id);

            if (register == null)
            {
                return NotFound($"register with Id = {id} not found");
            }

            return register;
        }

        [HttpPost]
        public ActionResult<Registers> Post([FromBody] Registers register)
        {
            bool isUsernameExists = _registersService.IsUsernameExists(register.Username);

            if (isUsernameExists)
            {
                return BadRequest("این username قبلا با یک نفر دیگر ثبت نام کرده است.");
            }

            _registersService.Create(register);

            return CreatedAtAction(nameof(Get), new { id = register.Id }, register);
        }

        [HttpPut("{id}")]
        public ActionResult Put(string id, [FromBody] Registers register)
        {
            var existingRegister = _registersService.Get(id);

            if (existingRegister == null)
            {
                return NotFound($"register with Id = {id} not found");
            }

            _registersService.Update(id, register);

            return NoContent();
        }



        [HttpPatch("api/registers/{id}")]
        public IActionResult Patch(string id, [FromBody] JsonPatchDocument<Registers> patchDoc)
        {
            var existingRegister = _registersService.Get(id);

            if (existingRegister == null)
            {
                return NotFound($"Register with ID {id} not found.");
            }

            patchDoc.ApplyTo(existingRegister);

            // Validate the updated model
            if (!TryValidateModel(existingRegister))
            {
                return BadRequest(ModelState);
            }

            _registersService.Update(id, existingRegister);

            return NoContent();
        }



        [HttpDelete("{id}")]
        public ActionResult Delete(string id)
        {
            var register = _registersService.Get(id);

            if (register == null)
            {
                return NotFound($"register with Id = {id} not found");
            }

            _registersService.Remove(register.Id);

            return Ok($"register with Id = {id} deleted");
        }

    }
}
