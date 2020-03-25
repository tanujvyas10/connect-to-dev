import axios from 'axios'

import {
    ADD_POST ,
    GET_ERRORS,
    GET_POSTS,
    POST_LOADING,
    DELETE_POST
    
}
from './types'
import { setProfileLoading } from './profilesAction'


// ADD POST
export const addPost = postData => dispatch =>{
    axios.post('/api/posts',postData)
    .then(res => 
        dispatch({
            type:ADD_POST,
            payload:res.data
        })
        )
        .catch(err =>
            dispatch({
                type:GET_ERRORS,
                payload:err.response.data
            })  
            )
}

//get post

export const getPosts = () => dispatch =>{

    dispatch(setProfileLoading)
    axios.get('/api/posts')
    .then(res => 
        dispatch({
            type:GET_POSTS,
            payload:res.data
        })
        )
        .catch(err =>
            dispatch({
                type:GET_POSTS,
                payload:null
            })  
            )
}




//delet post
export const deletePost = id => dispatch =>{
    axios.post(`/api/posts/${id}`)
    .then(res => 
        dispatch({
            type:DELETE_POST,
            payload:id
        })
        )
        .catch(err =>
            dispatch({
                type:GET_ERRORS,
                payload:err.response.data
            })  
            )
}



//add likes
export const addLike = id => dispatch =>{
    axios.post(`/api/posts/like/${id}`)
    .then(res => 
        dispatch(getPosts())
        )
        .catch(err =>
            dispatch({
                type:GET_ERRORS,
                payload:err.response.data
            })  
            )
}



//remove likes
export const removeLike = id => dispatch =>{
    axios.post(`/api/posts/unlike/${id}`)
    .then(res => 
        dispatch(getPosts())
        )
        .catch(err =>
            dispatch({
                type:GET_ERRORS,
                payload:err.response.data
            })  
            )
}






//set loading state
 export const setPostLoading = ()=>{
     return {
        type: POST_LOADING
     }
 }



