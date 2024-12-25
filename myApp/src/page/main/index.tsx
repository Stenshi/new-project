import { useEffect } from "react"
import { request } from "../../utils"

const Main = () =>{
    useEffect(()=>{
        request.get('/users')
    },[])
    return (
        <div>hello</div>
    )
}

export default Main