import { getAuth } from "firebase/auth";
import { useEffect, useState } from "react";
import { updateUserNotes } from "../firebase";

export function useLocalStorage<T>(key:string,
    initialValue: T | (()=>T)) { //can pass it a value or a function that returns a value
    const [value, setValue] = useState<T>(() => { 
        //check if something is already in storage
        const jsonValue = localStorage.getItem(key);
        if (jsonValue === null) {
            if(typeof initialValue === "function") {
                return (initialValue as () => T)() //run the function which is casted to a function that returns type T
                                                   //and return whatever it outputs
            } else {
                return initialValue;
            }
        } else {
            return JSON.parse(jsonValue);
        }
    });

    useEffect(() => {
        localStorage.setItem(key, JSON.stringify(value));
        const user = getAuth();
        if(user.currentUser) {
            updateUserNotes(user.currentUser.uid, key, value)
        }
    }, [value, key])

    return [value, setValue] as [T, typeof setValue]
}