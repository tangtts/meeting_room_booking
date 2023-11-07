import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { MeetingRoom } from "./entities/meeting-room.entity";
import { Like, MoreThanOrEqual, Repository } from "typeorm";
import { CreateMeetingRoomDto } from "./dtos/create-meeting-room.dto";
import { UpdateMeetingRoomDto } from "./dtos/update-meeting-room.dto";

@Injectable()
export class MeetingRoomService {
  @InjectRepository(MeetingRoom)
  private meetingRoomRepository: Repository<MeetingRoom>;

  initData() {
    const room1 = new MeetingRoom();
    room1.name = "木星";
    room1.capacity = 10;
    room1.equipment = "白板";
    room1.location = "一层西";

    const room2 = new MeetingRoom();
    room2.name = "金星";
    room2.capacity = 5;
    room2.equipment = "";
    room2.location = "二层东";

    const room3 = new MeetingRoom();
    room3.name = "天王星";
    room3.capacity = 30;
    room3.equipment = "白板，电视";
    room3.location = "三层东";

    this.meetingRoomRepository.save([room1, room2, room3]);
  }
  async find({
    pageNo,
    pageSize,
    name,
    capacity,
    equipment,
  }: {
    pageNo: number;
    pageSize: number;
    name: string;
    capacity: number;
    equipment: string;
  }) {
    if (pageNo < 1) {
      throw new BadRequestException("页码最小为 1");
    }

    const condition: Record<string, any> = {};

    if (name) {
      condition.name = Like(`%${name}%`);
    }

    if (equipment) {
      condition.equipment = Like(`%${equipment}%`);
    }


    if (capacity) {
      condition.capacity = MoreThanOrEqual(capacity);
    }

    const [meetingRooms, totalCount] =
      await this.meetingRoomRepository.findAndCount({
        skip: (pageNo - 1) * pageSize,
        take: pageSize,
        where: condition,
      });
    return {
      meetingRooms,
      totalCount,
    };
  }

  async update(meetingRoomDto: UpdateMeetingRoomDto) {
    const meetingRoom = await this.meetingRoomRepository.findOneBy({
      id: meetingRoomDto.id,
    });

    if (!meetingRoom) {
      throw new BadRequestException("会议室不存在");
    }

    meetingRoom.capacity = meetingRoomDto.capacity;
    meetingRoom.location = meetingRoomDto.location;
    meetingRoom.name = meetingRoomDto.name;


    meetingRoom.isBooked = meetingRoomDto.isBooked;

    if (meetingRoomDto.description) {
      meetingRoom.description = meetingRoomDto.description;
    }

    if (meetingRoomDto.equipment) {
      meetingRoom.equipment = meetingRoomDto.equipment;
    }

    await this.meetingRoomRepository.update(
      {
        id: meetingRoom.id,
      },
      meetingRoom
    );

    return "success";
  }

  async findById(id: number) {
    return this.meetingRoomRepository.findOneBy({
      id,
    });
  }

  async deleteById(id: number) {
    let { affected } = await this.meetingRoomRepository.delete({ id });
    if (affected == 0) {
      return "删除失败";
    } else {
      return "删除成功";
    }
  }

  async create(meetingRoomDto: CreateMeetingRoomDto) {
    const room = await this.meetingRoomRepository.findOneBy({
      name: meetingRoomDto.name,
    });

    if (room) {
      throw new BadRequestException("会议室名字已存在");
    }

    return await this.meetingRoomRepository.save(meetingRoomDto);
  }
}
