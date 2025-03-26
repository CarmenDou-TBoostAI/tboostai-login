type EventCallback = () => void

class EventService {
    private listeners: { [key: string]: EventCallback[] } = {}

    subscribe(event: string, callback: EventCallback) {
        if (!this.listeners[event]) {
            this.listeners[event] = []
        }
        this.listeners[event].push(callback)
        
        // 返回取消订阅函数
        return () => {
            this.listeners[event] = this.listeners[event].filter(cb => cb !== callback)
        }
    }

    unsubscribe(event: string, callback: EventCallback) {
        if (this.listeners[event]) {
            this.listeners[event] = this.listeners[event].filter(cb => cb !== callback)
        }
    }

    emit(event: string) {
        if (this.listeners[event]) {
            this.listeners[event].forEach(callback => callback())
        }
    }
}

export const eventService = new EventService()