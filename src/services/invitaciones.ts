import type { APIInvitacionesResponse } from "../types/api";
import { API_URL } from "astro:env/server";
export const getInvitadosById = async ({id} : {id: string}  ) =>{
    const response = await fetch(
        `${API_URL}/invitados/${id}`,
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        },
    );
    const data = await response.json() as APIInvitacionesResponse;
    return data;
}
export const getInvitados = async () => {
    const response = await fetch(
        `${API_URL}/invitados`,
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        },
    );
    const data = await response.json() as APIInvitacionesResponse[]; 
    return data;
}