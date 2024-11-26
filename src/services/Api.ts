export class Api {
    static baseUrl = "http://127.0.0.1:8000/api";

    // Método para POST (crear un nuevo recurso)
    static async post<T>(url: string, data: any): Promise<any> {
        
        
        const formData = new FormData();
        var e=0;
        Object.keys(data).forEach((key) => {
            if (key === 'font_file' || key === 'certificate_template') {
              // Solo añadir los archivos si existen
              e=1;

              if (data[key]) {
                formData.append(key, data[key]);
                console.log(key + ':', data[key]+" formdata.");
              }
            } else {
              formData.append(key, data[key]);
              console.log(key + ':', data[key]+" json");
            }
          });
        const isFormData = data instanceof FormData;

        if (!e) {
            console.log("detectó el formData");
        } else {
            console.log("detectó JSON");
        }

        const response = await fetch(`${Api.baseUrl}${url}`, {
        method: "POST",
        // headers: !e
        //     ? { "Content-Type": "application/json" } // Solo si NO es FormData
        //     : { "Content-Type": "multipart/form-data" }, // header si es FormData
        body: e ? data : JSON.stringify(data), // Si es FormData, usarlo tal cual
        });

        const dataResponse = await response.json();

        return {
        statusCode: response.status,
        data: dataResponse,
        };
    }

   

    // Método para PUT (actualizar un recurso existente completamente)
    static async put<T>(url: string, data: any): Promise<any> {

        const formData = new FormData();
        var e=0;
        Object.keys(data).forEach((key) => {
            if (key === 'font_file' || key === 'certificate_template') {
              // Solo añadir los archivos si existen
              e=1;

              if (data[key]) {
                formData.append(key, data[key]);
                console.log(key + ':', data[key]);
              }
            } else {
              formData.append(key, data[key]);
              console.log(key + ':', data[key]);
            }
          });
        const isFormData = data instanceof FormData;

        if (!e) {
            console.log("detectó el JSON");
        } else {
            console.log("detectó formData");
        }
        const response = await fetch(`${Api.baseUrl}${url}`, {
        method: "PUT",
        headers: !e
            ? { "Content-Type": "application/json" }
            : { "Content-Type": "multipart/form-data" },
        body: e ? data : JSON.stringify(data),
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
