import React from 'react';
import { ClimatologyData } from '@/interfaces/climatology';

export const ClimatologyComponent: React.FC<{ data: ClimatologyData }> = ({ data }) => {
  return (
    <div>
      <h1>{data.header.title}</h1>
      <p>API нұсқасы: {data.header.api.version}</p>
      <p>Дереккөздер: {data.header.sources.join(', ')}</p>
      <p>Уақыт аралығы: {data.header.range}</p>
      <h2>Координаталар: {data.geometry.coordinates.join(', ')}</h2>
      
      <h3>Параметрлер:</h3>
      <ul>
        {Object.keys(data.parameters).map((paramKey) => (
          <li key={paramKey}>
            <strong>{paramKey}</strong>: {data.parameters[paramKey].longname} ({data.parameters[paramKey].units})
          </li>
        ))}
      </ul>

      <h3>Messages:</h3>
      <ul>
        {data.messages.map((message, index) => (
          <li key={index}>{message}</li>
        ))}
      </ul>
    </div>
  );
};