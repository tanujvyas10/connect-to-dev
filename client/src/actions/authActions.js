import {GET_ERRORS} from './types'
import axios from 'axios'

//register user

export const registeruser = (userData,history)=> dispatch=>{
    // return {
    //     type:TEST_DISPATCH,
    //     payload: userData
    // }

     axios.post('/api/users/register',userData)
          .then(
            res=>history.push("/login")
            )
          .catch(err=>
            // this.setState({errors: err.response.data})
            dispatch({
                type:GET_ERRORS,
                payload:err.response.data
            })
            )
}