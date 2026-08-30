export function timeToMinutes(timeStr: string): number {
  if (!timeStr) return 0;
  const [hours, minutes] = timeStr.split(':').map(Number);
  return (hours || 0) * 60 + (minutes || 0);
}

export function minutesToTime(totalMinutes: number): string {
  const normalized = ((Math.floor(totalMinutes) % 1440) + 1440) % 1440;
  const hours = Math.floor(normalized / 60);
  const minutes = normalized % 60;
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

export function formatDuration(minutes: number): string {
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hrs > 0 && mins > 0) return `${hrs}h ${mins}m`;
  if (hrs > 0) return `${hrs} hrs`;
  return `${mins} mins`;
}

// Calculate train position at a given time in minutes along the corridor
export function getTrainPositionAtTime(
  trainSchedule: { km: number; timeMinutes: number }[],
  currentMinutes: number
): { km: number; inTransit: boolean; currentStation?: string } | null {
  if (!trainSchedule || trainSchedule.length < 2) return null;

  const firstStop = trainSchedule[0];
  const lastStop = trainSchedule[trainSchedule.length - 1];

  if (currentMinutes < firstStop.timeMinutes) {
    return { km: firstStop.km, inTransit: false, currentStation: 'Waiting to Start' };
  }
  if (currentMinutes > lastStop.timeMinutes) {
    return { km: lastStop.km, inTransit: false, currentStation: 'Arrived at Terminus' };
  }

  for (let i = 0; i < trainSchedule.length - 1; i++) {
    const p1 = trainSchedule[i];
    const p2 = trainSchedule[i + 1];

    if (currentMinutes >= p1.timeMinutes && currentMinutes <= p2.timeMinutes) {
      const segDuration = p2.timeMinutes - p1.timeMinutes;
      if (segDuration === 0) return { km: p1.km, inTransit: false };

      const ratio = (currentMinutes - p1.timeMinutes) / segDuration;
      const currentKm = p1.km + ratio * (p2.km - p1.km);
      return { km: currentKm, inTransit: true };
    }
  }

  return { km: lastStop.km, inTransit: false };
}
