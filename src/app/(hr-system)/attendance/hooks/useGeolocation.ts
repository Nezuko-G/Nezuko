"use client";

import { useState, useCallback, useRef, useEffect } from "react";

export type GeolocationState = "fetching" | "detected" | "denied" | "unavailable" | "timed_out";
export type PermissionState = "prompt" | "granted" | "denied" | "unavailable";

export interface GeoCoords {
  lat: number;
  lng: number;
}

const TIMEOUT_MS = 5000;

function getCurrentPosition(): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: true,
      timeout: TIMEOUT_MS,
      maximumAge: 0,
    });
  });
}

export function useGeolocation() {
  const [coords, setCoords] = useState<GeoCoords | null>(null);
  const [state, setState] = useState<GeolocationState>("fetching");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [permissionState, setPermissionState] = useState<PermissionState>("prompt");
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const handlePosition = useCallback((position: GeolocationPosition) => {
    if (!mountedRef.current) return;
    setCoords({
      lat: position.coords.latitude,
      lng: position.coords.longitude,
    });
    setState("detected");
    setErrorMessage(null);
  }, []);

  const handlePositionError = useCallback((error: GeolocationPositionError) => {
    if (!mountedRef.current) return;
    if (error.code === error.PERMISSION_DENIED) {
      setState("denied");
      setErrorMessage("Location access denied");
    } else if (error.code === error.TIMEOUT) {
      setState("timed_out");
      setErrorMessage("Location detection timed out");
    } else {
      setState("unavailable");
      setErrorMessage("Location unavailable");
    }
  }, []);

  const requestLocation = useCallback(() => {
    if (!mountedRef.current) return;
    setCoords(null);
    setErrorMessage(null);

    if (!navigator.geolocation) {
      setState("unavailable");
      setErrorMessage("Geolocation not supported");
      return;
    }

    setState("fetching");
    setTimeout(() => {
      if (mountedRef.current) {
        getCurrentPosition()
          .then(handlePosition)
          .catch(handlePositionError);
      }
    }, 0);
  }, [handlePosition, handlePositionError]);

  const refreshLocation = useCallback((): Promise<GeoCoords | null> => {
    if (!navigator.geolocation) {
      if (!mountedRef.current) return Promise.resolve(null);
      setState("unavailable");
      return Promise.resolve(null);
    }

    return getCurrentPosition()
      .then((position) => {
        if (!mountedRef.current) return null;
        const c = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setCoords(c);
        setState("detected");
        setErrorMessage(null);
        return c;
      })
      .catch((error: GeolocationPositionError) => {
        if (!mountedRef.current) return null;
        if (error.code === error.PERMISSION_DENIED) {
          setState("denied");
        } else {
          setState("unavailable");
        }
        return null;
      });
  }, []);

  useEffect(() => {
    if (!mountedRef.current) return;
    if (!navigator.geolocation) {
      setState("unavailable");
      setErrorMessage("Geolocation not supported");
      return;
    }

    if (navigator.permissions?.query) {
      navigator.permissions.query({ name: "geolocation" }).then((status) => {
        if (!mountedRef.current) return;
        setPermissionState(status.state as PermissionState);

        status.onchange = () => {
          if (!mountedRef.current) return;
          const newState = status.state as PermissionState;
          setPermissionState(newState);
          if (newState === "granted" || newState === "prompt") {
            requestLocation();
          }
        };
      }).catch(() => {
        if (!mountedRef.current) return;
        setPermissionState("unavailable");
      });
    }

    getCurrentPosition()
      .then(handlePosition)
      .catch(handlePositionError);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    coords,
    state,
    errorMessage,
    permissionState,
    refreshLocation,
    retryLocation: requestLocation,
  };
}
