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
