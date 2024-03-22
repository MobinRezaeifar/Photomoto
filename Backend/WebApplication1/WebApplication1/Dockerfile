FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["WebApplication1.csproj", ""]
RUN dotnet restore "./WebApplication1.csproj"
COPY . .
WORKDIR "/src/."
RUN dotnet build "WebApplication1.csproj" -c Release -o /app/build

# Expose port 5221
EXPOSE 5221

# Run the application with dotnet watch run
CMD ["dotnet", "watch", "run", "--urls", "http://0.0.0.0:5221"]
