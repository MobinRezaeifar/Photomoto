using Registers.Domain.Entities;
using FluentValidation;
namespace Registers.Application.Configuration;
public class RegisterValidator : AbstractValidator<Register>
{
    public RegisterValidator()
    {
        RuleFor(x => x.Username).NotEmpty().WithMessage("Username is required.")
                                 .MinimumLength(5).WithMessage("Username must be at least 5 characters long.")
                                 .MaximumLength(20).WithMessage("Username cannot exceed 20 characters.")
                                 .Matches("^[a-z]+$").WithMessage("Username can only contain lowercase letters.");


        RuleFor(x => x.Password).NotEmpty().WithMessage("Password is required.")
                                 .Matches(@"^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$")
                                 .WithMessage("Password must be a combination of at least 8 characters including letters and numbers.");

        RuleFor(x => x.Email).NotEmpty().WithMessage("Email is required.")
                              .EmailAddress().WithMessage("Invalid email format.");
    }
}
