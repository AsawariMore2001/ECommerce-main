import { useEffect, useState } from "react";
import { db } from "../firebase.config";
import { collection, onSnapshot } from "firebase/firestore";


const useGetDataNew=(collectionRef)=>{

    const [data,setData]=useState([])
    const [loading,setLoading]=useState(true)

    

    useEffect(()=>{
        const getData =async()=>{

            //====firebase realtime data update=====//

            await onSnapshot(collectionRef,(snapshot)=>{
                setData(snapshot.docs.map(doc=>({...doc.data(),id:doc.id})))
                setLoading(false)
            })
            
        }

        getData()
    },[])

    return{ data,loading}
}

export default useGetDataNew