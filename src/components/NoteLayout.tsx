import { Navigate, Outlet, useOutletContext, useParams } from "react-router-dom";
import { Note } from "../App";

type NoteLayoutProps = {
    notes: Note[]
}

export function NoteLayout({notes}:NoteLayoutProps) {
    const {id} = useParams() //gets the id from URL
    const note = notes.find(n=>n.id === id); //search all note to see if one of our notes has
                                             //id in the url
    if (note == null) return <Navigate to="/" replace/>


    //renders out a nested route (show or edit) with given context
    return <Outlet context={note}/>
}

export function useNote() {
    //used inside of of outlets - gives you all information from the outlet context (our note)
    return useOutletContext<Note>()
}