import { lazy, Suspense, type ComponentProps } from "react";
import { ClientOnly } from "@tanstack/react-router";
import type MapViewType from "./MapView";

const MapView = lazy(() => import("./MapView"));

function Fallback() {
  return <div className="flex h-full min-h-[300px] w-full items-center justify-center bg-muted text-sm text-muted-foreground">Chargement de la carte…</div>;
}

export function Map(props: ComponentProps<typeof MapViewType>) {
  return (
    <ClientOnly fallback={<Fallback />}>
      <Suspense fallback={<Fallback />}>
        <MapView {...props} />
      </Suspense>
    </ClientOnly>
  );
}
