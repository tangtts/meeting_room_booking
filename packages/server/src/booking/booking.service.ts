import { Injectable } from "@nestjs/common";
import { CreateBookingDto } from "./dto/create-booking.dto";
import { UpdateBookingDto } from "./dto/update-booking.dto";
import { InjectEntityManager, InjectRepository } from "@nestjs/typeorm";
import { Between, EntityManager, Like, Repository } from "typeorm";
import { User } from "src/user/entities/user.entity";
import { MeetingRoom } from "src/meeting-room/entities/meeting-room.entity";
import { Booking } from "./entities/booking.entity";

@Injectable()
export class BookingService {
  @InjectRepository(Booking)
  private bookRepository: Repository<Booking>;

  @InjectEntityManager()
  private entityManager: EntityManager;

  async find({
    pageNo,
    pageSize,
    username,
    meetingRoomName,
    meetingRoomPosition,
    bookingTimeRangeStart,
    bookingTimeRangeEnd,
  }: {
    pageNo: number;
    pageSize: number;
    username: string;
    meetingRoomName: string;
    meetingRoomPosition: string;
    bookingTimeRangeStart: number;
    bookingTimeRangeEnd: number;
  }) {
    const skipCount = (pageNo - 1) * pageSize;

    const condition: Record<string, any> = {};

    if (username) {
      condition.user = {
        username: Like(`%${username}%`),
      };
    }

    if (meetingRoomName) {
      condition.room = {
        name: Like(`%${meetingRoomName}%`),
      };
    }

    if (meetingRoomPosition) {
      if (!condition.room) {
        condition.room = {}
      }
      condition.room.location = Like(`%${meetingRoomPosition}%`);
    }

    if (bookingTimeRangeStart) {

      if (!bookingTimeRangeEnd) {
        //  startTime + 一小时 
        bookingTimeRangeEnd = bookingTimeRangeStart + 60 * 60 * 1000;
      }

      condition.startTime = Between(
        new Date(bookingTimeRangeStart),
        new Date(bookingTimeRangeEnd)
      );
    }

    console.log(condition);

    const [bookings, totalCount] = await this.entityManager.findAndCount(Booking,{
      where: condition,
      relations: {
        user: true,
        room: true,
      },
      skip: skipCount,
      take: pageSize,
    });

    return {
      bookings:bookings.map(item => {
        delete item.user.password;
        return item;
    }),
      totalCount,
    };
  }

  async initData() {
    const user1 = await this.entityManager.findOneBy(User, {
      id: 1,
    });
    const user2 = await this.entityManager.findOneBy(User, {
      id: 2,
    });

    const room1 = await this.entityManager.findOneBy(MeetingRoom, {
      id: 3,
    });
    const room2 = await await this.entityManager.findOneBy(MeetingRoom, {
      id: 6,
    });

    const booking1 = new Booking();
    booking1.room = room1;
    booking1.user = user1;
    booking1.startTime = new Date();
    booking1.endTime = new Date(Date.now() + 1000 * 60 * 60);

    await this.entityManager.save(Booking, booking1);

    const booking2 = new Booking();
    booking2.room = room2;
    booking2.user = user2;
    booking2.startTime = new Date();
    booking2.endTime = new Date(Date.now() + 1000 * 60 * 60);

    await this.entityManager.save(Booking, booking2);

    const booking3 = new Booking();
    booking3.room = room1;
    booking3.user = user2;
    booking3.startTime = new Date();
    booking3.endTime = new Date(Date.now() + 1000 * 60 * 60);

    await this.entityManager.save(Booking, booking3);

    const booking4 = new Booking();
    booking4.room = room2;
    booking4.user = user1;
    booking4.startTime = new Date();
    booking4.endTime = new Date(Date.now() + 1000 * 60 * 60);

    await this.entityManager.save(Booking, booking4);
  }

  create(createBookingDto: CreateBookingDto) {
    return "This action adds a new booking";
  }

  findAll() {
    return `This action returns all booking`;
  }

  findOne(id: number) {
    return `This action returns a #${id} booking`;
  }

  update(id: number, updateBookingDto: UpdateBookingDto) {
    return `This action updates a #${id} booking`;
  }

  remove(id: number) {
    return `This action removes a #${id} booking`;
  }
}
