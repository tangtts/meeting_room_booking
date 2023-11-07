import axios  from ".";
// 发送验证码
export const fetchSendEmail = (address:string)=>{
  return axios.post("/email/code",{
    address
  })
}
