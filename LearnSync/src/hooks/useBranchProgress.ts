"use client";

import { useEffect, useState } from "react";
import { subscribeToBranchLiveStats, type BranchLiveStats } from "../lib/firebase";

const defaultStats: BranchLiveStats = {
  activeStudents: 0,
  totalStudySeconds: 0
};

export function useBranchProgress(branchId: string) {
  const [stats, setStats] = useState<BranchLiveStats>(defaultStats);

  useEffect(() => {
    const unsubscribe = subscribeToBranchLiveStats(branchId, setStats);
    return unsubscribe;
  }, [branchId]);

  return stats;
}
