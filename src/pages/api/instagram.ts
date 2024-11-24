import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ url }) => {
  try {
    const instagramToken = import.meta.env.PUBLIC_INSTAGRAM_ACCESS_TOKEN;
    const instagramUserId = import.meta.env.PUBLIC_INSTAGRAM_USER_ID;
    
    const after = url.searchParams.get('after');
    const baseUrl = `https://graph.instagram.com/${instagramUserId}/media`;
    const fields = 'id,caption,media_type,media_url,permalink,timestamp';
    const afterParam = after ? `&after=${after}` : '';
    const finalUrl = `${baseUrl}?fields=${fields}&access_token=${instagramToken}&limit=12${afterParam}`;

    const response = await fetch(finalUrl);
    
    // Obtener la respuesta como texto primero
    const textResponse = await response.text();
    console.log('Respuesta cruda:', textResponse);

    let data;
    try {
      data = JSON.parse(textResponse);
    } catch (e) {
      return new Response(JSON.stringify({ 
        error: 'Error en la API de Instagram',
        rawResponse: textResponse
      }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Error completo:', error);
    return new Response(JSON.stringify({ 
      error: 'Error en el servidor',
      message: error.message
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
} 