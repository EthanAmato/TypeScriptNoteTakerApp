import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useMemo } from 'react';
import { Container } from 'react-bootstrap';
import { Routes, Route, Navigate } from 'react-router-dom';
import { NewNote } from './components/NewNote';
import { useLocalStorage } from './hooks/useLocalStorage';
import { v4 as uuidV4 } from "uuid";
import { NoteList } from './components/NoteList';
import { NoteLayout } from './components/NoteLayout';
import { Note } from './components/Note';
import { EditNote } from './components/EditNote';
import { Login } from './components/Login';
import { Register } from './components/Register';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, getUserNotes } from "./firebase";
import { Navbar } from './components/Navbar';
import { ResetPassword } from './components/ResetPassword';
import { getAuth, onAuthStateChanged } from 'firebase/auth';


export type Note = {
  id: string,
} & NoteData; //Note is just our note data + an id 

export type RawNote = { //only stores Id of tag
  //if we update a tag's label, you don't have to update every single note 
  //helps with propagating changes to a single tag
  id: string,
} & RawNoteData;

export type RawNoteData = {
  title: string,
  body: string,
  tagIds: string[]
}
export type NoteData = {
  title: string,
  body: string,
  tags: Tag[],
}

export type Tag = {
  id: string,
  label: string
}

function App() {
  const [notes, setNotes] = useLocalStorage<RawNote[]>("NOTES", [])
  const [tags, setTags] = useLocalStorage<Tag[]>("TAGS", [])

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, async (user) => {    
      if (user) {
        const userData = await getUserNotes(user?.uid);
        setNotes((prevNotes) => {
          return userData.userNotes
        }) 
        // setTags(userData.userTags);
        setTags((prevNotes) => {
          return userData.userTags
        })
        
      } else {
        setNotes(() => {
          return []
        }) 
        // setTags(userData.userTags);
        setTags(() => {
          return []
        })
      }
      
    });
  },[])
  

  const notesWithTags = useMemo(() => {
    return notes.map(note => { //loop through all my notes
      return { ...note, tags: tags.filter(tag => { return note.tagIds.includes(tag.id) }) } //for each note, keep all info of note,
      //and attach tags that have associated id
    })
  }, [notes, tags]) //only run when notes or tags change

  function onCreateNote({ tags, ...data }: NoteData) {
    setNotes((prevNotes) => {
      //set notes to all prev notes with an additional note that consists of:
      //1. data, which consists of the note Title and note Body
      //2. A string-based, unique ID
      //3. tagIds, an array of Ids associated with user-assigned tags. This method of storage allows for
      //easier post-hoc relabeling and deletion propagation
      console.log([
        ...prevNotes,
        { ...data, id: uuidV4(), tagIds: tags.map(tag => tag.id) } //uuidV4() lets us create a string-based id that is always unique
      ])
      return [
        ...prevNotes,
        { ...data, id: uuidV4(), tagIds: tags.map(tag => tag.id) } //uuidV4() lets us create a string-based id that is always unique
      ]
    });
  };

  function onUpdateNote(id: string, { tags, ...data }: NoteData) {
    setNotes((prevNotes) => {
      //set notes to all prev notes with an additional note that consists of:
      //1. data, which consists of the note Title and note Body
      //2. A string-based, unique ID
      //3. tagIds, an array of Ids associated with user-assigned tags. This method of storage allows for
      //easier post-hoc relabeling and deletion propagation
      return prevNotes.map(note => {
        if (note.id === id) {
          //replace edited note with the new info
          return { ...note, ...data, tagIds: tags.map(tag => tag.id) }
        } else {
          return note;
        }
      })
    });
  }

  function onDeleteNote(id: string) {
    setNotes(prevNotes => {
      return prevNotes.filter(note => note.id !== id);
    })
  }

  function addTag(newTag: Tag) {
    setTags(prev => [...tags, newTag]);
  }

  function updateTag(id: string, label: string) {
    setTags((prevTags) => {
      //set notes to all prev notes with an additional note that consists of:
      //1. data, which consists of the note Title and note Body
      //2. A string-based, unique ID
      //3. tagIds, an array of Ids associated with user-assigned tags. This method of storage allows for
      //easier post-hoc relabeling and deletion propagation
      return prevTags.map(tag => {
        if (tag.id === id) {
          //replace edited note with the new info
          return { ...tag, label }
        } else {
          return tag;
        }
      })
    });
  }

  function deleteTag(id: string) {
    setTags(prevTags => {
      return prevTags.filter(tag => tag.id !== id);
    })
  }

  return (
    <>
      <Navbar />
      <Container className="my-4">
        <Routes>
          <Route path="/" element={<NoteList updateTag={updateTag} deleteTag={deleteTag} availableTags={tags} notes={notesWithTags} />}></Route>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/resetpassword" element={<ResetPassword />} />
          <Route path="/new" element={<NewNote onSubmit={onCreateNote} onAddTag={addTag} availableTags={tags} />}></Route>
          <Route path="/:id" element={<NoteLayout notes={notesWithTags} />}>
            <Route index element={<Note onDeleteNote={onDeleteNote} />} />
            <Route path="edit" element={<EditNote onSubmit={onUpdateNote} onAddTag={addTag} availableTags={tags} />} />
          </Route>
          <Route path="*" element={<Navigate to="/"></Navigate>}></Route>
        </Routes >
      </Container>
    </>
  )
}

export default App
