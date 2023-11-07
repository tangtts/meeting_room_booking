import {
  BadRequestException,
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from "@nestjs/common";
import { MeetingRoomService } from "./meeting-room.service";
import { CreateMeetingRoomDto } from "./dtos/create-meeting-room.dto";
import { UpdateMeetingRoomDto } from "./dtos/update-meeting-room.dto";

@Controller("meeting-room")
export class MeetingRoomController {
  constructor(private readonly meetingRoomService: MeetingRoomService) {}

  @Post("create")
  async create(@Body() meetingRoomDto: CreateMeetingRoomDto) {
    return await this.meetingRoomService.create(meetingRoomDto);
  }

  @Post("update")
  async update(@Body() meetingRoomDto: UpdateMeetingRoomDto) {
    return await this.meetingRoomService.update(meetingRoomDto);
  }

  @Get("list")
  async list(
    @Query(
      "pageNo",
      new DefaultValuePipe(1),
      new ParseIntPipe({
        exceptionFactory() {
          throw new BadRequestException("pageNo 应该传数字");
        },
      })
    )
    pageNo: number,

    @Query("pageSize", new DefaultValuePipe(2))
     pageSize: number,

     @Query('name') name: string,
     @Query('capacity') capacity: number,
     @Query('equipment') equipment: string
  ) {
    return await this.meetingRoomService.find({
      name,
      capacity,
      equipment,
      pageNo, 
      pageSize
    });
  }

  @Get("query")
  async find(@Query("id") id: number) {
    return await this.meetingRoomService.findById(id);
  }

  @Get("delete")
  async delete(@Query("id") id: number) {
    return await this.meetingRoomService.deleteById(id);
  }
}
