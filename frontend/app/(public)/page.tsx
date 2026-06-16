import Equipo from "@/components/Equipo";
import FeaturesInicio from "@/components/FeaturesInicio";
import HeroPrincipal from "@/components/HeroPrincipal";
import HeroSecundario from "@/components/HeroSecundario";
import PreguntasFrecuentes from "@/components/PreguntasFrecuentes";

export default function HomePage(){
  return(
    <div className="flex flex-col  min-h-screen items-center justify-center bg-mark">
      <HeroPrincipal/>
      <FeaturesInicio />
      <HeroSecundario />
      <PreguntasFrecuentes />
      <Equipo/>
    </div>
  );
}