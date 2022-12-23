import React, {ChangeEvent, KeyboardEvent, useEffect, useRef, useState, UIEvent} from 'react';
import './App.css';
import {io} from 'socket.io-client';

type Message = {
    id: string
    message: string
    user: {
        id: string,
        name: string
    }
}

// const socket = io('https://chat-socket-io-back-production.up.railway.app/');
const socket = io('http://localhost:5000/');

function App() {


    const [text, setText] = useState('')
    const [name, setName] = useState('')
    const [messages, setMessages] = useState<Message[]>([])
    const [autoScrollMode, setAutoScrollMode] = useState(true)
    const [lastScrollTop, setLastScrollTop] = useState(0)
    const messagesAnchorRef = useRef<HTMLDivElement>(null)

    const onMessageChangeHandler = (e: ChangeEvent<HTMLTextAreaElement>) => {
        setText(e.currentTarget.value)
    }
    const onNameChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setName(e.currentTarget.value)
    }

    const onMessageSendHandler = () => {
        socket.emit('client-message-sent', text)
        setText('')
    }
    const onNameSetHandler = () => {
        socket.emit('client-name-set', name)
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
        socket.on('init-messages-published', (messages: Message[]) => {
            setMessages(messages)
        })
        socket.on('new-message-sent', (newMessage: Message) => {
            setMessages((prevMessages) => [...prevMessages, newMessage])
        })
    }, [])

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
