import type { APIRoute } from 'astro';
import { INTERNAL_SERVICE_REMINDERS_ENDPOINT } from 'astro:env/server';
import { parse, format } from "@formkit/tempo";

export const prerender = false

export const DELETE: APIRoute = async ({ params }) => {
  const { id } = params;

  if (!id) {
    return new Response(JSON.stringify({ error: 'ID no proporcionado' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const backendUrl = `${INTERNAL_SERVICE_REMINDERS_ENDPOINT}/${id}`;

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

export const PUT: APIRoute = async ({request, params }) => {
  const { id } = params;

  try {
    const bodyData = await request.json();
    bodyData.nextExecution = format(parse(bodyData.nextExecution, "YYYY-MM-DDTHH:mm"), "DD-MM-YYYY HH:mm");

    const response = await fetch(`${INTERNAL_SERVICE_REMINDERS_ENDPOINT}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type' : 'application/json'
      },
      body: JSON.stringify(bodyData)
    });

    if (!response.ok) {
      return new Response(JSON.stringify({ error: 'Error al actualizar en el servicio' }), {
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