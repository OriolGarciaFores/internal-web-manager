import type { APIRoute } from 'astro';
import { INTERNAL_SERVICE_REMINDERS_ENDPOINT } from 'astro:env/server';

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
    // Construimos la URL hacia Spring Boot incluyendo el id
    const backendUrl = `${INTERNAL_SERVICE_REMINDERS_ENDPOINT}/${id}`;

    const response = await fetch(backendUrl, {
      method: 'DELETE',
    });

    if (response.ok) {
      return new Response(null, { status: 204 }); // Éxito sin contenido
    } else {
      return new Response(JSON.stringify({ error: 'Error al eliminar en el servicio backend' }), {
        status: response.status,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  } catch (error) {
    console.error('Error de conexión con Spring Boot:', error);
    return new Response(JSON.stringify({ error: 'Error interno del servidor' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};