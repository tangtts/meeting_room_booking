
import axios  from ".";

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

 interface CommonTable  {
  pageNo:number,
  pageSize:number,
}


export interface UserListQuery extends CommonTable {
  username?:string
  nickName?:string
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

export interface UpdateUser {
  id:string,
  username?:string,
  nickName?:string,
  email?:string,
  phoneNumber?:string,
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
