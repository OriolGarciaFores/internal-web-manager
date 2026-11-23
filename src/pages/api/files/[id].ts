import type { APIRoute } from 'astro';
import { INTERNAL_SERVICE_FILES_ENDPOINT } from 'astro:env/server';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
    try {
        const dataFile = await request.formData();
        const file = dataFile.get('file');

        if (!file || !(file instanceof File)) {
            return new Response(JSON.stringify({ error: 'Archivo no propocionado' }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const bodyData = new FormData();
        bodyData.append('file', file, file.name);

        const response = await fetch(INTERNAL_SERVICE_FILES_ENDPOINT, {
            method: 'POST',
            body: bodyData
        });

        if (!response.ok) {
            return new Response(JSON.stringify({ error: 'Error al subir el fichero en el servicio' }), {
                status: response.status,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        return new Response(null, { status: 204 });
    } catch (error) {
        console.error('Error de conexión:', error);
        return new Response(JSON.stringify({ error: 'Error interno del servidor' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
};


export const DELETE: APIRoute = async ({ params }) => {
    const { id } = params;

    if (!id) {
        return new Response(JSON.stringify({ error: 'ID no proporcionado' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    try {
        const backendUrl = `${INTERNAL_SERVICE_FILES_ENDPOINT}/${id}`;

        const response = await fetch(backendUrl, {
            method: 'DELETE'
        });

        if (response.ok) {
            return new Response(null, { status: 204 }); // Éxito sin contenido
        } else {
            return new Response(JSON.stringify({ error: 'Error al eliminar en el servicio' }), {
                status: response.status,
                headers: { 'Content-Type': 'application/json' },
            });
        }
    } catch (error) {
        console.error('Error de conexión:', error);
        return new Response(JSON.stringify({ error: 'Error interno del servidor' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
};



export const GET: APIRoute = async ({ params }) => {
    const { id } = params;

    if (!id) {
        return new Response(JSON.stringify({ error: 'ID no proporcionado' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    try {
        const backendUrl = `${INTERNAL_SERVICE_FILES_ENDPOINT}/${id}/download`;

        const response = await fetch(backendUrl, {
            method: 'GET'
        });

        if (response.ok) {
            const headers = new Headers();
            const contentType = response.headers.get("content-type");
            const contentDisposition = response.headers.get("content-disposition");

            if (contentType) {
                headers.set("Content-Type", contentType);
            }
            if (contentDisposition) {
                headers.set("Content-Disposition", contentDisposition);
            }

            return new Response(response.body, {
                status: response.status,
                headers,
            });
        } else {
            return new Response(JSON.stringify({ error: 'Error al descargar el archivo desde el servicio' }), {
                status: response.status,
                headers: { 'Content-Type': 'application/json' },
            });
        }
    } catch (error) {
        console.error('Error de conexión:', error);
        return new Response(JSON.stringify({ error: 'Error interno del servidor' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
};