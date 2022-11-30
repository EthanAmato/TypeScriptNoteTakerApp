import { useMemo, useState } from "react";
import { Badge, Button, Card, Col, Form, Modal, Row, Stack } from "react-bootstrap"
import { Link } from "react-router-dom"
import ReactSelect from "react-select"
import { Note, Tag } from "../App";
import styles from '../assets/styles/NoteList.module.css';
type NoteListProps = {
    availableTags: Tag[]
    notes: Note[]
    deleteTag: (id:string) => void
    updateTag: (id:string, label:string) => void
}

type SimplifiedNote = {
    id: string
    title: string
    tags: Tag[]
}

type EditTagsModalProps = {
    availableTags: Tag[]
    show: boolean
    handleClose: () => void
    deleteTag: (id:string) => void
    updateTag: (id:string, label:string) => void
}

export function NoteList({ availableTags, notes, deleteTag, updateTag }: NoteListProps) {

    const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
    const [title, setTitle] = useState("");
    const [editTagsModalIsOpen, setEditTagsModalIsOpen] = useState(false);

    const filteredNotes = useMemo(() => {
        return notes.filter(note => {
            return (title === "" || note.title.toLowerCase().includes(title.toLowerCase()))
                //Dont do anything if nothing in title, or return notes that only have title in common with their title
                &&
                (selectedTags.length === 0 || selectedTags.every(tag =>
                    note.tags.some(noteTag => noteTag.id === tag.id)));
            //Additionally, do nothing if no tags selected OR
            //Loop through all selected tag and make sure that it's true that
            //all selected tags are in associated in a given note
            //TLDR: MAKE SURE ALL TAGS MATCH NOT JUST 1
        })
    }, [title, selectedTags, notes]) //only refilter when one of these changes


    return (
        <>
            <Row className="align-items-center mb-4">
                <Col><h1>Notes</h1></Col>
                {/* xs (extra small) - push everything to right hand side by letting Notes column take up rest of space*/}
                <Col xs="auto">
                    <Stack gap={2} direction="horizontal">
                        <Link to="/login">
                            <Button variant="primary">Login</Button>
                        </Link>
                        <Link to="/new">
                            <Button variant="primary">Create</Button>
                        </Link>
                        <Button variant="outline-secondary" onClick={() => setEditTagsModalIsOpen(true)}>Edit Tags</Button>
                    </Stack>
                </Col>
            </Row>
            <Form>
                <Row className="mb-4">
                    <Col>
                        <Form.Group controlId="title">
                            <Form.Label>Title</Form.Label>
                            <Form.Control type="text"
                                // helps with setting up queries for filtering later
                                value={title}
                                onChange={e => setTitle(e.target.value)}
                            />
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group controlId='tags'>
                            <Form.Label>Tags</Form.Label>
                            <ReactSelect
                                value={selectedTags.map((tag) => {
                                    return { label: tag.label, value: tag.id }
                                })}
                                isMulti
                                options={availableTags.map(tag => {
                                    return { label: tag.label, value: tag.id }
                                })}
                                onChange={tags => {
                                    setSelectedTags(tags.map(tag => {
                                        return { label: tag.label, id: tag.value }
                                    }))
                                }}
                            />
                        </Form.Group>
                    </Col>
                </Row>
            </Form>
            {/* xs, sm, etc. tell the number of cols based on size of screen */}
            <Row xs={1} sm={2} lg={3} xl={4} className="g-3">
                {filteredNotes.map(note => {
                    return (
                        <Col key={note.id}>
                            <NoteCard id={note.id} title={note.title} tags={note.tags} />
                        </Col>
                    )
                })}
            </Row>
            <EditTagsModal 
                    show = {editTagsModalIsOpen} 
                    handleClose={() => setEditTagsModalIsOpen(false)} 
                    availableTags={availableTags}
                    updateTag ={updateTag}
                    deleteTag ={deleteTag}
            />
        </>
    )
}

function NoteCard({ id, title, tags}: SimplifiedNote) {
    return (
        //h-100 - fill full height
        //text-reset - reset color of text back to default color (instead of ugly <a></a> blue)
        //text-decoration-none - get rid of anchor underline
        //styles.card - comes from css modules for hover effects
        <Card as={Link} to={`/${id}`} className={`h-100 text-reset text-decoration-none ${styles.card}`}>
            <Card.Body>
                <Stack gap={2} className="align-items-center justify-content-center h-100">
                    <span className="fs-5">{title}</span>
                    {tags.length > 0 && (
                        <Stack gap={1} direction="horizontal" className="justify-content-center flex-wrap">
                            {tags.map(tag => {
                                //text truncate ensures that long tags are cut off
                                return (<Badge key={tag.id} className="text-truncate">{tag.label}</Badge>)
                            })}
                        </Stack>
                    )}
                </Stack>
            </Card.Body>
        </Card>

    )
}

function EditTagsModal({availableTags, handleClose, show, updateTag, deleteTag }: EditTagsModalProps) {
    return (<Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
            <Modal.Title>Edit Tags</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form>
                <Stack gap={2}>
                    {availableTags.map(tag => {
                        return(
                            <Row key={tag.id}>
                                <Col>
                                    <Form.Control 
                                        type="text" 
                                        value={tag.label}
                                        onChange={(e)=>updateTag(tag.id,e.target.value)}
                                    />
                                </Col>
                                <Col xs="auto">
                                    <Button 
                                        variant="outline-danger"
                                        onClick = {() => deleteTag(tag.id)}>
                                        &times;
                                    </Button>
                                </Col>
                            </Row>
                        )
                    })}
                </Stack>
            </Form>
        </Modal.Body>
    </Modal>)
}