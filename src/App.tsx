import React, {ChangeEvent, useEffect, useRef, useState} from 'react';
import './App.css';
import {useAppDispatch, useAppSelector} from './hooks';
import {sendNewMessage, setClientName, startConnection, stopConnection, typeMessage} from './chatSlice';


function App() {

    const [text, setText] = useState('')
    const [name, setName] = useState('Anonymous')
    const [editMode, setEditMode] = useState(false)
    const messagesAnchorRef = useRef<HTMLDivElement>(null)

    const messages = useAppSelector(state => state.chat.messages)
    const typingUsers = useAppSelector(state => state.chat.typingUsers)
    const dispatch = useAppDispatch()

    const onMessageChangeHandler = (e: ChangeEvent<HTMLTextAreaElement>) => {
        setText(e.currentTarget.value)
    }
    const onNameChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setName(e.currentTarget.value)
    }

    const onMessageSendHandler = () => {
        dispatch(sendNewMessage(text))
        setText('')
    }
    const onNameSetHandler = () => {
        dispatch(setClientName(name))
        setEditMode(false)
    }

    const onTypingHandler = () => {
        dispatch(typeMessage())
    }

    const turnOnEditMode = () => {
        setEditMode(true)
    }

    const onBlurHandler = () => {
        onNameSetHandler()
    }

    useEffect(() => {
        dispatch(startConnection())
        return () => {
            dispatch(stopConnection())
        }
    }, [dispatch])

    useEffect(() => {
        messagesAnchorRef.current?.scrollIntoView({behavior: 'smooth'})
    }, [messages])

    return (
        <div className="App">
            <div className="wrapper">
                <div className="messages">
                    {messages.map(m => <div key={m.id}>
                        <b>{m.user.name}: </b> {m.message}
                        <hr/>
                    </div>)}
                    {typingUsers.map(u => <div key={u.id}>
                        <b>{u.name}: </b> ...
                    </div>)}
                    <div ref={messagesAnchorRef}></div>
                </div>
                <div className="inputs">
                    <div className={'nameBlock'}>
                        {editMode
                            ? <>
                                <input type="text" value={name} onChange={onNameChangeHandler} onBlur={onBlurHandler}
                                       autoFocus/>
                                <button onClick={onNameSetHandler}>Set name</button>
                            </>
                            : <span onClick={turnOnEditMode} className={'name'}>{name} ✏️</span>}

                    </div>
                    <div className={'messageBlock'}>
                        <textarea value={text} onChange={onMessageChangeHandler} onKeyDown={onTypingHandler}/>
                        <button onClick={onMessageSendHandler}>Send</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;
