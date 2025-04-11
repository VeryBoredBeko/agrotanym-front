import React from "react";

interface ClimatologyData {
  properties: {
    parameter: Record<string, Record<string, number | string>>;
  };
  parameters: Record<string, { units: string; longname: string }>;
}

const ClimatologyTable: React.FC<{ data: ClimatologyData }> = ({ data }) => {
  const parameters = data.properties.parameter;
  const paramInfo = data.parameters;
  const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC", "ANN"];

  const monthsTranslate = ["ҚАҢ", "АҚП", "НАУ", "СӘУ", "МАМ", "МАУ", "ШІЛ", "ТАМ", "ҚЫР", "ҚАЗ", "ҚАР", "ЖЕЛ", "ЖЫЛ"];

  // Переводы параметров на казахский язык
  const parameterTranslations = {
    SI_TILTED_AVG_HORIZONTAL: "Экваторға қарай көлденең беткейдегі күн сәулесі",
    SI_TILTED_AVG_LAT_MINUS15: "Экваторға қарай 15 градусқа еңкейген беткейдегі күн сәулесі",
    SI_TILTED_AVG_LATITUDE: "Экваторға қарай 0 градусқа еңкейген беткейдегі күн сәулесі",
    SI_TILTED_AVG_LAT_PLUS15: "Экваторға қарай 15 градусқа еңкейген беткейдегі күн сәулесі",
    SI_TILTED_AVG_VERTICAL: "Экваторға қарай вертикаль беткейдегі күн сәулесі",
    SI_TILTED_AVG_OPTIMAL: "Күн сәулесінің оңтайлы мөлшері",
    SI_TILTED_AVG_OPTIMAL_ANG: "Күн сәулесі үшін оңтайлы бұрыш",
    SI_TILTED_AVG_OPTIMAL_ANG_ORT: "Күн сәулесі үшін беткейдің оңтүстік/солтүстік бағыттылығы",
    PS: "Беттік қысым",
    PSC: "Атмосфералық қысымның түзетілген мәні",
    T2M: "Температура 2 метр биіктікте",
    WS10M: "Жел жылдамдығы 10 метр биіктікте",
    WSC: "Жел жылдамдығының түзетілген мәні",
  };

  return (
    <div className="overflow-x-auto p-4">
      <table className="table-auto border-collapse border border-gray-400 w-full text-sm">
        <thead>
          <tr className="bg-gray-200 text-left">
            <th className="border border-gray-400 px-2 py-1">Параметрлер</th>
            {monthsTranslate.map((month) => (
              <th key={month} className="border border-gray-400 px-2 py-1">
                {month}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Object.entries(parameters).map(([key, values]) => (
            <tr key={key} className="hover:bg-gray-100">
              <td className="border border-gray-400 px-2 py-1">
                <div className="font-semibold">{parameterTranslations[key as keyof typeof parameterTranslations] || paramInfo[key]?.longname || key}</div>
                <div className="text-xs text-gray-500">{paramInfo[key]?.units}</div>
              </td>
              {months.map((month) => (
                <td key={month} className="border border-gray-400 px-2 py-1 text-center">
                  {values[month] !== undefined ? values[month] : "-"}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};


export default ClimatologyTable;
