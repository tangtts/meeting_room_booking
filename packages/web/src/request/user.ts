
import axios  from ".";
import { CommonTable } from "./commonType";

export interface LoginParams  {
  username: string
  password:string
  captcha:string
}

export interface RegisterParams  {
  username: string
  nickName: string
  password:string
  email?:string
  captcha:string
  phoneNumber?:string
}


export interface UserListQuery extends CommonTable {
  username?:string
  nickName?:string
  startTime?:string
  endTime?:string
}

export interface UserListItem {
  id:number,
  username:string,
  nickName:string,
  email:string,
  phoneNumber:string,
  createTime:string,
  updateTime:string
}

export interface UserInfo {
  headPic:string
  username:string,
  nickName:string,
  email:string,
  phoneNumber:string,
}


export interface UpdateSelfUser extends Partial<UserInfo>{
 captcha:string
}

export interface UpdateUser extends Partial<UserInfo>{
  id:number,
}

export const login = (login:LoginParams)=>{
  return axios.post("/user/login",login)
}

export const register = (register:RegisterParams)=>{
  return axios.post("/user/register",register)
}

export const fetchUserList = (userList:UserListQuery)=>{
  return axios.get("/user/list",{
    params:userList
  })
}

export const fetchUserUpdate = (updateUser:UpdateUser)=>{
  return axios.post("/user/update",updateUser)
}

export const fetchUserToggleFreeze = (id:number)=>{
  return axios.get("/user/toggleFreeze",{
    params:{
      id
    }
  })
}

export const fetchUserInfo = ()=>{
  return axios.get("/user/info")
}

export const fetchUpdateSelf = (updateSelfUser:UpdateSelfUser)=>{
  return axios.post("/user/updateSelf",updateSelfUser)
}



