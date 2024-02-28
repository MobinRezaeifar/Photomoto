using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using WebApplication1.Models;
using WebApplication1.Services;
using Microsoft.AspNetCore.JsonPatch;

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

        [HttpPatch("{id}")]
        public ActionResult Patch(string id, [FromBody] JsonPatchDocument<Registers> patchDoc)
        {
            var existingRegister = _registersService.Get(id);

            if (existingRegister == null)
            {
                return NotFound($"register with Id = {id} not found");
            }

            
            patchDoc.ApplyTo(existingRegister);

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _registersService.Update(id, existingRegister);

            return NoContent();
        }

        // DELETE api/<StudentsController>/5
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
