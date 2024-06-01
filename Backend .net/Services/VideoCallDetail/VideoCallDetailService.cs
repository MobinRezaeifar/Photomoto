using Grpc.Core;
using Microsoft.IdentityModel.Tokens;
using MongoDB.Driver;
using WebApplication1;
using WebApplication1.Configuration;
using MongoDB.Driver.Linq;

namespace WebApplication1.Services;
public class VideoCallDetailService : VideoCallDetail.VideoCallDetailBase
{
    private readonly IMongoCollection<VideoCallDetailItem> _videoCallDetailItem;

    public VideoCallDetailService(IStoreDatabaseSettings settings, IMongoClient mongoClient)
    {
        var database = mongoClient.GetDatabase(settings.DatabaseName);
        _videoCallDetailItem = database.GetCollection<VideoCallDetailItem>(settings.VideoCallDetailCollection);
    }

    public override async Task<CreateVideoCallDetailResponse> CreateVideoCallDetail(CreateVideoCallDetailRequest request, ServerCallContext context)
    {
        if (string.IsNullOrEmpty(request.Room) || string.IsNullOrEmpty(request.Recipient) || string.IsNullOrEmpty(request.Status) || string.IsNullOrEmpty(request.Applicant))
        {
            throw new RpcException(new Status(StatusCode.InvalidArgument, "You must supply a valid object"));
        }
        Random rnd = new Random();
        int randomNumber = rnd.Next();
        var videoCallDetailItem = new VideoCallDetailItem
        {
            Id = randomNumber.ToString(),
            Applicant = request.Applicant,
            Recipient = request.Recipient,
            Status = request.Status,
            Room = request.Room,
        };

        await _videoCallDetailItem.InsertOneAsync(videoCallDetailItem);

        var response = new CreateVideoCallDetailResponse
        {
            Id = videoCallDetailItem.Id
        };

        return await Task.FromResult(response);
    }

    public override async Task<ReadVideoCallDetailResponse> ReadVideoCallDetail(ReadVideoCallDetailRequest request, ServerCallContext context)
    {
        if (request.Id.IsNullOrEmpty())
        {
            throw new RpcException(new Status(StatusCode.InvalidArgument, "Resource index must be greater than 0"));
        }

        var videoCallDetailResult = await _videoCallDetailItem.Find(x => x.Id == request.Id).FirstOrDefaultAsync();
        if (videoCallDetailResult != null)
        {
            return new ReadVideoCallDetailResponse
            {
                Id = videoCallDetailResult.Id,
                Applicant = videoCallDetailResult.Applicant,
                Recipient = videoCallDetailResult.Recipient,
                Status = videoCallDetailResult.Status,
                Room = videoCallDetailResult.Room,
            };
        }
        throw new RpcException(new Status(StatusCode.NotFound, $"No Todo with id {request.Id}"));
    }

    public override async Task<GetAllVideoCallDetailsResponse> GetAllVideoCallDetails(GetAllVideoCallDetailsRequest request, ServerCallContext context)
    {
        var videoCallDetailResult = await _videoCallDetailItem.Find(_ => true).ToListAsync();

        var response = new GetAllVideoCallDetailsResponse();
        foreach (var videoCallDetaill in videoCallDetailResult)
        {
            response.VideoCallDetails.Add(new VideoCallDetailItem
            {
                Id = videoCallDetaill.Id,
                Applicant = videoCallDetaill.Applicant,
                Recipient = videoCallDetaill.Recipient,
                Status = videoCallDetaill.Status,
                Room = videoCallDetaill.Room,
            });
        }

        return response;
    }


    public override async Task<UpdateVideoCallDetailResponse> UpdateVideoCallDetail(UpdateVideoCallDetailRequest request, ServerCallContext context)
    {
        if (request.Id.IsNullOrEmpty() || request.Applicant.IsNullOrEmpty() || request.Recipient.IsNullOrEmpty() || request.Status.IsNullOrEmpty() || request.Room.IsNullOrEmpty())
        {
            throw new RpcException(new Status(StatusCode.InvalidArgument, "You must supply a valid object"));
        }

        var filter = Builders<VideoCallDetailItem>.Filter.Eq(x => x.Id, request.Id);
        var update = Builders<VideoCallDetailItem>.Update
            .Set(x => x.Applicant, request.Applicant)
            .Set(x => x.Recipient, request.Recipient)
            .Set(x => x.Status, request.Status)
            .Set(x => x.Room, request.Room);

        var result = await _videoCallDetailItem.UpdateOneAsync(filter, update);
        if (result.ModifiedCount == 0)
        {
            throw new RpcException(new Status(StatusCode.NotFound, $"No Task with Id {request.Id}"));
        }

        return new UpdateVideoCallDetailResponse
        {
            Id = request.Id
        };
    }
    public override async Task<DeleteVideoCallDetailResponse> DeleteVideoCallDetail(DeleteVideoCallDetailRequest request, ServerCallContext context)
    {
        if (string.IsNullOrEmpty(request.Id))
        {
            throw new RpcException(new Status(StatusCode.InvalidArgument, "Resource index must be provided"));
        }

        var deleteResult = await _videoCallDetailItem.DeleteOneAsync(x => x.Id == request.Id);
        if (deleteResult.IsAcknowledged && deleteResult.DeletedCount > 0)
        {
            return new DeleteVideoCallDetailResponse
            {
                Id = request.Id
            };
        }

        throw new RpcException(new Status(StatusCode.NotFound, $"No video call detail found with id {request.Id}"));
    }

}
