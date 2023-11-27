
import axios from "."
import { CommonTable } from "./commonType"


export interface bookListQuery extends CommonTable {
  note?:number
  status?:string
  startTime?:string
  endTime?:string
}

export interface SearchBooking extends CommonTable{
  username: string;
  meetingRoomName: string;
  meetingRoomPosition: string;
  rangeStartDate: Date;
  rangeStartTime: Date;
  rangeEndDate: Date;
  rangeEndTime: Date;
}

export const fetchBooingList = (bookListQuery:SearchBooking)=>{
return  axios.get("/booking/list",{
    params:bookListQuery
  })
}

export const fetchUpdateBooingStatus = (id:number,state:string)=>{
  return  axios.post("/booking/update",{
      id,
      state
    })
  }