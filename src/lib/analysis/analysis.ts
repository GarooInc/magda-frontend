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
    console.log("Fetched data:", data);
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
    console.log("Fetched data:", data);
    return data;
  } catch (error) {
    console.error("Error al hacer fetch:", error);
    throw error;
  }
}

export async function getDiferenciaLotesMalos(token: string, temporada: number, nombreFinca: string) {
    console.log("Fetching with token:", token);
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
    console.log("Fetched data:", data);
    return data;
  } catch (error) {
    console.error("Error al hacer fetch:", error);
    throw error;
  }
}

export async function getDetallePoligono(token: string, idPoligono: string, intervalo: number) {
    console.log("Fetching with token:", token);
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
    console.log("Fetched data:", data);
    return data;
  } catch (error) {
    console.error("Error al hacer fetch:", error);
    throw error;
  }
}


export async function getAlertas() {
  try {
    const response = await fetch(`https://n8n.srv853599.hstgr.cloud/webhook/63efc370-69d6-426e-a0c3-83c920cb4afa`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("Fetched alertas:", data);
    return data;
  } catch (error) {
    console.error("Error al hacer fetch:", error);
    throw error;
  }
}
