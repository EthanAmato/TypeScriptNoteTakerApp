import { Form, Stack, Row, Col, Button } from 'react-bootstrap';
import CreatableReactSelect from "react-select/creatable"; //a combination of a textarea and select element
                                                           //used for adding new / existing tags to document
import {Link} from "react-router-dom";
import { FormEvent, useRef, useState } from 'react';
import { Note, NoteData, Tag } from '../App';
import { v4 as uuidV4 } from "uuid";

type NoteFormProps = {
    onSubmit: (data: NoteData) => void //onSubmit function takes data in form of NoteData and return void
    onAddTag: (newTag:Tag) => void
    availableTags: Tag[]
}

export function NoteForm({onSubmit, onAddTag, availableTags}:NoteFormProps) {

    const titleRef = useRef<HTMLInputElement>(null);
    const bodyMarkdownRef = useRef<HTMLTextAreaElement>(null); //I believe this is TS for indicating the type of element for    
                                                               //each ref
    const [selectedTags, setSelectedTags] = useState<Tag[]>([]);


    function handleSubmit(e: FormEvent) {
        e.preventDefault(); //When clicking "Save" button, prevent it from submitting the form 
                            //and instead execute this code

        onSubmit({
            title: titleRef.current!.value,
            body: bodyMarkdownRef.current!.value, //'!' tells TSX that this value will never be null
                                                  //we know this to be the case bc they are required values
                                                  //in the form
            tags: selectedTags
        })
    }

    return (
        <Form onSubmit={handleSubmit}>
            {/* Space out elements in vertical stack on top of each other */}
            <Stack gap={4}>
                <Row>
                    <Col>
                        <Form.Group controlId='title'>
                            <Form.Label>Title</Form.Label>
                            <Form.Control  ref={titleRef} required/>
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group controlId='tags'>
                            <Form.Label>Tags</Form.Label>
                            <CreatableReactSelect 
                                onCreateOption={label => { //need this because onChange doesn't account for new options automatically
                                    const newTag = { id: uuidV4(), label}
                                    onAddTag(newTag)
                                    setSelectedTags(prev => [...prev, newTag])
                                }}
                                value={selectedTags.map((tag)=>
                                    {
                                        return { label: tag.label, value: tag.id}
                                    })} 
                                isMulti
                                options={availableTags.map(tag => {
                                    return {label: tag.label, value: tag.id}
                                })}
                                onChange={tags => {
                                    setSelectedTags(tags.map(tag => {
                                        return {label: tag.label, id: tag.value}
                                    }))
                                }}
                                />
                        </Form.Group>
                    </Col>
                </Row>
                    <Col>
                        <Form.Group  controlId='markdown'>
                            <Form.Label>Body</Form.Label>
                            <Form.Control  ref={bodyMarkdownRef} required as="textarea" rows={15}/>
                        </Form.Group>
                    </Col>
                    <Stack className="justify-content-end" direction="horizontal" gap={2}>
                        <Button type='submit' variant='primary'>Save</Button>
                        <Link to="..">
                            <Button type='button' variant='outline-danger'>Cancel</Button>
                        </Link>
                    </Stack>
            </Stack>
        </Form>
    )
}