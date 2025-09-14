import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
    },
});

const api2 = axios.create({
    baseURL: import.meta.env.VITE_API_URL2,
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
    },
});



export async function getEventsRules(){
   try{
       const { data } = await api2.get("/api-usb/push-notification/rules");
       console.log(data);
       return data;
   }catch (err){
       console.log(err);
   }
}

export async function postEventsRules(title: string, description: string | undefined, type: string) {
    try {
        const { data } = await api2.post("/api-usb/push-notification/rules", {
            title,
            description,
            type,
        });
        return data;
    } catch (err) {
        console.error("Ошибка postEventsRules", err);
    }
}


export async function patchHumorLevel(level: number) {
    try{
        const { data } = await api2.patch("/api-usb/humor", {
            level,
        });
        return data;
    }catch (err){
        console.log(err);
    }
}

export async function getHumorLevel() {
    try{
        const { data } = await api2.get("/api-usb/humor");
        return data;
    }catch (err){
        console.log(err);
    }
}

export async function getPushTemplates() {
    try{
        const { data } = await api2.get("/api-usb/templates");
        return data;
    }catch (err){
        console.log(err);
    }
}

export async function getPushTemplateById(id:number) {
    try{
        const { data } = await api2.get(`/api-usb/templates/${id}`);
        return data;
    }catch (err){
        console.log(err);
    }
}

export async function patchPushTemplate(id:number, text:string) {
    try{
        const {data} = await api2.patch(`/api-usb/templates/${id}`, {text})

        return data;

    }catch (err){
        console.log(err);
    }
}

export async function getTomOfVoice() {
    try{
        const {data} = await api2.get("/api-usb/tomOfVoice");
        return data;
    }catch (err){
        console.log(err);
    }
}

export async function postTomOfVoice(label:string) {
    try{
        const {data} = await api2.post("/api-usb/tomOfVoice", {label});
        return data;
    }catch (err){
        console.log(err);
    }
}

export async function removePostTomOfVoice(id:number) {
    try{
        const {data} = await api2.delete(`/api-usb/tomOfVoice/${id}`);
        return data;
    }catch (err){
        console.log(err);
    }
}

export async function createNotification(client_code: number, time: string){
    try{
        const {data} = await api.post(`/api/main/create-notification/${client_code}`, {"client-code":client_code, time});
        return data;
    }catch (err){
        console.log(err);
    }
}

export async function getStatus(key:number){
    try{
        const {data} = await api.get(`/api/main/notification/status/${key}`)
        return data;
    }catch (err){
        console.log(err);
    }
}

export async function getResult(key:number){
    try{
        const {data} = await api.get(`/api/main/notification/result/${key}`)
        return data;
    }catch (err){
        console.log(err);
    }
}

export async function dataKeys(key:number){
    try{
        const {data} = await api.get(`/api/main/notification/result/${key}`)
        return data;
    }catch (err){
        console.log(err);
    }
}