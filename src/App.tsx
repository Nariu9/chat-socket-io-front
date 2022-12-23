import React, {ChangeEvent, KeyboardEvent, UIEvent, useEffect, useRef, useState} from 'react';
import './App.css';
import {useAppDispatch, useAppSelector} from './hooks';
import {sendNewMessage, setClientName, startConnection, stopConnection} from './chatSlice';


function App() {


    const [text, setText] = useState('')
    const [name, setName] = useState('')
    const [autoScrollMode, setAutoScrollMode] = useState(true)
    const [lastScrollTop, setLastScrollTop] = useState(0)
    const messagesAnchorRef = useRef<HTMLDivElement>(null)

    const messages = useAppSelector(state => state.chat.messages)
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
    }

    const onEnterDownHandler = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        e.key === 'Enter' && onMessageSendHandler()
    }

    const onScrollHandler = (e: UIEvent<HTMLDivElement>) => {
        if (e.currentTarget.scrollTop > lastScrollTop) {
            setAutoScrollMode(true)
        } else {
            setAutoScrollMode(false)
        }
        setLastScrollTop(e.currentTarget.scrollTop)
    }

    useEffect(() => {

        dispatch(startConnection())

        return () => {
            dispatch(stopConnection())
        }
    }, [dispatch])

    useEffect(() => {
        if (autoScrollMode) {
            messagesAnchorRef.current?.scrollIntoView({behavior: 'smooth'})
        }
    }, [autoScrollMode, messages])

    return (
        <div className="App">
            <div className="wrapper">
                <div className="messages" onScroll={onScrollHandler}>
                    {messages.map(m => <div key={m.id}>
                        <b>{m.user.name}: </b> {m.message}
                        <hr/>
                    </div>)}
                    <div ref={messagesAnchorRef}></div>
                </div>
                <div className="inputs">
                    <div>
                        <input type="text" value={name} onChange={onNameChangeHandler}/>
                        <button onClick={onNameSetHandler}>Set name</button>
                    </div>
                    <div>
                        <textarea value={text} onChange={onMessageChangeHandler} onKeyDown={onEnterDownHandler}/>
                        <button onClick={onMessageSendHandler}>Send</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;
