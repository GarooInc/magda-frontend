export async function postform(data: { id_poligono: string; causa: string; solucion: string; fotos: File[] }) { 
  // use postImage and uploadImageToS3 to upload images to S3 and get their URLs
  const urls = await Promise.all(
    data.fotos.map(async (file) => {
      const uploadUrl = await postImage(data.id_poligono);
      await uploadImageToS3(uploadUrl, file);
      // Extract the public URL from the upload URL
      return uploadUrl.split('?')[0];
    })
  );
  const dataWithUrls = {
    id_poligono: data.id_poligono,
    causa: data.causa,
    solucion: data.solucion,
    fotos: urls,
  };
  try {
    const response = await fetch(`https://magdalena-garoo.koyeb.app/psm/`, {
      method: "POST",
      body: JSON.stringify(dataWithUrls),
    });

    if (!response.ok) {
      const msg = await response.text().catch(() => "Error al enviar");
      throw new Error(msg);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error al hacer fetch:", error);
    throw error;
  }
}

export async function getPolygon(token: string, id: string) {
  try {
    const response = await fetch(`https://magdalena-garoo.koyeb.app/polygons`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const result = await response.json();
    const polygon = result.find((p: { _id: string; }) => p._id === id);
    if (!polygon) {
      throw new Error("Polígono no encontrado");
    }

    console.log("Fetched polygon data:", polygon);
    return polygon;
  } catch (error) {
    console.error("Error al hacer fetch:", error);
    throw error;
  }
}

export async function getFincasLotesMalos(token: string, temporada: number) {
  try {
    const response = await fetch(`https://magdalena-garoo.koyeb.app/analysis/fincas-lotes-malos?intervalo=${temporada}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error("Error al hacer fetch:", error);
    throw error;
  }
}

export async function getFincas(token: string) {
  try {
    const response = await fetch(`https://magdalena-garoo.koyeb.app/analysis/fincas`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error al hacer fetch:", error);
    throw error;
  }
}

export async function getDiferenciaLotesMalos(token: string, temporada: number, nombreFinca: string) {
  try {
    const response = await fetch(`https://magdalena-garoo.koyeb.app/analysis/diferencias-finca?finca=${nombreFinca}&intervalo=${temporada}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error al hacer fetch:", error);
    throw error;
  }
}

export async function getDetallePoligono(token: string, idPoligono: string, intervalo: number) {
  try {
    const response = await fetch(`https://magdalena-garoo.koyeb.app/analysis/polygon-detail?id=${idPoligono}&intervalo=${intervalo}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error al hacer fetch:", error);
    throw error;
  }
}


export async function getAlertas(token: string) {
  try {
    const response = await fetch(`https://magdalena-garoo.koyeb.app/notifications/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error al hacer fetch:", error);
    throw error;
  }
}

export async function postImage (idPolygon: string) {
  try {
    const response = await fetch(`https://bucket-magdalenas-garoo.koyeb.app/generate-upload-url`, {
      method: "POST",
      body: JSON.stringify({ filename: `${idPolygon}-${Date.now()}.jpeg` }),
      headers: {
        "x-api-key": import.meta.env.VITE_BUCKET_KEY
      }
    });

    if (!response.ok) {
      const msg = await response.text().catch(() => "Error al enviar");
      throw new Error(msg);
    }

    const result = await response.json();
    if (!result.url) {
      throw new Error("No se recibió URL");
    }

    return result.url;
  } catch (error) {
    console.error("Error al hacer fetch:", error);
    throw error;
  }
}

export async function uploadImageToS3 (url: string, file: File) {
  try {
    const response = await fetch(url, {
      method: "PUT",
      body: file,
      headers: {
        "Content-Type": "image/jpeg"
      }
    });

    if (!response.ok) {
      const msg = await response.text().catch(() => "Error al enviar");
      throw new Error(msg);
    }

    return true;
  } catch (error) {
    console.error("Error al hacer fetch:", error);
    throw error;
  }
}
