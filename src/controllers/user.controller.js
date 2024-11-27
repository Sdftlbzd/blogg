import express from 'express'

const login =(req,res, next)=>{
res.send('Welcome to login')
}

const signin =(req,res, next)=>{
    res.send('Welcome to signin')
    }
    
export const UserController =()=>({login,signin})