import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { getPolygon } from "../../lib/analysis/analysis";
import { postform } from "../../lib/analysis/analysis";
import Toast from "../Toast/Toast";
import {useNavigate} from "react-router-dom";

type FormValues = {
    id_poligono: string;
    causa: string;
    solucion: string;
    fotos: FileList;
};

const NotificationForm = () => {

    const { id_poligono } = useParams<{ id_poligono: string }>();
    const [enviando, setEnviando] = useState(false);
    const [previewUrls, setPreviewUrls] = useState<string[]>([]);
    const [lote, setLote] = useState<string>("");
    const [finca, setFinca] = useState<string>("");
    const [showToast, setShowToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

    const navigate = useNavigate();

    const {
      register,
      handleSubmit,
      reset,
      watch,
      formState: { errors },
    } = useForm<FormValues>({
      defaultValues: {
          id_poligono: "",
          causa: "",
          solucion: "",
      },
    });

  useEffect(() => {
    reset((prev) => ({
      ...prev,
      id_poligono: id_poligono || "",
    }));
  }, [id_poligono, reset]);

  const fotosSeleccionadas = watch("fotos");
  useEffect(() => {
    if (!fotosSeleccionadas || fotosSeleccionadas.length === 0) {
      setPreviewUrls([]);
      return;
    }
    const urls = Array.from(fotosSeleccionadas).map((f) => URL.createObjectURL(f));
    setPreviewUrls(urls);
    return () => urls.forEach((u) => URL.revokeObjectURL(u));
  }, [fotosSeleccionadas]);

  const onSubmit = async (data: FormValues) => {
    try {
      setEnviando(true);
      const finaldata = {
        id_poligono: id_poligono || "",
        causa: data.causa,
        solucion: data.solucion,
        fotos: data.fotos ? Array.from(data.fotos) : [],
      };
      const token = localStorage.getItem("cognitoToken") || "";
      await postform(finaldata, token);
      reset({
        id_poligono: "",
        causa: "",
        solucion: "",
      });
      setPreviewUrls([]);
      setShowToast({ message: "Alerta guardada correctamente.", type: "success" }); 
      setTimeout(() => {
        navigate("/panel-finca");
      }, 1500);
    } catch (e: any) {
      console.error(e);
      setShowToast({ message: `Error: ${e?.message ?? "No se pudo guardar"}`, type: "error" });
    } finally {
      setEnviando(false);
    }
  };

  useEffect(() => {
    console.log("id_poligono", id_poligono);
    if (!id_poligono) return;
      try {
        const token = localStorage.getItem("cognitoToken") || "";
        getPolygon(token, id_poligono).then((data) => {
          setLote(data.lote || "");
          setFinca(data.finca || "");
        });
      } catch (e) {
        console.error(e);
      }

  }, [id_poligono]);


  return (
    <div className=" flex flex-col justify-center items-center">
      {showToast && (
        <Toast
          message={showToast.message}
          type={showToast.type}
          onClose={() => setShowToast(null)}
        />
      )}
      <h1 className="text-[#200085] text-2xl font-bold">
        Notificación de Incidencias
      </h1>
        <p className="text-gray-600 mt-2">
            Finca: <span className="font-semibold">{finca || "Cargando..."}</span> | Lote: <span className="font-semibold">{lote || "Cargando..."}</span>
        </p>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4  mt-4 w-full container bg-white md:mx-auto md:w-2xl p-4 md:p-10 rounded-xl shadow-lg">
        <div className="flex flex-col gap-2">
          <label
          className="text-black font-semibold"
          >Causa Detectada</label>
          <textarea
            rows={3}
            className="textarea bg-white text-neutral-500 border border-gray-300 w-full"
            placeholder="Describe la causa (plaga, riego, suelo, clima, etc.)"
            {...register("causa", { required: "La causa es requerida" })}
          />
          {errors.causa && (
            <p style={{ color: "#b91c1c", fontSize: 12 }}>{errors.causa.message}</p>
          )}
        </div>

        <div
        className="flex flex-col gap-2"
        >
          <label 
            className="text-black font-semibold"
          >Solución Aplicada</label>
          <textarea
            rows={3}
            className="textarea bg-white text-neutral-500 border border-gray-300 w-full"
            placeholder="Describe la acción tomada"
            {...register("solucion", { required: "La solución es requerida" })}
          />
          {errors.solucion && (
            <p style={{ color: "#b91c1c", fontSize: 12 }}>{errors.solucion.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-black font-semibold">Fotos</label>
          <input
            type="file"
            accept="image/*"
            className="file-input file-input-bordered w-full bg-white text-neutral-500"
            multiple
            {...register("fotos")}
          />
          {previewUrls.length > 0 && (
            <div style={{ display: "flex", gap: 8, marginTop: 8, flexWrap: "wrap" }}>
              {previewUrls.map((src, i) => (
                <img
                  key={i}
                  src={src}
                  className="h-24 w-24 object-cover rounded-lg border"
                  alt={`foto-${i}`}
                />
              ))}
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={enviando}
            className="btn bg-[#200085] text-white hover:bg-[#200085] border-none rounded-xl mt-4"
        >
          {enviando ? "Enviando..." : "Enviar"}
        </button>
      </form>
    </div>
  );
}

export default NotificationForm;