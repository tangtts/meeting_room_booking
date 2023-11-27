import axios from "."
import { CommonTable } from "./commonType"


export interface meetingListQuery extends CommonTable {
  capacity?:number | string
  name?:string
  equipment?:string
}

export interface MeetingRoomSearchResult {
  id:string | number
  capacity:number
  name:string
  location:string
  equipment:string
  isBooked:boolean
}

export interface meetingUpdate  {
  id:string | number
  capacity:number | string
  name:string
  location:string
  equipment?:string
  isBooked:boolean
}




export const fetchMeetingList = (meetingListQuery:meetingListQuery)=>{
  return axios.get("/meeting-room/list",{
    params:meetingListQuery
  })
}

export const fetchUpdateMeetingRoom = (meetingRoomUpdate:meetingUpdate)=>{
  return axios.post("/meeting-room/update",meetingRoomUpdate)
}

export const fetchCreateMeetingRoom = (meetingRoomCreate:Omit<meetingUpdate,'id'>)=>{
  return axios.post("/meeting-room/create",meetingRoomCreate)
}

export const fetchDelMeetingRoom = (delMeetingRoomId:number | string)=>{
  return axios.get("/meeting-room/delete",{
    params:{
      id:delMeetingRoomId
    }
  })
}