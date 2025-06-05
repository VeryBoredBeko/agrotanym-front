import { WeatherApiResponse } from "@/interfaces/weather-forecast-api-response";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";

interface WeatherCardProps {
  data: WeatherApiResponse;
}

export const WeatherCard: React.FC<WeatherCardProps> = ({ data }) => {
  const location = data.location;
  const forecastDays = data.forecast.forecastday;

  return (
    <div className="w-full max-w-3xl mx-auto px-4">
      <Carousel>
        <CarouselContent>
          {forecastDays.map((day, index) => (
            <CarouselItem key={index}>
              <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-6 space-y-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-bold">
                      {location.name}, {location.country}
                    </h2>
                    <p className="text-gray-500 text-sm">{day.date}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Image
                      src={`https:${day.day.condition.icon}`}
                      alt={day.day.condition.text}
                      width={64}
                      height={64}
                    />
                    <span className="text-3xl font-semibold">{day.day.avgtemp_c}°C</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
                  <div><strong>Ең жоғарғы температура:</strong> {day.day.maxtemp_c}°C</div>
                  <div><strong>Ең төменгі температура:</strong> {day.day.mintemp_c}°C</div>
                  <div><strong>Ылғалдылық:</strong> {day.day.avghumidity}%</div>
                  <div><strong>Жаңбыр ықтималдығы:</strong> {day.day.daily_chance_of_rain}%</div>
                  <div><strong>Қар ықтималдығы:</strong> {day.day.daily_chance_of_snow}%</div>
                  <div><strong>Жел жылдамдығы:</strong> {day.day.maxwind_kph} км/сағ</div>
                  <div><strong>УК индексі:</strong> {day.day.uv}</div>
                  <div><strong>Көріну қашықтығы:</strong> {day.day.avgvis_km} км</div>
                </div>

                <div className="text-sm text-gray-600">
                  <h3 className="font-semibold mb-2">🌄 Астрономиялық ақпарат</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div><strong>Күннің шығуы:</strong> {day.astro.sunrise}</div>
                    <div><strong>Күннің батуы:</strong> {day.astro.sunset}</div>
                    <div><strong>Айдың шығуы:</strong> {day.astro.moonrise}</div>
                    <div><strong>Айдың батуы:</strong> {day.astro.moonset}</div>
                    <div><strong>Ай фазасы:</strong> {day.astro.moon_phase}</div>
                    <div><strong>Ай жарықтығы:</strong> {day.astro.moon_illumination}%</div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">🕒 Сағаттық болжам</h3>
                  <div className="flex overflow-x-auto gap-4 pb-2">
                    {day.hour.map((hour, hourIndex) => (
                      <div
                        key={hourIndex}
                        className="bg-gray-100 rounded-xl p-2 min-w-[90px] text-center"
                      >
                        <p className="text-xs">{hour.time.split(" ")[1]}</p>
                        <Image
                          src={`https:${hour.condition.icon}`}
                          alt={hour.condition.text}
                          width={48}
                          height={48}
                          className="mx-auto"
                        />
                        <p className="font-semibold">{hour.temp_c}°</p>
                        <p className="text-xs text-gray-500">{hour.condition.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Carousel Navigation */}
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
};
