import React from 'react';

// Tra cứu văn bằng - ghi nhận lượt tra cứu
export interface VanBangLookupRecord {
  id: string;
  quyetDinhId: string;
  soLuotTraCuu: number; // Tổng số lượt tra cứu theo quyết định
}

export interface UseVanBangLookupModel {
  lookupRecords: VanBangLookupRecord[];
  recordLookup: (quyetDinhId: string) => void;
  getLookupCountByQuyetDinh: (quyetDinhId: string) => number;
  getAllLookupStats: () => VanBangLookupRecord[];
}

const STORAGE_KEY = 'van_bang_lookup_data';

export const useVanBangLookupModel = (): UseVanBangLookupModel => {
  const [lookupRecords, setLookupRecords] = React.useState<VanBangLookupRecord[]>([]);

  React.useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setLookupRecords(JSON.parse(saved));
      } catch {
        setLookupRecords([]);
      }
    } else {
      setLookupRecords([]);
    }
  }, []);

  const saveToStorage = (data: VanBangLookupRecord[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  };

  return {
    lookupRecords,
    recordLookup: (quyetDinhId) => {
      const existing = lookupRecords.find((lr) => lr.quyetDinhId === quyetDinhId);
      let updated: VanBangLookupRecord[];

      if (existing) {
        updated = lookupRecords.map((lr) =>
          lr.quyetDinhId === quyetDinhId
            ? { ...lr, soLuotTraCuu: lr.soLuotTraCuu + 1 }
            : lr
        );
      } else {
        updated = [
          ...lookupRecords,
          {
            id: `lookup${Date.now()}`,
            quyetDinhId,
            soLuotTraCuu: 1,
          },
        ];
      }

      setLookupRecords(updated);
      saveToStorage(updated);
    },
    getLookupCountByQuyetDinh: (quyetDinhId) => {
      const record = lookupRecords.find((lr) => lr.quyetDinhId === quyetDinhId);
      return record ? record.soLuotTraCuu : 0;
    },
    getAllLookupStats: () => lookupRecords,
  };
};
