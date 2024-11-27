import express from 'express'

const create =(req,res, next)=>{
res.send('New user created')
}

const list =(req,res, next)=>{
    res.send('list')
    }
    
export const BlogController =()=>({create, list})