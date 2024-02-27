using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using WebApplication1.Models;
using WebApplication1.Services;

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
