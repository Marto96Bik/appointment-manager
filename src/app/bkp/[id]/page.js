/*"use client";
import { useState, useEffect } from "react";
//import jwt_decode from "jwt-decode";
//import Link from "next/link";

export default function AppointmentDetailsPage(params: any) {
  const id = params;
  const [project, setProject] = useState([]);
  const [loading, setLoading] = useState(true);
  const url = `${process.env.apiUrl}/projects`;
  const urlInvest = `${process.env.apiUrl}/users/invest`;

  useEffect(() => {
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setProject(data.find((project) => project["_id"] === id));
        setLoading(false);
      })
      .catch((error) => console.log(error));
  }, [id]);

  const [message, setMessage] = useState("");

  const handleInvest = async () => {
    try {
      // Extrae el token del localStorage
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found");
      }

      // Decodifica el token para obtener el payload sin verificarlo
      const decodedToken = jwt.decode(token);
      const userId = decodedToken.userId; // Asegúrate de que el token contenga el userId

      // Realiza la solicitud fetch con el userId y projectId
      const response = await fetch(urlInvest, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authentication: token, // Opcionalmente, puedes enviar el token como header para autenticación
        },
        body: JSON.stringify({
          userId: userId,
          projectId: project["_id"],
        }),
      });

      if (!response.ok) {
        throw new Error("Error al realizar la inversión");
      }

      const data = await response.json();

      if (data.success) {
        setMessage("Operación realizada");
      } else {
        setMessage("Saldo Insuficiente");
      }
    } catch (error) {
      console.error("Error al invertir:", error);
      setMessage("Error al realizar la inversión");
    }
  };

  return (
    <main>
      <div>
        <div>
          {loading ? (
            <div className="loader-container">
              <div className="loader"></div>
            </div>
          ) : (
            <div className="max-w-lg mx-auto bg-white shadow-md rounded-lg overflow-hidden mb-6">
              <div className="p-4">
                <h2 className="text-2xl font-semibold text-gray-800">{project.name}</h2>
                <p className="text-sm text-gray-600">{project.info}</p>
                <p className="mt-2 text-gray-700">{project.detailed_info}</p>
                <hr className="my-4" />
                <div className="flex justify-between">
                  <div>
                    <p className="text-gray-600">Costo de Inversión:</p>
                    <p className="text-lg font-medium text-gray-800">
                      ${project.cost_investment.toLocaleString("es-ES")}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Retorno de Inversión:</p>
                    <ul className="list-disc pl-6 ">
                      <li className="text-sm text-gray-700">
                        Ingresos: ${project.investment_return.income.toLocaleString("es-ES")}
                      </li>
                      <li className="text-sm text-gray-700">
                        Costos Operativos: $
                        {project.investment_return.operating_costs.toLocaleString("es-ES")}
                      </li>
                      <li className="text-sm text-gray-700">
                        Beneficio Neto: $
                        {project.investment_return.net_profit.toLocaleString("es-ES")}
                      </li>
                      <li className="text-sm text-gray-700">
                        ROI: {project.investment_return.roi}
                      </li>
                      <li className="text-sm text-gray-700">
                        Periodo de Retorno: {project.investment_return.payback_period}
                      </li>
                    </ul>
                  </div>
                </div>
                <hr className="my-4" />
                <div>
                  <p className="text-gray-600">Riesgos:</p>
                  <p className="text-sm text-gray-700">{project.risks}</p>
                </div>
                <div className="mt-4">
                  <p className="text-gray-600">Estrategias de Mitigación:</p>
                  <p className="text-sm text-gray-700">{project.mitigation_strategies}</p>
                </div>
                <div className="flex justify-center mt-4">
                  <button
                    onClick={handleInvest}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 hover:shadow-md transition duration-200"
                  >
                    Invertir
                  </button>
                  <p className="mt-2 text-sm text-gray-700">{message}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}*/
