import { useEffect } from "react";

export function useJobStream(onNewJob){
    useEffect(()=>{
        const eventSource = new EventSource("http://localhost:5000/api/jobpostings/stream");

        eventSource.onmessage =(event)=>{
            const job = JSON.parse(event.data);
            onNewJob(job);
        };

        eventSource.onerror=()=>{
            // Browser auto-reconnects on error — no extra logic needed
            console.warn("SSE connection lost, reconnecting...");
        };

        return ()=>eventSource.close(); //cleanup on unmount
    },[]);
}