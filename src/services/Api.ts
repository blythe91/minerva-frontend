export class Api {
    static baseUrl = "http://127.0.0.1:8000/api";

    // Método para POST (crear un nuevo recurso)
    static async post<T>(url: string, data: any): Promise<any> {
        const response = await fetch(`${Api.baseUrl}${url}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        const dataResponse = await response.json();

        return {
            statusCode: response.status,
            data: dataResponse,
        };
    }

    // Método para GET (obtener datos)
    static async get<T>(url: string): Promise<any> {
        const response = await fetch(`${Api.baseUrl}${url}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        const dataResponse = await response.json();

        return {
            statusCode: response.status,
            data: dataResponse,
        };
    }

    // Método para PUT (actualizar un recurso existente completamente)
    static async put<T>(url: string, data: any): Promise<any> {
        const response = await fetch(`${Api.baseUrl}${url}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        const dataResponse = await response.json();

        return {
            statusCode: response.status,
            data: dataResponse,
        };
    }

    // Método para PATCH (actualizar parcialmente un recurso)
    static async patch<T>(url: string, data: any): Promise<any> {
        const response = await fetch(`${Api.baseUrl}${url}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        const dataResponse = await response.json();

        return {
            statusCode: response.status,
            data: dataResponse,
        };
    }

    // Método para DELETE (eliminar un recurso)
    static async delete<T>(url: string): Promise<any> {
        const response = await fetch(`${Api.baseUrl}${url}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        });

        const dataResponse = await response.json();

        return {
            statusCode: response.status,
            data: dataResponse,
        };
    }
}
