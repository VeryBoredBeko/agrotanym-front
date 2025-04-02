export default function ProfilePage() {
  return (
    <div className="p-4">
      <section className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
        {[
          "/blackspot-plant-disease.jpg",
          "/plants/wheat-disease.jpg",
          "/plants/patterned-chlorosis.jpg",
          "/blackspot-plant-disease.jpg",
          "/plants/wheat-disease.jpg",
          "/plants/patterned-chlorosis.jpg",
          "/blackspot-plant-disease.jpg",
          "/plants/wheat-disease.jpg",
          "/plants/patterned-chlorosis.jpg",
          "/blackspot-plant-disease.jpg",
          "/plants/wheat-disease.jpg",
          "/plants/patterned-chlorosis.jpg",
          "/blackspot-plant-disease.jpg",
          "/plants/wheat-disease.jpg",
          "/plants/patterned-chlorosis.jpg",
        ].map((src, index) => (
          <div key={index} className="relative">
            <img
              src={src}
              alt="Plant disease"
              className="w-full h-auto rounded-xl shadow-2xl shadow-slate-800/50 break-inside-avoid"
            />
            <p className="absolute w-full bottom-0 p-4 text-lg font-serif italic bg-white rounded-lg">
              <span className="">{src}</span>
            </p>
          </div>
        ))}
      </section>
    </div>
  );
}
