import {io, Socket} from 'socket.io-client';
import {Message, User} from './chatSlice';


export const api = {
    socket: null as null | Socket,

    createConnection() {
        // this.socket = io('http://localhost:5000/');
        this.socket = io('https://chat-socket-io-back-production.up.railway.app/');
    },
    subscribe(initMessagesHandler: (messages: Message[]) => void, setMessageHandler: (message: Message) => void, userTypingHandler: (user: User) => void) {
        this.socket?.on('init-messages-published', initMessagesHandler)
        this.socket?.on('new-message-sent', setMessageHandler)
        this.socket?.on('user-typing', userTypingHandler)
    },
    destroyConnection() {
        this.socket?.disconnect()
        this.socket = null
    },
    sendName(name: string) {
        this.socket?.emit('client-name-set', name)
    },
    sendMessage(message: string) {
        this.socket?.emit('client-message-sent', message, (error: string | null) => {
            error && alert(error)
        })
    },
    messageTyping() {
        this.socket?.emit('client-typing')
    }
}