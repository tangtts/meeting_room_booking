import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  DefaultValuePipe,
  Query,
} from "@nestjs/common";
import { BookingService } from "./booking.service";
import { CreateBookingDto } from "./dto/create-booking.dto";
import { UpdateBookingDto } from "./dto/update-booking.dto";
import { Status } from "./entities/booking.entity";

@Controller("booking")
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Get("list")
  async list(
    @Query("pageNo", new DefaultValuePipe(1)) pageNo: number,
    @Query("pageSize", new DefaultValuePipe(10)) pageSize: number,
    @Query("username") username: string,
    @Query("status") status: Status,
    @Query("meetingRoomName") meetingRoomName: string,
    @Query("meetingRoomPosition") meetingRoomPosition: string,
    @Query("bookingTimeRangeStart") bookingTimeRangeStart: number,
    @Query("bookingTimeRangeEnd") bookingTimeRangeEnd: number
  ) {
    return this.bookingService.find({
      pageNo,
      pageSize,
      username,
      status,
      meetingRoomName,
      meetingRoomPosition,
      bookingTimeRangeStart,
      bookingTimeRangeEnd,
    });
  }

  @Post("update")
  update(@Body() updateBookingDto: { id:number,state:`${Status}`}) {
    return this.bookingService.update(updateBookingDto);
  }


  @Get()
  findAll() {
    return this.bookingService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.bookingService.findOne(+id);
  }


  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.bookingService.remove(+id);
  }
}
