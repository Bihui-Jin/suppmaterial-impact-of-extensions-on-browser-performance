import apiUrl from"../helpers/apiUrl.js";import debugDetails from"../helpers/debugDetails.js";import getUserData from"../helpers/getUserData.js";export const sendFeedback=a=>{getUserData(({id:b})=>{fetch(`${apiUrl}/api/feedback`,{headers:{Accept:"application/json","Content-Type":"application/json",userid:b},method:"POST",body:JSON.stringify({feedback:a.feedback,debugDetails})})})};