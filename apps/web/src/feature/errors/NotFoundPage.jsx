import { ZumScreen } from "../../components/domain/ZumScreen.jsx";
import { Button } from "../../components/ui/Button.jsx";

export function NotFoundPage() {
  return (
    <ZumScreen
      mood="esperando"
      title="Esta celda no existe"
      description="La dirección que abriste no lleva a ninguna parte del panal. Volvamos al panal."
      action={<Button to="/">Ir a Hoy</Button>}
    />
  );
}
