import CenitalMapDesktop from "./CenitalMapDesktop";
import CenitalMapMobile from "./CenitalMapMobile";
import { LOTES, type Lote } from "../data/lotes";

export default function CenitalMap({ lotes = LOTES }: { lotes?: Lote[] }) {
  return (
    <>
      <div className="hidden md:block">
        <CenitalMapDesktop lotes={lotes} />
      </div>
      <div className="md:hidden">
        <CenitalMapMobile lotes={lotes} />
      </div>
    </>
  );
}
