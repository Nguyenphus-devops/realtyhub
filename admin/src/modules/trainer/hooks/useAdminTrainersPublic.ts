import { useEffect, useState } from "react";
import api from "@/config/api";
import type { AdminTrainer } from "../models/trainer.model";

export function useAdminTrainersPublic() {
  const [trainers, setTrainers] = useState<AdminTrainer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    api
      .get("/trainers/public")
      .then((response) => {
        if (!active) return;
        const responseData = response.data;
        const data =
          responseData && responseData.data ? responseData.data : responseData;
        const rows = Array.isArray(data) ? data : [];
        setTrainers(
          rows.sort((first, second) =>
            String(first.name).localeCompare(String(second.name), "vi"),
          ),
        );
      })
      .catch(() => {
        if (active) setTrainers([]);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return { trainers, loading };
}
