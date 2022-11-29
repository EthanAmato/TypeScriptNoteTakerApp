import 'bootstrap/dist/css/bootstrap.min.css';
import { useMemo } from 'react';
import { Container } from 'react-bootstrap';
import { Routes, Route, Navigate } from 'react-router-dom';
import { NewNote } from './components/NewNote';
import { useLocalStorage } from './hooks/useLocalStorage';
import { v4 as uuidV4 } from "uuid";

export type Note = {
  id: string,
} & NoteData; //Note is just our note data + an id 

export type RawNote = { //only stores Id of tag
                        //if we update a tag's label, you don't have to update every single note 
                        //helps with propagating changes to a single tag
  id:string,
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

  const notesWithTags = useMemo(() => {
    return notes.map(note => { //loop through all my notes
      return {...note, tags: tags.filter(tag => {return note.tagIds.includes(tag.id)})} //for each note, keep all info of note,
                                                                                        //and attach tags that have associated id
    })
  }, [notes,tags]) //only run when notes or tags change

  function onCreateNote({ tags, ...data }: NoteData) {
    setNotes((prevNotes) => {
      //set notes to all prev notes with an additional note that consists of:
      //1. data, which consists of the note Title and note Body
      //2. A string-based, unique ID
      //3. tagIds, an array of Ids associated with user-assigned tags. This method of storage allows for
      //easier post-hoc relabeling and deletion propagation
      return [
        ...prevNotes, 
        {...data, id: uuidV4(), tagIds: tags.map(tag => tag.id)} //uuidV4() lets us create a string-based id that is always unique
      ] 
    });
  };

  function addTag(newTag: Tag) {
    setTags(prev => [...tags,newTag]);
  }

  return (
    <Container className="my-4">
      <Routes>
        <Route path="/" element={<div>Home</div>}></Route>
        <Route path="/new" element={<NewNote onSubmit={onCreateNote} onAddTag={addTag} availableTags={tags}/>}></Route>
        <Route path="/:id">
          <Route index element={<h1>Show</h1>} />
          <Route path="edit" element={<h1>Edit</h1>} />
        </Route>
        <Route path="*" element={<Navigate to="/"></Navigate>}></Route>
      </Routes >
    </Container>
  )
}

export default App
